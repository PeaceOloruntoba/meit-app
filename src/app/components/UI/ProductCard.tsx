import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Example icons

interface ProductCardProps {
  id: string; // Unique identifier for the product
  name: string;
  imageUrl?: string;
  deposit?: number | string;
  deliveryCost?: number | string;
  pricePerDay?: number | string;
  pricePerMonth?: number | string;
  pickupAvailable?: boolean;
  distance?: string; // e.g., "20km"
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  deposit,
  deliveryCost,
  pricePerDay,
  pricePerMonth,
  pickupAvailable,
  distance,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.navigate(`/companies/products/${id}`)}
      className="bg-white rounded-md mb-4 shadow-md flex flex-row"
    >
      <View className="relative">
        {imageUrl ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              className="object-cover"
            />
            <View className="flex-row items-center mt-1 absolute inset-1 bottom-0 right-0">
              <Ionicons
                name="location-sharp"
                size={14}
                color={Colors.secondary}
              />
              <Text className="text-xs text-gray-600 ml-1">{distance}</Text>
            </View>{" "}
          </>
        ) : (
          <View className="w-36 h-36 bg-gray-100 justify-center items-center">
            <Text className="text-gray-500">No Image</Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold mb-1 text-black">{name}</Text>
        {deposit !== undefined && (
          <Text className="text-sm text-gray-600 mb-1">
            Kaution:{" "}
            {typeof deposit === "number" ? deposit.toFixed(2) + " €" : deposit}
          </Text>
        )}
        {deliveryCost !== undefined && (
          <Text className="text-sm text-gray-600 mb-1">
            Lieferkosten:{" "}
            {typeof deliveryCost === "number"
              ? deliveryCost.toFixed(2) + " €"
              : deliveryCost}
          </Text>
        )}
        {pricePerDay !== undefined && (
          <Text className="text-base font-semibold text-primary">
            {typeof pricePerDay === "number"
              ? pricePerDay.toFixed(0) + " € pro Tag"
              : pricePerDay + " pro Tag"}
          </Text>
        )}
        {pricePerMonth !== undefined && (
          <Text className="text-base font-semibold text-primary">
            {typeof pricePerMonth === "number"
              ? pricePerMonth.toFixed(0) + " € pro Monat"
              : pricePerMonth + " pro Monat"}
          </Text>
        )}
        {pickupAvailable && (
          <Text className="text-sm text-gray-600 mb-1">Abholung möglich</Text>
        )}
        {distance && (
          <View className="flex-row items-center mt-1">
            <Ionicons
              name="location-sharp"
              size={14}
              color={Colors.secondary}
            />
            <Text className="text-xs text-gray-600 ml-1">{distance}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
