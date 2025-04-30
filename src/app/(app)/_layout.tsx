import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native";
import BottomNav from "../components/UI/BottomNav";
import { useAuth } from "../hooks/useAuth";
import Colors from "../constants/Colors";
import { useEffect } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";

const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated && !loading) {
    return null;
  }

  const navigationItems = [
    {
      href: "/my-products",
      label: "My Products",
      icon: <Feather name="grid" size={24} color={Colors.primary} />,
    },
    {
      href: "/search",
      label: "Search",
      icon: <Feather name="search" size={24} color={Colors.primary} />,
    },
    {
      href: "/rentals",
      label: "Rentals",
      icon: <Feather name="list" size={24} color={Colors.primary} />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <Feather name="user" size={24} color={Colors.primary} />,
    },
  ];

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="my-products/index" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="[product-details]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="rentals/index" />
        {/* Other Stack Screens */}
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
