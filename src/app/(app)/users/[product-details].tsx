import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const ProductDetailsPage = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-xl font-bold mb-4">Product Details</Text>
      <Text className="text-gray-600">Details for product ID: {id}</Text>
      {/* You'll fetch and display actual product details here */}
    </View>
  );
};

export default ProductDetailsPage;
