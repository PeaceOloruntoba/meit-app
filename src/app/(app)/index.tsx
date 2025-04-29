import React from "react";
import { View, Text } from "react-native";

const LandingPage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Welcome to Our Rental App!</Text>
      <Text className="mt-2 text-gray-600">
        This is the general landing page.
      </Text>
    </View>
  );
};

export default LandingPage;
