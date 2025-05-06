import React from "react";
import { View, ScrollView, Text } from "react-native";

const SearchScreen = () => {
  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 pt-20">
      <ScrollView className="flex-1">
        <Text className="text-lg text-gray-700 text-center mt-8">
          Come and do some search...
        </Text>
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
