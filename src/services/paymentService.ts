import {
  initializeCheckout,
  RapydCheckout,
} from "@rapyd/react-native-checkout"; // Oder dein gewähltes Rapyd Frontend SDK
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner-native";
import CryptoJS from "crypto-js"; // Importiere CryptoJS

const OUR_CHARGE = 0.5; // Unsere Gebühr in EUR
const RAPYD_API_KEY = "DEINE_RAPYD_API_KEY";
const RAPYD_SECRET_KEY = "DEIN_RAPYD_SECRET_KEY";

interface RapydCheckoutData {
  sessionId: string;
  // Füge weitere benötigte Felder hinzu
}

const PaymentService = () => {
  const { user } = useAuth();

  const initiatePayment = async (
    amount: number,
    currency: string,
    metadata: any
  ): Promise<RapydCheckoutData | null> => {
    if (!user?.uid) {
      toast.error("Nicht authentifiziert.");
      return null;
    }
    try {
      const response = await fetch("https://sandboxapi.rapyd.net/v2/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_key: RAPYD_API_KEY,
          signature: generateRapydSignature("post", "/v2/checkout", {
            amount: amount,
            currency: currency,
            payment_method_options: {
              card: {
                request_three_d_secure: "auto",
              },
            },
            metadata: { ...metadata, userId: user.uid },
          }),
          timestamp: Math.floor(Date.now() / 1000).toString(),
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          payment_method_options: {
            card: {
              request_three_d_secure: "auto",
            },
          },
          metadata: { ...metadata, userId: user.uid },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          `Zahlung konnte nicht initialisiert werden: ${
            errorData.message || "Ein Fehler ist aufgetreten."
          }`
        );
        return null;
      }

      const data: RapydCheckoutData = await response.json();
      return data;
    } catch (error: any) {
      console.error("Fehler beim Initialisieren der Zahlung:", error);
      toast.error(
        `Fehler beim Initialisieren der Zahlung: ${
          error.message || "Ein unerwarteter Fehler ist aufgetreten."
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
      toast.error("Nicht authentifiziert.");
      return;
    }
    try {
      // 1. Aktualisiere den Zahlungsstatus der Miete in Firebase
      const rentalDocRef = doc(db, "rentals", rentalId);
      await updateDoc(rentalDocRef, { paymentStatus: "paid" });

      // 2. Erhöhe den Kontostand des Vermieters in Firebase
      const ownerDocRef = doc(db, "users", ownerId);
      const ownerSnap = await getDoc(ownerDocRef);
      const currentBalance = ownerSnap.data()?.accountBalance || 0;
      await updateDoc(ownerDocRef, {
        accountBalance: currentBalance + amount - OUR_CHARGE,
      });

      toast.success("Zahlung erfolgreich!");
    } catch (error: any) {
      console.error(
        "Fehler beim Verarbeiten der erfolgreichen Zahlung:",
        error
      );
      toast.error(
        `Fehler beim Verarbeiten der Zahlung: ${
          error.message || "Ein unerwarteter Fehler ist aufgetreten."
        }`
      );
    }
  };

  // **UNSICHER - NICHT FÜR PRODUKTION**
  const generateRapydSignature = (
    httpMethod: string,
    urlPath: string,
    body: any
  ) => {
    const salt = Math.random().toString(36).substring(7);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const data =
      httpMethod.toLowerCase() +
      urlPath +
      salt +
      timestamp +
      RAPYD_API_KEY +
      RAPYD_SECRET_KEY +
      (body ? JSON.stringify(body) : "");
    const hash = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(data));
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(hash));
  };

  return {
    initiatePayment,
    handleSuccessfulPayment,
    ourCharge: OUR_CHARGE,
  };
};

export default PaymentService;
