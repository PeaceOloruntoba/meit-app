// @/app/RentalDetailsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hook/useAuth";
import usePayments from "@/hook/usePayment";
import { useRental } from "@/hook/useRentals";

// Import from @stripe/stripe-react-native
import {
  useStripe,
  CardField,
  StripeProvider,
} from "@stripe/stripe-react-native";

interface Rental {
  id?: string;
  productId: string;
  userId: string; // Renter's ID
  ownerId: string;
  price: number;
  rentalStatus: "pending" | "cancelled" | "success" | "ongoing";
  paymentStatus: "paid" | "unpaid";
  product?: { name: string };
  renter?: { email: string };
  owner?: { email: string };
}

const RentalDetailsScreen = () => {
  const router = useRouter();
  const { id: rentalId } = useLocalSearchParams();
  const { user: currentUser } = useAuth();

  const {
    rental,
    loading: rentalLoading,
    error: rentalError,
    getRentalById,
    updateRentalPaymentStatus, // This is the function we'll call
    updateRentalStatus,
  } = useRental();

  const { getPaymentIntentClientSecret } = usePayments();
  const { confirmPayment } = useStripe();

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (rentalId) {
      getRentalById(rentalId as string);
    }
  }, [rentalId, getRentalById]);

  const handleUpdateRentalStatus = (
    status: "pending" | "cancelled" | "success" | "ongoing"
  ) => {
    if (rental?.id) {
      updateRentalStatus(rental.id, status);
    }
  };

  const handleMakePayment = async () => {
    if (!rental || !currentUser?.uid) {
      setPaymentError("Mietdaten oder Benutzer nicht verfügbar.");
      return;
    }

    setIsPaying(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    try {
      // 1. Get clientSecret from your backend via usePayments hook
      const clientSecret = await getPaymentIntentClientSecret(
        rental.price, // Amount in EUR
        rental.id!,
        currentUser.uid
      );

      if (!clientSecret) {
        setPaymentError("Konnte den Zahlungszweck nicht initialisieren.");
        setIsPaying(false);
        return;
      }

      // 2. Confirm the Payment with @stripe/stripe-react-native's confirmPayment
      const { error: confirmError, paymentIntent } = await confirmPayment(
        clientSecret,
        {
          paymentMethodType: "Card", // Specify the payment method type for CardField
        }
      );

      if (confirmError) {
        console.error("Zahlungsbestätigungsfehler:", confirmError);
        setPaymentError(`Zahlung fehlgeschlagen: ${confirmError.message}`);
        setIsPaying(false);
        return;
      }

      // Check if paymentIntent exists and status is 'Succeeded'
      if (paymentIntent && paymentIntent.status === "Succeeded") {
        // 3. Payment successful on Stripe's side.
        setPaymentSuccess(true);
        setIsPaymentModalVisible(false); // Close modal on success

        // Your requested addition: Update payment status on frontend immediately.
        // Note: Your backend webhook will also update this, creating redundancy.
        // This is for immediate UI feedback.
        await updateRentalPaymentStatus(rental.id!, "paid");

        // Re-fetch rental data to ensure consistency with backend (especially after webhook)
        getRentalById(rental.id!);
      } else {
        setPaymentError("Zahlung war nicht erfolgreich."); // Payment was not successful.
        setIsPaying(false);
        return;
      }
    } catch (error: any) {
      console.error("Fehler beim Bezahlen:", error);
      setPaymentError(
        `Zahlungsfehler: ${
          error.message || "Ein unerwarteter Fehler ist aufgetreten."
        }`
      );
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusColor = (status: Rental["rentalStatus"]) => {
    switch (status) {
      case "success":
        return "bg-green-200 text-green-800";
      case "ongoing":
        return "bg-blue-200 text-blue-800";
      case "pending":
        return "bg-orange-200 text-orange-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: Rental["paymentStatus"]) =>
    status === "paid"
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";

  const getStatusText = (status: Rental["rentalStatus"]) => {
    switch (status) {
      case "success":
        return "Erfolgreich";
      case "ongoing":
        return "Laufend";
      case "pending":
        return "Ausstehend";
      case "cancelled":
        return "Storniert";
      default:
        return "";
    }
  };

  if (rentalLoading) {
    return (
      <View className="flex-1 p-4 items-center bg-background justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (rentalError || !rental) {
    return (
      <View className="flex-1 p-4 items-center bg-background justify-center">
        <Text className="text-red-500">Fehler beim Laden der Details.</Text>
        {rentalError && <Text className="text-red-500">{rentalError}</Text>}
      </View>
    );
  }

  const isOwner = currentUser?.uid === rental.ownerId;
  const isRenter = currentUser?.uid === rental.userId;

  return (
    // IMPORTANT: StripeProvider should ideally wrap your entire app's root.
    // Placing it here for demonstration, but move it to your App.tsx or _layout.tsx
    <StripeProvider
      publishableKey="pk_test_51NBFG2Ioz4yMDiVH7gp18aylib6U8rFzOhG4IhG3fHxhnx7FZpdv5f903a2nhBM9PTm2jhVBtasa09JL2mlPwav2005U5oGu7x" // Your publishable key
      // urlScheme="your-app-scheme" // Required for 3D Secure and other redirects (e.g., 'mietapp')
      // merchantIdentifier="merchant.com.your-app-name" // Optional, for Apple Pay
    >
      <View className="flex-1 bg-background p-4 pt-20">
        <TouchableOpacity
          onPress={router.back}
          className="absolute top-20 right-4 bg-black rounded-md p-2 z-10"
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-4 text-textPrimary">
          Mietvorgang Details
        </Text>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-textPrimary">
            Produkt
          </Text>
          <Text className="text-textSecondary">
            {rental.product?.name || "Nicht verfügbar"}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-textPrimary">Mieter</Text>
          <Text className="text-textSecondary">{rental.renter?.email}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-textPrimary">
            Vermieter
          </Text>
          <Text className="text-textSecondary">{rental.owner?.email}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-textPrimary">Preis</Text>
          <Text className="text-textSecondary">{rental.price} €</Text>
        </View>

        <View className="mb-4 flex items-center gap-4">
          <Text className="text-lg font-semibold text-textPrimary">
            Zahlungsstatus
          </Text>
          <Text
            className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(
              rental.paymentStatus
            )}`}
          >
            {rental.paymentStatus === "paid" ? "BEZAHLT" : "UNBEZAHLT"}
          </Text>

          {isRenter && rental.paymentStatus === "unpaid" && (
            <TouchableOpacity
              onPress={() => setIsPaymentModalVisible(true)}
              className="bg-indigo-600 py-2 px-4 rounded-md"
            >
              <Text className="text-white">Jetzt bezahlen</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mb-4 flex items-center gap-4">
          <Text className="text-lg font-semibold text-textPrimary">
            Mietstatus
          </Text>
          <Text
            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
              rental.rentalStatus
            )}`}
          >
            {getStatusText(rental.rentalStatus).toUpperCase()}
          </Text>

          <View className="flex-row gap-3 mt-2">
            {isOwner && rental.rentalStatus !== "success" && (
              <TouchableOpacity
                onPress={() => handleUpdateRentalStatus("success")}
                className="bg-green-600 py-2 px-4 rounded-md"
              >
                <Text className="text-white">Abschließen</Text>
              </TouchableOpacity>
            )}

            {isOwner &&
              rental.paymentStatus === "paid" &&
              rental.rentalStatus !== "ongoing" && (
                <TouchableOpacity
                  onPress={() => handleUpdateRentalStatus("ongoing")}
                  className="bg-blue-600 py-2 px-4 rounded-md"
                >
                  <Text className="text-white">Laufend</Text>
                </TouchableOpacity>
              )}

            {(isOwner || isRenter) && rental.rentalStatus !== "cancelled" && (
              <TouchableOpacity
                onPress={() => handleUpdateRentalStatus("cancelled")}
                className="bg-red-600 py-2 px-4 rounded-md"
              >
                <Text className="text-white">Stornieren</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={isPaymentModalVisible}
          onRequestClose={() => setIsPaymentModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white p-6 rounded-lg w-4/5">
              <Text className="text-xl font-semibold mb-4">
                Zahlung fortsetzen
              </Text>
              <Text className="text-lg mb-2">
                Zu zahlen: €{rental.price.toFixed(2)}
              </Text>

              {paymentError && (
                <Text className="text-red-500 mb-2">{paymentError}</Text>
              )}

              {paymentSuccess && (
                <Text className="text-green-600 font-semibold mb-2">
                  Zahlung erfolgreich!
                </Text>
              )}

              {/* CardField for secure card input */}
              <View
                style={{
                  height: 50,
                  marginVertical: 10,
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <CardField
                  postalCodeEnabled={false} // Adjust based on your needs
                  style={{ height: 50 }}
                  cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000",
                    placeholderColor: "#A0A0A0",
                  }}
                />
              </View>

              <TouchableOpacity
                disabled={isPaying}
                onPress={handleMakePayment}
                className="bg-blue-600 py-3 px-4 rounded-md mb-3"
              >
                <Text className="text-white text-lg">
                  {isPaying ? "Zahle..." : "Mit Karte bezahlen"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsPaymentModalVisible(false)}
                disabled={isPaying}
                className="bg-gray-300 py-2 px-4 rounded-md"
              >
                <Text>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </StripeProvider>
  );
};

export default RentalDetailsScreen;
