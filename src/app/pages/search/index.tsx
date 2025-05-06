import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

const SearchScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center bg-primary mt-20">
      <View className="flex w-full gap-4">
      <input type="search" className="w-full bg-white p-2 rounded-lg" placeholder="Suche..." />
      <button className="p-2"></button>
      </View>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default SearchScreen;
