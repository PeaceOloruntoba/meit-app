import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const SplashScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-textPrimary text-3xl font-bold mb-4">
        Welcome to Meit App: Search
      </Text>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default SplashScreen;
