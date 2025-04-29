import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const RentalDetailsPage = () => {
  const { rental } = useLocalSearchParams();

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-xl font-bold mb-4">Rental Details</Text>
      <Text className="text-gray-600">Details for rental ID: {rental}</Text>
      {/* Display rental details and approval/disapproval options */}
    </View>
  );
};

export default RentalDetailsPage;
