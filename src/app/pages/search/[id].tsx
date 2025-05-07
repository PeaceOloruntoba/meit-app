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
      <View className="flex-1 items-start w-full gap-4">
        <Text className="text-textPrimary text-3xl font-bold mb-4">
          Produktname
        </Text>
        <Text className="text-textSecondary text-md mb-4">
          Vorname und Nachname
        </Text>
        <RNImage
          className="rounded-lg p-2"
          source={{ uri: carImageUrl }}
          resizeMode="cover"
        />
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">
            Beschreibung
          </Text>
          <Text className="text-textSecondary text-sm mb-4">
            lddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddldddddddddddddddddddddddddddddddd
          </Text>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">Daten</Text>
          <View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Preis
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                36,00 € pro Tag
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Lieferpreis
              </Text>
              <Text className="text-textSecondary text-sm mb-4">36,00 €</Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Kaution
              </Text>
              <Text className="text-textSecondary text-sm mb-4">36,00 €</Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Startdatum
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                04.08.2025
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Enddatum
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                04.12.2025
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                E-Mail
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                kumar.davidthiben@gmail.com
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Website
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                https://www.google.de
              </Text>
            </View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                WhatsApp
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                +4917641474606
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">
            Standort
          </Text>
          <Text className="text-textSecondary text-sm mb-4">
            Musterstraße, 53474 Ahrweiler
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SearchDetailsScreen;
