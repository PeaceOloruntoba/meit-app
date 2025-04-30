import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useProduct from "../hooks/useProduct";
import { ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";

const ProductDetailsPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, product, getProduct } = useProduct();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Produkt nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-6 right-4 bg-black rounded-full p-2 z-10"
      >
        <Text className="text-white text-lg">X</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-2">{product.name}</Text>
      {/* Seller Name - You might need to fetch this based on product.userId */}
      <Text className="text-gray-600 mb-4">
        Verkäufer: {/* Seller's Name */}
      </Text>

      {product.imageUrl && product.imageUrl.length > 0 && (
        <Image
          source={{ uri: product.imageUrl[0] }}
          className="w-full h-64 rounded-md mb-4 object-cover"
        />
      )}

      {product.description && (
        <Text className="text-gray-800 mb-4">{product.description}</Text>
      )}

      <Text className="text-lg font-semibold mb-2">Daten</Text>
      {product.pricePerDay !== undefined && (
        <Text className="text-gray-600 mb-1">
          Preis: {product.pricePerDay.toFixed(2)} € pro Tag
        </Text>
      )}
      {product.deliveryCost !== undefined && (
        <Text className="text-gray-600 mb-1">
          Lieferpreis: {product.deliveryCost.toFixed(2)} €
        </Text>
      )}
      {product.deposit !== undefined && (
        <Text className="text-gray-600 mb-1">
          Kaution: {product.deposit.toFixed(2)} €
        </Text>
      )}
      {product.startDate && (
        <Text className="text-gray-600 mb-1">
          Startdatum: {product.startDate}
        </Text>
      )}
      {product.endDate && (
        <Text className="text-gray-600 mb-1">Enddatum: {product.endDate}</Text>
      )}

      <Text className="text-lg font-semibold mt-4 mb-2">Kontakt</Text>
      {product.contactEmail && (
        <Text className="text-blue-500 mb-1">
          E-Mail: {product.contactEmail}
        </Text>
      )}
      {product.contactWebsite && (
        <Text className="text-blue-500 mb-1">
          Website: {product.contactWebsite}
        </Text>
      )}
      {product.contactWhatsApp && (
        <Text className="text-green-500 mb-4">
          WhatsApp: {product.contactWhatsApp}
        </Text>
      )}

      {product.location && (
        <>
          <Text className="text-lg font-semibold mt-4 mb-2">Standort</Text>
          <Text className="text-gray-600">{product.location}</Text>
        </>
      )}
    </ScrollView>
  );
};

export default ProductDetailsPage;
