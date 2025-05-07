import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image as RNImage, // Rename the built-in Image
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const SearchDetailsScreen = () => {
  const router = useRouter();
  const carImageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Two_Blue_BMW_Z4_--_Flickr_--_exfordy.jpg/1280px-Two_Blue_BMW_Z4_--_Flickr_--_exfordy.jpg";
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
        <RNImage // Using the correctly imported Image component
          className="rounded-lg w-full aspect-video" // Added width and aspect ratio
          source={{ uri: carImageUrl }}
          resizeMode="cover"
        />
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">
            Beschreibung
          </Text>
          <Text className="text-textSecondary text-sm mb-4">
            ldddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddlddddddddddddddddddddddddddddddddddddddddddddldddddddddddddddddddddddddddddd
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
