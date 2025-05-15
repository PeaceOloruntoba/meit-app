import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useRental, Rental } from "@/hook/useRentals";
import { useAuth } from "@/hook/useAuth";

interface RentalDetailsParams {
  id: string;
}

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
      <View className="mb-4">
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
        {isRenter && rental.paymentStatus === "unpaid" && (
          <TouchableOpacity
            onPress={() => handleUpdatePaymentStatus("paid")}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-md"
          >
            <Text>Als Bezahlt Markieren</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="mb-4">
        <Text className="text-lg font-semibold text-textPrimary">
          Mietstatus
        </Text>
        <Text
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
            rental.rentalStatus
          )}`}
        >
          {rental.rentalStatus.toUpperCase()}
        </Text>
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
  );
};

export default RentalDetailsScreen;
