import {
  initializeCheckout,
  RapydCheckout,
} from "@rapyd/react-native-checkout";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner-native";

const OUR_CHARGE = 0.5;

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
      toast.error("Nicht authentifiziert.");
      return null;
    }
    try {
      const response = await fetch("/api/create-rapyd-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
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

  return {
    initiatePayment,
    handleSuccessfulPayment,
    ourCharge: OUR_CHARGE,
  };
};

export default PaymentService;
