import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import Colors from "../constants/Colors";

const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack />
    </SafeAreaView>
  );
};

export default AuthLayout;
