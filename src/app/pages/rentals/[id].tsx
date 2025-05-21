import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRental, Rental } from "@/hook/useRentals";
import { useAuth } from "@/hook/useAuth";
import { usePayments } from "@/hook/usePayment";

const RentalDetailsScreen = () => {
  const router = useRouter();
  const { id: rentalId } = useLocalSearchParams();
  const { user: currentUser } = useAuth();

  const {
    rental,
    loading: rentalLoading,
    error: rentalError,
    getRentalById,
    updateRentalPaymentStatus,
    updateRentalStatus,
  } = useRental();

  const { pay } = usePayments();
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (rentalId) getRentalById(rentalId as string);
  }, [rentalId]);

  const handleUpdateRentalStatus = (
    status: "pending" | "cancelled" | "success" | "ongoing"
  ) => {
    if (rental?.id) updateRentalStatus(rental.id, status);
  };

  const handleMakePayment = async () => {
    if (!rental) return;
    setIsPaying(true);
    setPaymentError(null);
    try {
      const paymentIntent = await pay(
        rental.price * 100,
        currentUser!.uid,
        rental.id
      );
      if (paymentIntent?.status === "Succeeded") {
        setPaymentSuccess(true);
        updateRentalPaymentStatus(rental.id, "paid");
      } else {
        throw new Error("Zahlung nicht abgeschlossen.");
      }
    } catch (err: any) {
      setPaymentError(err.message);
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
        <Text className="text-lg font-semibold text-textPrimary">Produkt</Text>
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
  );
};

export default RentalDetailsScreen;
