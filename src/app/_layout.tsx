import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./hooks/useAuth";
import Colors from "./constants/Colors";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" backgroundColor={Colors.background} />
        <Slot />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
