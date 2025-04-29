import React from "react";
import { View, Text } from "react-native";

const CompanyDashboardPage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Company Dashboard</Text>
      <Text className="mt-2 text-gray-600">
        Company-specific information and actions will be here.
      </Text>
    </View>
  );
};

export default CompanyDashboardPage;
