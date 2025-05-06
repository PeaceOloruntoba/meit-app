import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const SplashScreen = () => {
  const router = useRouter();
  // const { isAuthenticated, loading } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Simulate a loading process (e.g., checking auth state)
    const timer = setTimeout(() => {
      setSplashVisible(false);
      router.replace("pages/search");
    }, 3000); // 3-second splash screen

    return () => clearTimeout(timer);
  }, [router]);

  if (splashVisible) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-textPrimary text-3xl font-bold mb-4">
          Welcome to Meit App
        </Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return null;
};

export default SplashScreen;
