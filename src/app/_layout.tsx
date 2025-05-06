import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <AuthProvider> */}
        <StatusBar style="dark" backgroundColor={Colors.background} />
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
