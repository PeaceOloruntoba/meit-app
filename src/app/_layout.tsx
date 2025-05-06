import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Toaster } from "sonner-native";

export default function Layout() {
  return (
    <SafeAreaProvider >
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <AuthProvider> */}
        <StatusBar style="dark" />
        <Slot />
        <Toaster
          toastOptions={{
            style: { backgroundColor: "#F2F5FA" },
          }}
          richColors
        />
        {/* </AuthProvider> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
