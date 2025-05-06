import BottomNav from "@/components/BottomNav";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
  //   const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  //   useEffect(() => {
  //     if (loading) {
  //       return;
  //     }
  //     if (!isAuthenticated) {
  //       router.replace("/(auth)/login");
  //     }
  //   }, [isAuthenticated, loading, router]);
  //
  //   if (!isAuthenticated && !loading) {
  //     return null;
  //   }

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
        <Stack.Screen name="profile" />
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
