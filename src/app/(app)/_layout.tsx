import { Stack, Redirect } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";
import BottomNav from "../components/UI/BottomNav";
import { useAuth } from "../hooks/useAuth";
import Colors from "../constants/Colors";

const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
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
    { href: "/users", label: "Home" },
    { href: "/users/search", label: "Search" },
    { href: "/users/booking", label: "Bookings" },
    { href: "/users/profile", label: "Profile" },
    { href: "/notifications", label: "Notifications" },
  ];

  const companyNavigationItems = [
    { href: "/companies", label: "Dashboard" },
    { href: "/companies/products/list", label: "Products" },
    { href: "/companies/rentals", label: "Rentals" },
    { href: "/companies/profile", label: "Profile" },
    { href: "/notifications", label: "Notifications" },
  ];

  const isAdmin = true;
  const isCompanyUser = false;
  const navigationItems = isAdmin
    ? companyNavigationItems
    : isCompanyUser
    ? companyNavigationItems
    : userNavigationItems;

  return (
    <SafeAreaView className="bg-black" style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNav items={navigationItems} />
    </SafeAreaView>
  );
};

export default AppLayout;
