import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import BottomNav from "./components/BottomNav";

export default function Page() {
  const navigationItems = [
    {
      href: "/search",
      icon: <Feather name="grid" size={24} color={Colors.primary} />,
    },
    {
      href: "/products",
      icon: <Feather name="search" size={24} color={Colors.primary} />,
    },
    {
      href: "/overview",
      icon: <Feather name="list" size={24} color={Colors.primary} />,
    },
    {
      href: "/profile",
      icon: <Feather name="user" size={24} color={Colors.primary} />,
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F5FA" }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="search" />
        <Stack.Screen name="screens/search-details" />
        <Stack.Screen name="products" />
        <Stack.Screen name="screens/add-products" />
        <Stack.Screen name="screens/product-details" />
        <Stack.Screen name="overview" />
        <Stack.Screen name="screens/overview-details" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="screens/edit-profile" />
        <Stack.Screen name="screens/login" />
        <Stack.Screen name="screens/register" />
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
}
