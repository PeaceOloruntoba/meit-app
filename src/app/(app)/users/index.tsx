import React from "react";
import { View, Text } from "react-native";

const UserHomePage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">User Home</Text>
      <Text className="mt-2 text-gray-600">
        Content for regular users will go here.
      </Text>
    </View>
  );
};

export default UserHomePage;
