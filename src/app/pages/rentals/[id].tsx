import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useRental, Rental } from "@/hook/useRentals";
import { useAuth } from "@/hook/useAuth";
import usePayments from "@/hook/usePayment";

const RentalDetailsScreen = () => {
  const router = useRouter();
  const { id: rentalId } = useLocalSearchParams();
  const {
    rental,
    loading: rentalLoading,
    error: rentalError,
    getRentalById,
    updateRentalPaymentStatus,
    updateRentalStatus,
  } = useRental();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (rentalId) {
      getRentalById(rentalId as string);
    }
  }, [getRentalById, rentalId]);

  const navigateBack = () => {
    router.back();
  };

  const handleUpdatePaymentStatus = (status: "paid" | "unpaid") => {
    if (rental?.id) {
      updateRentalPaymentStatus(rental.id, status);
    }
  };

  const handleUpdateRentalStatus = (
    status: "pending" | "cancelled" | "success" | "ongoing"
  ) => {
    if (rental?.id) {
      updateRentalStatus(rental.id, status);
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

  const getPaymentStatusText = (status: Rental["paymentStatus"]) => {
    return status === "paid" ? "Bezahlt" : "Unbezahlt";
  };

  const getPaymentStatusColor = (status: Rental["paymentStatus"]) => {
    return status === "paid"
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800";
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
        onPress={navigateBack}
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
        <Text className="text-textSecondary">
          {rental.renter?.email || "Nicht verfügbar"}
        </Text>
      </View>
      <View className="mb-4">
        <Text className="text-lg font-semibold text-textPrimary">
          Vermieter
        </Text>
        <Text className="text-textSecondary">
          {rental.owner?.email || "Nicht verfügbar"}
        </Text>
      </View>
      <View className="mb-4">
        <Text className="text-lg font-semibold text-textPrimary">Preis</Text>
        <Text className="text-textSecondary">{rental.price} €</Text>
      </View>
      <View className="mb-4 flex flex-col items-center justify-center gap-4">
        <View>
          <Text className="text-lg font-semibold text-textPrimary">
            Zahlungsstatus
          </Text>
          <Text
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(
              rental.paymentStatus
            )}`}
          >
            {getPaymentStatusText(rental.paymentStatus).toUpperCase()}
          </Text>
        </View>
        {isRenter && rental.paymentStatus === "unpaid" && (
          <TouchableOpacity
            onPress={() => handleUpdatePaymentStatus("paid")}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md"
          > 
            <Text className="text-white">Bezahlen</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-4 flex flex-col items-center justify-center gap-4">
        <View>
          <Text className="text-lg font-semibold text-textPrimary">
            Mietstatus
          </Text>
          <Text
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
              rental.rentalStatus
            )}`}
          >
            {getStatusText(rental.rentalStatus).toUpperCase()}
          </Text>
        </View>
        <View className="flex flex-row items-center justify-center gap-6">
          {isOwner && (
            <View className="mt-2 flex items-center justify-center gap-4 flex-row space-x-2">
              {rental.rentalStatus !== "success" && (
                <TouchableOpacity
                  onPress={() => handleUpdateRentalStatus("success")}
                  className="bg-green-600 py-2 px-4 rounded-md"
                >
                  <Text className="text-white">Abschließen</Text>
                </TouchableOpacity>
              )}
              {rental.rentalStatus !== "ongoing" &&
                rental.paymentStatus === "paid" && (
                  <TouchableOpacity
                    onPress={() => handleUpdateRentalStatus("ongoing")}
                    className="bg-blue-600 py-2 px-4 rounded-md"
                  >
                    <Text className="text-white">Als Laufend Markieren</Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
          {(isOwner || isRenter) &&
            rental.rentalStatus !== "cancelled" &&
            rental.paymentStatus === "unpaid" && (
              <TouchableOpacity
                onPress={() => handleUpdateRentalStatus("cancelled")}
                className="mt-2 bg-red-600 py-2 px-4 rounded-md"
              >
                <Text className="text-white">Stornieren</Text>
              </TouchableOpacity>
            )}
          {isRenter &&
            rental.rentalStatus !== "cancelled" &&
            rental.paymentStatus === "paid" && (
              <TouchableOpacity
                onPress={() => handleUpdateRentalStatus("cancelled")}
                className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md"
              >
                <Text className="text-white">Stornieren</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible}
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-xl font-semibold mb-4">
              Zahlungsmethode Wählen
            </Text>
            <Text className="text-lg mb-4">
              Zu Zahlen: €{paymentAmount.toFixed(2)}
            </Text>
            {paymentError && (
              <Text className="text-red-500 mb-4">{paymentError}</Text>
            )}
            {paymentSuccess && (
              <View
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2"
                role="alert"
              >
                <Feather name="check-circle" size={20} />
                <Text className="font-bold">Success!</Text>
                <Text className="block sm:inline">Payment was successful.</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleMakePayment}
              className="bg-blue-600 py-3 px-4 rounded-md mb-4"
              disabled={isPaying || !stripe}
            >
              <Text className="text-white text-lg">
                {isPaying
                  ? "Zahlung wird verarbeitet..."
                  : "Mit Karte Bezahlen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPaymentModalVisible(false)}
              className="bg-gray-300 py-3 px-4 rounded-md"
              disabled={isPaying}
            >
              <Text className="text-lg">
                {isPaying ? "Abbrechen..." : "Abbrechen"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RentalDetailsScreen;
