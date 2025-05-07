// pages/login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useAuth } from "@/hook/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    await login(email, password);
    if (!loading) {
      router.replace("/pages/search");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Text className="text-2xl font-bold mb-4 text-textPrimary">Login</Text>
      <TextInput
        className="border border-secondary rounded-md bg-white p-3 mb-3 w-full text-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-secondary rounded-md bg-white p-3 mb-4 w-full text-lg"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-primary rounded-md p-4 w-full items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-lg font-bold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/pages/register")} // Assuming you have a register page
      >
        <Text className="text-textPrimary">
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;
