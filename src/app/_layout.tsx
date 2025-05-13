import React, { useEffect, useState } from "react";
import "../global.css";
import { Slot, useRouter, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import BottomNav from "@/components/BottomNav";
import { Feather } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "@/hook/useAuth";
import { ActivityIndicator, View, Text } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AuthLayoutContent />
          <Toaster
            toastOptions={{ style: { backgroundColor: "#F2F5FA" } }}
            richColors
          />
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const AuthLayoutContent = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  const isAuthRoute = pathname === "/pages/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!loading && !user) {
        router.replace("/pages/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, user]);

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

  // if (showSplash) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-primary">
  //       <Text className="text-white text-3xl font-bold mb-4">
  //         Welcome to Miet App
  //       </Text>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   );
  // }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Slot />
      {user && !isAuthRoute ? <BottomNav items={navigationItems} /> : null}
    </>
  );
};
