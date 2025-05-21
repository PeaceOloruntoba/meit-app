// @/hook/usePayment.ts
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore"; // Still needed for updateUserBalance refresh
import { db } from "firebaseConfig"; // Adjust path as needed
import { toast } from "sonner-native";
import axios from "axios";
import { useAuth } from "@/hook/useAuth"; // Adjust path as needed

const RENDER_BACKEND_URL = "https://silver-train-c0k5.onrender.com";

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}

const usePayments = () => {
  const { user, updateUserBalance } = useAuth();

  /**
   * Calls the backend to create a Payment Intent and returns its clientSecret.
   * The client-side payment confirmation is then handled by @stripe/stripe-react-native.
   * Firebase update for payment success is handled by the backend's webhook.
   */
  const getPaymentIntentClientSecret = useCallback(
    async (amount: number, rentalId: string, userId: string) => {
      if (!user?.uid) {
        toast.error("Nicht authentifiziert."); // Not authenticated.
        return null;
      }
      try {
        const response = await axios.post(
          `${RENDER_BACKEND_URL}/api/miet-app/payments/create-payment-intent`, // Corrected endpoint path
          {
            amount: amount, // Amount in EUR, backend converts to cents
            userId: userId,
            rentalId: rentalId,
          }
        );

        if (response.status !== 200) {
          throw new Error(
            response.data.error ||
              "Fehler beim Erstellen des Zahlungszwecks im Backend."
          ); // Error creating Payment Intent on backend.
        }
        return response.data.clientSecret;
      } catch (error: any) {
        console.error(
          "Fehler beim Abrufen des Client-Geheimnisses:",
          error.message
        ); // Error getting client secret:
        toast.error(
          `Fehler beim Abrufen des Client-Geheimnisses: ${error.message}`
        ); // Error getting client secret:
        return null;
      }
    },
    [user]
  );

  /**
   * Initiates a withdrawal (payout) by calling the backend's /withdraw endpoint.
   * The backend handles the Stripe transfer and the Firebase balance update.
   */
  const withdrawFunds = useCallback(
    async (amount: number, bankDetails: BankDetails): Promise<boolean> => {
      if (!user?.uid) {
        toast.error("Nicht authentifiziert."); // Not authenticated.
        return false;
      }

      // IMPORTANT: Your backend's /withdraw endpoint expects stripeAccountId.
      // Ensure this is available on the user object, or collect it from the user.
      const stripeAccountId = user?.stripeAccountId; // Assuming user.stripeAccountId exists

      if (!stripeAccountId) {
        toast.error(
          "Kein Stripe-Konto für Auszahlung verbunden. Bitte verbinden Sie zuerst Ihr Stripe-Konto."
        ); // No Stripe account connected for payout. Please connect your Stripe account first.
        return false;
      }

      try {
        // Call your Render.com backend to create a Transfer (Payout)
        const response = await axios.post(
          `${RENDER_BACKEND_URL}/api/miet-app/payments/withdraw`, // Corrected endpoint path
          {
            amount: amount, // Amount in EUR, backend converts to cents
            userId: user.uid,
            stripeAccountId: stripeAccountId,
            accountNumber: bankDetails.accountNumber,
            routingNumber: bankDetails.bankCode,
            accountHolderName: bankDetails.accountHolderName,
          }
        );

        if (response.status !== 200) {
          toast.error(
            `Stripe-Fehler (Auszahlung): ${
              response.data.error?.message || "Auszahlung fehlgeschlagen"
            }` // Stripe error (Withdrawal): Withdrawal failed
          );
          console.error("Transfer Error:", response.data);
          return false;
        }
        const { transferId } = response.data; // Assuming your backend returns transferId

        // Since the backend updates Firebase, we just need to refresh the local user balance.
        toast.success(`Auszahlung erfolgreich! Transfer-ID: ${transferId}`); // Withdrawal successful! Transfer ID:
        const updatedUserDoc = await getDoc(doc(db, "users", user.uid));
        if (updatedUserDoc.exists()) {
          updateUserBalance(updatedUserDoc.data().accountBalance);
        }
        return true;
      } catch (error: any) {
        console.error("Fehler bei der Auszahlung:", error.message); // Error withdrawing funds:
        toast.error(
          `Auszahlungsfehler: ${
            error.message || "Ein unerwarteter Fehler ist aufgetreten."
          }` // Withdrawal error: An unexpected error occurred.
        );
        return false;
      }
    },
    [user, updateUserBalance]
  );

  return { getPaymentIntentClientSecret, withdrawFunds };
};

export default usePayments;
