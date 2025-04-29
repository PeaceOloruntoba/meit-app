import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import Colors from "./constants/Colors";

const SplashScreen = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    // Simulate a loading process (e.g., checking auth state)
    const timer = setTimeout(() => {
      setSplashVisible(false);
      if (!loading) {
        if (isAuthenticated) {
          // Redirect authenticated users to the user home page
          router.replace("/users");
        } else {
          // Redirect unauthenticated users to the default home page with login/signup
          router.replace("/home");
        }
      }
    }, 3000); // 3-second splash screen

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, router]);

  if (splashVisible) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-3xl font-bold mb-4">
          Meit App
        </Text>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // This part will be rendered after the splash screen and redirection
  return null;
};

export default SplashScreen;
