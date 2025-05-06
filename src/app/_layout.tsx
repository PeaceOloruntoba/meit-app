import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <AuthProvider> */}
        <StatusBar style="dark" />
        <Slot />
        {/* </AuthProvider> */}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
