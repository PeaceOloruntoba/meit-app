import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner-native";
import CryptoJS from "crypto-js";

const OUR_CHARGE = 0.5;
const RAPYD_API_KEY = "rak_6550D3010117173AFCAF";
const RAPYD_SECRET_KEY =
  "rsk_0b7ceb3ed3512bf7ccf2aa79af9bb50edcac83a872c9ed9ff4f5bab889c65f609be7a8940c125742";

interface RapydCheckoutData {
  sessionId: string;
}

const PaymentService = () => {
  const { user } = useAuth();

  const initiatePayment = async (
    amount: number,
    currency: string,
    metadata: any
  ): Promise<RapydCheckoutData | null> => {
    if (!user?.uid) {
      toast.error("Not authenticated.");
      return null;
    }
    try {
      const httpMethod = "post";
      const urlPath = "/v2/checkout";
      const salt = Math.random().toString(36).substring(7);
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = {
        amount: amount,
        currency: currency,
        payment_method_options: {
          card: {
            request_three_d_secure: "auto",
          },
        },
        metadata: { ...metadata, userId: user.uid },
      };
      const dataToSign =
        httpMethod.toLowerCase() +
        urlPath +
        salt +
        timestamp +
        RAPYD_API_KEY +
        RAPYD_SECRET_KEY +
        JSON.stringify(body);
      const hash = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(dataToSign));
      const signature = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(hash)
      );

      const response = await fetch("https://sandboxapi.rapyd.net/v2/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_key: RAPYD_API_KEY,
          signature: signature,
          timestamp: timestamp,
          salt: salt,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Payment initiation failed: ${
            errorData.message || "An error occurred."
          }`
        );
        return null;
      }

      const data: RapydCheckoutData = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast.error(
        `Error initiating payment: ${
          error.message || "An unexpected error occurred."
        }`
      );
      return null;
    }
  };

  const handleSuccessfulPayment = async (
    rentalId: string,
    ownerId: string,
    amount: number
  ) => {
    if (!user?.uid) {
      toast.error("Not authenticated.");
      return;
    }
    try {
      const rentalDocRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalDocRef, { paymentStatus: "paid" });

      const ownerDocRef = doc(db, "users", ownerId);
      const ownerSnap = await getDoc(ownerDocRef);
      const currentBalance = ownerSnap.data()?.accountBalance || 0;
      await updateDoc(ownerDocRef, {
        accountBalance: currentBalance + amount - OUR_CHARGE,
      });

      toast.success("Payment successful!");
    } catch (error: any) {
      console.error("Error processing successful payment:", error);
      toast.error(
        `Error processing payment: ${
          error.message || "An unexpected error occurred."
        }`
      );
    }
  };

  return {
    initiatePayment,
    handleSuccessfulPayment,
    ourCharge: OUR_CHARGE,
  };
};

export default PaymentService;
