import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";

interface ProductCardProps {
  id: string; // Unique identifier for the product
  name: string;
  imageUrl?: string;
  description?: string;
  price?: number;
  // Add other relevant product details
}

const router = useRouter();

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  imageUrl,
  description,
  price,
}) => {
  return (
    <TouchableOpacity
      onPress={() => router.navigate(`/users/[product-details]?id=${id}`)}
      className="bg-white rounded-md overflow-hidden mb-4 shadow-md"
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-36 object-cover"
        />
      ) : (
        <View className="w-full h-36 bg-gray-100 justify-center items-center">
          <Text className="text-gray-500">No Image</Text>
        </View>
      )}
      <View className="p-4">
        <Text className="text-lg font-bold mb-1 text-black">{name}</Text>
        {description && (
          <Text className="text-sm text-gray-600 mb-2 line-clamp-2">
            {description}
          </Text>
        )}
        {price !== undefined && (
          <Text className="text-base font-semibold text-primary">
            ${price?.toFixed(2)}
          </Text>
        )}
        {/* Add more details as needed */}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
