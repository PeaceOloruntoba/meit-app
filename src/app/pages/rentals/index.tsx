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

const RentalScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [filter, setFilter] = React.useState("all");
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

  const handleSwitchTab = () => {
    setFilter("user");
  };

  const navigateToDetails = () => {
    router.push("/pages/rentals/123");
  };

  return (
    <View className="flex-1 bg-background pt-20">
      <View>
        <View className="px-4 pt-6 w-full flex flex-col items-center justify-center">
          <Text className="text-[24px] font-[500]">Übersicht</Text>
          <View className="flex flex-row items-center justify-center space-x-2 text-[20px] bg-[#EFF3F8] text-[#838D95] border">
            <TouchableOpacity
              onPress={handleSwitchTab}
              className="bg-[#fff] rounded-lg p-3 shadow-md"
            >
              <Text className="text-[#7D7AFF]">Gemietet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSwitchTab}
              className=" rounded-lg p-3"
            >
              <Text className="">Vermietet</Text>
            </TouchableOpacity>
          </View>
        </View>
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
              <Text className="text-sm text-black/70">Handynummer</Text>
              <Text className="text-sm text-black/70">Vorname Nachname</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RentalScreen;
