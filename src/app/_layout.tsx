import React, { useEffect } from "react";
import "../global.css";
import { Slot, Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import BottomNav from "@/components/BottomNav";
import { Feather } from "@expo/vector-icons";
import { AuthProvider, useAuth } from "@/hook/useAuth";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.background }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AuthLayoutContent />
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

const AuthLayoutContent = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/pages/login");
    }
  }, [user, loading, router]);

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

  // Don't show BottomNav on authentication routes
  const isAuthRoute = router.pathname?.startsWith("/auth");

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
      <Stack>
        <Slot />
      </Stack>
      {user && !isAuthRoute ? <BottomNav items={navigationItems} /> : null}
    </>
  );
};
