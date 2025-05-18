import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function WalletScreen() {
  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 flex-col justify-between pt-20">
      <View>
        <Text className="text-2xl font-semibold mb-4">Wallet</Text>
        <Text className="text-xl font-semibold mb-4">Miet Payments</Text>
        <View className="flex flex-row items-center justify-between mt-6">
          <Text className="text-lg">Account Balance</Text>
          <Text className="text-5xl font-semibold">€ 5000.00</Text>
        </View>
        <TouchableOpacity className="bg-blue-600 m-4 p-4 rounded-lg flex items-center">
          <Text className="text-white font-semibold text-xl uppercase">
            WIthdraw
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
