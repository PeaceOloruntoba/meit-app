// Layout.tsx
import React from "react";
import "../global.css";
import { Slot, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import BottomNav from "@/components/BottomNav";
import { Feather } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "@/hook/useAuth"; // Import AuthProvider and useAuth
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const navigationItems = [
    {
      href: "/pages/search",
      icon: <Feather name="search" size={24} color={Colors.primary} />,
    },
    {
      href: "/pages/products",
      icon: <Feather name="grid" size={24} color={Colors.primary} />,
    },
    {
      href: "/pages/rentals",
      icon: <Feather name="list" size={24} color={Colors.primary} />,
    },
    {
      href: "/pages/profile",
      icon: <Feather name="user" size={24} color={Colors.primary} />,
    },
  ];

  // Show a loading indicator while checking auth state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <StatusBar style="dark" backgroundColor={Colors.background} />
          <Slot />
          {!user ? <BottomNav items={navigationItems} /> : null}
          <Toaster
            toastOptions={{
              style: { backgroundColor: "#F2F5FA" },
            }}
            richColors
          />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
