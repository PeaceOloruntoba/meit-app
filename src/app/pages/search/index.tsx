import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image as RNImage, // Rename the built-in Image to avoid conflict
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const carImageUrl =
    "https://www.bing.com/images/search?view=detailV2&ccid=RRLRTfyo&id=887012984823F99E1CBC718189CCA3D53B93F5EA&thid=OIP.RRLRTfyovae8cElrahuPHwHaE8&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f2944739.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4512d14dfca8bda7bc70496b6a1b8f1f%3frik%3d6vWTO9WjzImBcQ%26pid%3dImgRaw%26r%3d0&exph=2731&expw=4096&q=blue+bmw+car&simid=607988716754976946&FORM=IRPRST&ck=4E28E45B2FC51F5FB2C6DE645B22245D&selectedIndex=0&itb=0";

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
    router.push("/pages/search/123");
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
            className="bg-white shadow-md shadow-black/70 p-4 rounded-lg mb-4 items-center flex flex-row items-center space-x-2"
          >
            <View className="rounded-lg h-24 overflow-hidden">
              <RNImage
                className="rounded-lg"
                source={{ uri: carImageUrl }}
                resizeMode="cover"
              />
            </View>
            <View className="flex flex-col">
              <Text className="text-lg font-bold">Produktname</Text>
              <Text className="text-sm text-black/70">30,00 € Kaution</Text>
              <Text className="text-sm text-black/70">
                30,00 € Lieferkosten
              </Text>
              <Text className="text-lg font-bold">
                30,00 € <Text className="text-sm text-black/70">pro Monat</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
