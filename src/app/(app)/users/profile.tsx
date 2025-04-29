import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

const UserProfilePage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">User Profile</Text>
      <Link href="/users/profile-edit" className="text-blue-500">
        Edit Profile
      </Link>
      {/* Display user profile information */}
    </View>
  );
};

export default UserProfilePage;
