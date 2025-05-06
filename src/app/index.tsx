import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
        <Stack.Screen name="screens/search" />
        <Stack.Screen name="screens/products" />
        <Stack.Screen name="screens/overview" />
        <Stack.Screen name="screens/profile" />
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
}
