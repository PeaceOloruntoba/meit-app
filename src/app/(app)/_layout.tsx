import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";
import BottomNav from "../components/UI/BottomNav";
import { useAuth } from "../hooks/useAuth";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig"; // Import auth for user info

const AppLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [isCompanyUser, setIsCompanyUser] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const determineUserRole = async () => {
      if (user) {
        setIsCompanyUser(user.email?.includes("company") || false);
      } else {
        setIsCompanyUser(null);
      }
    };

    determineUserRole();
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && isCompanyUser !== null) {
      if (isCompanyUser && !pathname?.startsWith("/companies")) {
        router.replace("/companies");
      } else if (!isCompanyUser && !pathname?.startsWith("/users")) {
        router.replace("/users");
      }
    }
  }, [isAuthenticated, isCompanyUser, pathname, router]);

  if (loading || isCompanyUser === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const userNavigationItems = [
    { href: "/users", label: "Home", icon: <Text>🏠</Text> }, // Example icon
    { href: "/users/search", label: "Search", icon: <Text>🔍</Text> },
    { href: "/users/booking", label: "Bookings", icon: <Text>🗓️</Text> },
    { href: "/users/profile", label: "Profile", icon: <Text>👤</Text> },
    { href: "/notifications", label: "Notifications", icon: <Text>🔔</Text> },
  ];

  const companyNavigationItems = [
    { href: "/companies", label: "Dashboard", icon: <Text>📊</Text> },
    {
      href: "/companies/products/list",
      label: "Products",
      icon: <Text>📦</Text>,
    },
    { href: "/companies/rentals", label: "Rentals", icon: <Text>🔄</Text> },
    { href: "/companies/profile", label: "Profile", icon: <Text>👤</Text> },
    { href: "/notifications", label: "Notifications", icon: <Text>🔔</Text> },
  ];

  const navigationItems = isCompanyUser
    ? companyNavigationItems
    : userNavigationItems;

  return (
    <SafeAreaView
      className="bg-black"
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
