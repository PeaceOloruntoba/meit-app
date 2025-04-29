import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import Colors from "../constants/Colors";

const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
};

export default AuthLayout;
