import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image as RNImage,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
            <View className="rounded-lg overflow-hidden w-20 aspect-video">
              <Image
                source={{ uri: carImageUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
                placeholder={{
                  uri: carImageUrl,
                  blurhash: blurhash,
                }}
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
