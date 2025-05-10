import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRental } from "@/hook/useRentals";
import { useAuth } from "@/hook/useAuth";
import { Rental as RentalType } from "@/hook/useRentals";

const RentalScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { loading, error, rentals, getRentalsByUserId, getRentalsByOwnerId } =
    useRental();
  const [tab, setTab] = useState<"gemietet" | "vermietet">("gemietet");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      if (tab === "gemietet") {
        await getRentalsByUserId(user.uid);
      } else {
        await getRentalsByOwnerId(user.uid);
      }
    };

    fetchData();
  }, [tab, user?.uid]);


  const navigateToDetails = (rentalId: string) => {
    router.push(`/pages/rentals/${rentalId}`);
  };

  const getStatusColor = (status: RentalType["rentalStatus"]) => {
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

  const getStatusIcon = (status: RentalType["rentalStatus"]) => {
    switch (status) {
      case "success":
        return "check-circle";
      case "ongoing":
        return "play-circle";
      case "pending":
        return "clock-o";
      case "cancelled":
        return "repeat";
      default:
        return "question-circle";
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-red-500">
          Fehler beim Laden der Mietvorgänge: {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-6 w-full flex flex-col items-center justify-center">
        <Text className="text-2xl font-semibold mb-4">Übersicht</Text>
        <View className="flex flex-row items-center justify-center space-x-2 text-lg bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
          <TouchableOpacity
            onPress={() => setTab("gemietet")}
            className={`flex-1 items-center py-3 rounded-lg mr-2 ${
              tab === "gemietet" ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                tab === "gemietet" ? "text-white font-bold" : "text-gray-700"
              }`}
            >
              Gemietet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("vermietet")}
            className={`flex-1 items-center py-3 rounded-lg ${
              tab === "vermietet" ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                tab === "vermietet" ? "text-white font-bold" : "text-gray-700"
              }`}
            >
              Vermietet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-6 px-4">
        {rentals.map((rental) => (
          <TouchableOpacity
            key={rental.id}
            onPress={() => navigateToDetails(rental.id!)}
            className="bg-white shadow-md shadow-black/70 p-4 rounded-lg mb-4 items-center flex flex-row items-center space-x-2"
          >
            <View
              className={`rounded-full w-12 h-12 flex items-center justify-center ${getStatusColor(
                rental.rentalStatus
              )}`}
            >
              <FontAwesome
                name={getStatusIcon(rental.rentalStatus)}
                size={24}
                color={
                  getStatusColor(rental.rentalStatus).includes("white")
                    ? "#3b5998"
                    : getStatusColor(rental.rentalStatus).split("-")[2]
                }
              />
            </View>
            <View className="flex flex-col">
              <Text className="text-lg font-bold">
                Produkt-ID: {rental.productId}
              </Text>
              <Text className="text-sm text-black/70">
                Mieter-ID: {rental.userId}
              </Text>
              <Text className="text-sm text-black/70">
                Vermieter-ID: {rental.ownerId}
              </Text>
              <Text className="text-sm text-black/70">
                Status: {rental.rentalStatus}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {rentals.length === 0 && !loading && (
          <Text className="text-center text-gray-500 mt-4">
            Keine Mietvorgänge gefunden.
          </Text>
        )}
      </View>
    </View>
  );
};

export default RentalScreen;
