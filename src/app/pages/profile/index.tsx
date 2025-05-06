import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Searching for:", searchText);
    }, 1500);
  };

  const handleFilter = () => {
    console.log("Navigating to filters");
  };

  const navigateToDetails = () => {
    router.push("/pages/profile/edit-profile");
  };

  return (
    <View className="flex-1 bg-background pt-20">
      <View className="px-4 pt-6">
        <View className="flex flex-row items-center space-x-2">
          <View className="flex-1 bg-white rounded-lg shadow-sm">
            <TextInput
              className="w-full p-3 text-lg text-textPrimary"
              placeholder="Suche..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={handleFilter}
            className="bg-black rounded-lg p-3 ml-4 shadow-md"
          >
            <Feather name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="mt-8 items-center">
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text className="mt-2 text-textSecondary">Searching...</Text>
          </View>
        )}

        <View className="mt-10 px-4">
          <TouchableOpacity
            onPress={navigateToDetails}
            className="bg-gray-200 p-4 rounded-lg mb-4 items-center"
          >
            <Text className="text-lg font-bold">Go to Search Details (ID)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
