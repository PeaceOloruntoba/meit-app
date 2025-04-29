import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Colors from "../../constants/Colors";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "expo-router";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login(email, password);
    if (!loading && !error) {
      console.log("Login successful!");
    } else if (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F5F7FA] px-6">
      <Text className="text-3xl font-bold text-black mb-2">Hello Again!</Text>
      <Text className="text-center text-gray-500 mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet, urna, a,
        fusce
      </Text>

      <TextInput
        placeholder="Deine E-Mail"
        className="w-full p-4 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Dein Passwort"
        className="w-full p-4 mb-2 rounded-xl bg-white text-gray-700 shadow-sm"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity className="self-end mb-6">
        <Text className="text-sm font-semibold text-black">
          Passwort vergessen?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-[#7C5CFC] p-4 rounded-xl items-center mb-8"
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Einloggen..." : "Login"}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 mt-2">{error}</Text>}

      {/* Divider and Social Login */}
      <View className="flex-row items-center mb-6 w-full">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-400">Oder Login mit</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="flex-row justify-between w-full px-6 mb-10">
        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-md">
          <FontAwesome name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-md">
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-4 rounded-xl shadow-md">
          <Entypo name="app-store" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500">
        Du hast keine Account?{" "}
        <Link href="/(auth)/register" className="text-[#7C5CFC] font-semibold">
          Jetzt Registrieren
        </Link>
      </Text>
    </View>
  );
};

export default LoginForm;
