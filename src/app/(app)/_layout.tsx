import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native";
import BottomNav from "../components/UI/BottomNav";
import { useAuth } from "../hooks/useAuth";
import Colors from "../constants/Colors";
import { useEffect } from "react";
import { Ionicons, Feather } from "@expo/vector-icons"; // Example icons

const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Don't redirect while loading
    }
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated && !loading) {
    return null; // Or a loading spinner if you prefer
  }

  const navigationItems = [
    {
      href: "/my-products",
      label: "My Products",
      icon: <Feather name="list" size={24} color={Colors.primary} />,
    },
    {
      href: "/search",
      label: "Search",
      icon: <Feather name="search" size={24} color={Colors.primary} />,
    },
    {
      href: "/rentals",
      label: "Rentals",
      icon: <Feather name="swap-horizontal" size={24} color={Colors.primary} />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <Feather name="user" size={24} color={Colors.primary} />,
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-black"
      style={{ backgroundColor: Colors.background }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
        {/* Optional: If you have a default screen in (app) */}
        <Stack.Screen
          name="my-products/index"
          options={{ headerShown: true, headerTitle: "Meine Produkte" }}
        />
        <Stack.Screen
          name="search"
          options={{ headerShown: true, headerTitle: "Suche" }}
        />
        <Stack.Screen
          name="rentals/index"
          options={{ headerShown: true, headerTitle: "Meine Mietvorgänge" }}
        />
        <Stack.Screen
          name="profile"
          options={{ headerShown: true, headerTitle: "Profil" }}
        />
        <Stack.Screen
          name="[product-details]"
          options={{ headerShown: true, headerTitle: "Produkt Details" }}
        />{" "}
        {/* Example dynamic route */}
      </Stack>
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
