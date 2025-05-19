import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Feather,
  Banknote,
  Wallet,
  XCircle,
  CheckCircle,
} from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRental, Rental } from "@/hook/useRentals";
import { useAuth, User } from "@/hook/useAuth";
import { doc, updateDoc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "firebaseConfig";
import { toast } from "sonner-native";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import axios from "axios";

const STRIPE_PUBLISHABLE_KEY = "YOUR_STRIPE_PUBLISHABLE_KEY"; // Replace with your publishable key
const STRIPE_SECRET_KEY = "YOUR_STRIPE_SECRET_KEY"; // Replace with your Stripe secret key.  Keep this VERY secure.  For *local development only*.  **DO NOT COMMIT THIS TO A PUBLIC REPOSITORY.**

let stripePromise: Promise<Stripe | null>;

const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountHolderName: string;
}

interface StripeCheckoutData {
  paymentIntentClientSecret?: string;
  error?: string;
}

const usePayments = () => {
  const { user, updateUserBalance } = useAuth();
  const [stripe, setStripeInstance] = useState<Stripe | null>(null);
  const OUR_CHARGE = 0.5;

  useEffect(() => {
    const loadStripe = async () => {
      const stripeInstance = await getStripe();
      setStripeInstance(stripeInstance);
    };
    loadStripe();
  }, []);

  /**
   * Initiates a payment using Stripe.  This function now uses Axios to communicate directly with Stripe from the frontend.
   */
  const makePayment = useCallback(
    async (
      amount: number,
      rentalId: string,
      ownerId: string
    ): Promise<boolean> => {
      if (!user?.uid || !stripe) {
        toast.error("Not authenticated or Stripe not loaded.");
        return false;
      }

      try {
        const response = await axios.post(
          "https://api.stripe.com/v1/payment_intents",
          {
            amount: Math.round(amount * 100),
            currency: "eur",
            payment_method_types: ["card"],
            metadata: {
              rentalId,
              userId: user.uid,
            },
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );

        if (response.status !== 200) {
          toast.error(
            `Stripe error: ${
              response.data.error?.message || "Payment initiation failed"
            }`
          );
          return false;
        }

        const { client_secret: clientSecret } = response.data;

        // 2. Confirm Payment with Stripe.js
        const { error: confirmError, paymentIntent } =
          await stripe.confirmPayment({
            clientSecret: clientSecret,
            payment_method: {
              card: {
                number: "424242424242424242",
                exp_month: 12,
                exp_year: 2024,
                cvc: "123",
              },
            },
          });

        if (confirmError) {
          console.error("Payment confirmation error:", confirmError);
          toast.error(`Payment failed: ${confirmError.message}`);
          return false;
        }

        if (!paymentIntent) {
          toast.error("Payment failed.");
          return false;
        }

        if (paymentIntent.status !== "succeeded") {
          toast.error("Payment was not successful.");
          return false;
        }
        try {
          await runTransaction(db, async (transaction) => {
            const rentalDocRef = doc(db, "rentals", rentalId);
            const rentalDoc = await transaction.get(rentalDocRef);

            if (!rentalDoc.exists()) {
              throw "Rental document does not exist!";
            }
            const ownerDocRef = doc(db, "users", ownerId);
            const ownerDoc = await transaction.get(ownerDocRef);
            if (!ownerDoc.exists()) {
              throw "Owner document does not exist!";
            }

            const currentOwnerBalance = ownerDoc.data().accountBalance || 0;
            transaction.update(rentalDocRef, { paymentStatus: "paid" });
            transaction.update(ownerDocRef, {
              accountBalance: currentOwnerBalance + amount - OUR_CHARGE,
            });
          });
          toast.success("Payment successful!");
          return true;
        } catch (error: any) {
          console.error("Firebase transaction error:", error);
          toast.error(`Failed to update data: ${error.message}`);
          return false;
        }
      } catch (error: any) {
        console.error("Error making payment:", error);
        toast.error(
          `Payment error: ${error.message || "An unexpected error occurred."}`
        );
        return false;
      }
    },
    [user, stripe, OUR_CHARGE]
  );

  /**
   * Simulates withdrawing funds to a bank account by communicating directly with Stripe.
   */
  const withdrawFunds = useCallback(
    async (amount: number, bankDetails: BankDetails): Promise<boolean> => {
      if (!user?.uid) {
        toast.error("Not authenticated.");
        return false;
      }

      try {
        const transferResponse = await axios.post(
          "https://api.stripe.com/v1/transfers",
          {
            amount: Math.round(amount * 100),
            currency: "eur",
            destination: "bank_account",
            destination_data: {
              account_number: bankDetails.accountNumber,
              routing_number: bankDetails.bankCode,
              account_holder_name: bankDetails.accountHolderName,
            },
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );

        if (transferResponse.status !== 200) {
          toast.error(
            `Stripe error: ${
              transferResponse.data.error?.message || "Withdrawal failed"
            }`
          );
          return false;
        }
        const { id: transferId } = transferResponse.data;

        try {
          await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await transaction.get(userDocRef);

            if (!userDoc.exists()) {
              throw "User document does not exist!";
            }

            const currentBalance = userDoc.data().accountBalance || 0;
            if (currentBalance < amount + OUR_CHARGE) {
              throw "Insufficient funds.";
            }

            transaction.update(userDocRef, {
              accountBalance: currentBalance - (amount + OUR_CHARGE),
            });
          });
          toast.success(`Withdrawal successful! Transfer ID: ${transferId}`);
          const updatedUserDoc = await getDoc(doc(db, "users", user.uid));
          if (updatedUserDoc.exists()) {
            updateUserBalance(updatedUserDoc.data().accountBalance);
          }
          return true;
        } catch (error: any) {
          console.error("Firebase transaction error:", error);
          toast.error(`Failed to update balance: ${error.message}`);
          return false;
        }
      } catch (error: any) {
        console.error("Error withdrawing funds:", error);
        toast.error(
          `Withdrawal error: ${
            error.message || "An unexpected error occurred."
          }`
        );
        return false;
      }
    },
    [user, OUR_CHARGE, updateUserBalance]
  );

  return { makePayment, withdrawFunds, stripe };
};
