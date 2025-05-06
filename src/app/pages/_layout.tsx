import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native";
import { useEffect } from "react";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import BottomNav from "@/components/BottomNav";

const AppLayout = () => {
  const router = useRouter();
  const pathname = usePathname();

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
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="search" />
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
