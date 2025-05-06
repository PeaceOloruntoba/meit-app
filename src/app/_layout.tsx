import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import BottomNav from "@/components/BottomNav";
import { Feather } from "@expo/vector-icons";

export default function Layout() {
  const navigationItems = [
    {
      href: "/search",
      icon: <Feather name="search" size={24} color={Colors.primary} />,
    },
    {
      href: "/products",
      icon: <Feather name="grid" size={24} color={Colors.primary} />,
    },
    {
      href: "/rentals",
      icon: <Feather name="list" size={24} color={Colors.primary} />,
    },
    {
      href: "/profile",
      icon: <Feather name="user" size={24} color={Colors.primary} />,
    },
  ];
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <AuthProvider> */}
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Slot />
        <BottomNav items={navigationItems} />
        <Toaster
          toastOptions={{
            style: { backgroundColor: "#F2F5FA" },
          }}
          richColors
        />
        {/* </AuthProvider> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
