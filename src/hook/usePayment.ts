import { useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";

const BACKEND_URL = "https://silver-train.onrender.com/miet-app";

export function usePayments() {
  const stripe = useStripe();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent on your backend and confirm payment with Stripe
  async function pay(amount: number, userId: string, rentalId: string) {
    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent on backend
      const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, userId, rentalId }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("No client secret returned from backend");
      }

      // 2. Confirm payment with Stripe React Native SDK
      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment(clientSecret, {
          paymentMethodType: "Card", // Adjust if you use other payment methods
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === "Succeeded") {
        setLoading(false);
        return paymentIntent;
      }

      throw new Error("Payment not completed");
    } catch (err: any) {
      setError(err.message || "Payment failed");
      setLoading(false);
      throw err;
    }
  }

  // Withdraw funds via your backend
  async function withdraw(amount: number, userId: string, stripeAccountId: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, userId, stripeAccountId }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Withdrawal failed");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || "Withdrawal failed");
      setLoading(false);
      throw err;
    }
  }

  return { pay, withdraw, loading, error };
}
