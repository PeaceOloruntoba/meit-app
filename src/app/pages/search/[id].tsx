import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image as RNImage,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const SearchDetailsScreen = () => {
  const router = useRouter();
  const carImageUrl =
    "https://www.bing.com/images/search?view=detailV2&ccid=RRLRTfyo&id=887012984823F99E1CBC718189CCA3D53B93F5EA&thid=OIP.RRLRTfyovae8cElrahuPHwHaE8&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f2944739.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4512d14dfca8bda7bc70496b6a1b8f1f%3frik%3d6vWTO9WjzImBcQ%26pid%3dImgRaw%26r%3d0&exph=2731&expw=4096&q=blue+bmw+car&simid=607988716754976946&FORM=IRPRST&ck=4E28E45B2FC51F5FB2C6DE645B22245D&selectedIndex=0&itb=0";

  const navigateToDetails = () => {
    router.push("/pages/search");
  };

  return (
    <View className="flex-1 pt-20 items-center bg-primary px-4">
      <TouchableOpacity
        onPress={navigateToDetails}
        className="bg-black rounded-lg p-3 shadow-md absolute top-20 right-4"
      >
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 items-start w-full">
        <Text className="text-textPrimary text-3xl font-bold mb-4">
          Produktname
        </Text>
        <Text className="text-textSecondary text-md mb-4">
          Vorname und Nachname
        </Text>
        <RNImage
          className="rounded-lg"
          source={{ uri: carImageUrl }}
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </View>
  );
};

export default SearchDetailsScreen;
