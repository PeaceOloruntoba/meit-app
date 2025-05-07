import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

const ProductsScreen = () => {
  const router = useRouter();

  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";

  const handleAdd = () => {
    router.push("/pages/products/add-product");
  };

  const navigateToDetails = () => {
    router.push("/pages/products/123");
  };

  return (
    <View className="flex-1 bg-background pt-20">
      <View className="px-4 pt-6">
        <View className="flex items-center absolute top-24 right-4">
          <TouchableOpacity
            onPress={handleAdd}
            className="bg-black rounded-lg p-3 ml-4 shadow-md"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
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

export default ProductsScreen;
