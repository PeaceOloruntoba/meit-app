import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

const CompanyProfilePage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">Company Profile</Text>
      <Link href="/companies/profile-edit" className="text-blue-500">
        Edit Profile
      </Link>
      {/* Display company profile information */}
    </View>
  );
};

export default CompanyProfilePage;
