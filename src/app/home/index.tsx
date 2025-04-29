import { Link } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const HomePage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-8 text-center">
        Welcome to Our Rental App!
      </Text>
      <Text className="text-lg text-gray-600 mb-4 text-center">
        Please log in or sign up to continue.
      </Text>
      <View className="flex-row gap-4">
        <Link
          href="/(auth)/login"
          className="bg-primary text-white py-2 px-6 rounded-md font-semibold"
        >
          Log In
        </Link>
        <Link
          href="/(auth)/register"
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-semibold"
        >
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default HomePage;
