import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const SearchDetailsScreen = () => {
  const router = useRouter();
  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";
  const navigateToDetails = () => {
    router.push("/pages/search");
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
        <View className="rounded-lg overflow-hidden w-full aspect-video">
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
