import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useAuth } from "@/hook/useAuth";
import { useProduct } from "@/hook/useProduct";

const ProductsScreen = () => {
  const router = useRouter();
  const { products, loading, error, getUsersProducts } = useProduct();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      getUsersProducts(user.uid);
    }
  }, [getUsersProducts, user?.uid]);

  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";

  const handleAdd = () => {
    router.push("/pages/products/add-product");
  };

  const navigateToDetails = (productId: string) => {
    router.push(`/pages/products/${productId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-red-500">
          Fehler beim Laden der Produkte: {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-6">
        <View className="flex items-center absolute right-4 top-1">
          <TouchableOpacity
            onPress={handleAdd}
            className="bg-black rounded-lg p-3 ml-4 shadow-md"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="mt-10 px-4">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => navigateToDetails(product.id!)}
              className="bg-white shadow-md shadow-black/70 p-4 rounded-lg mb-4 items-center flex flex-row items-center space-x-2"
            >
              <View className="rounded-lg overflow-hidden w-20 aspect-video">
                <Image
                  source={{ uri: product.imageUrl || carImageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                  placeholder={{ uri: carImageUrl }}
                />
              </View>
              <View className="flex flex-col">
                <Text className="text-lg font-bold">{product.name}</Text>
                {product.deposit !== undefined && (
                  <Text className="text-sm text-black/70">
                    {product.deposit} € Kaution
                  </Text>
                )}
                {product.deliveryCost !== undefined && (
                  <Text className="text-sm text-black/70">
                    {product.deliveryCost} € Lieferkosten
                  </Text>
                )}
                <Text className="text-lg font-bold">
                  {product.price} €{" "}
                  <Text className="text-sm text-black/70">
                    pro {product.timePeriod === "Tag" ? "Tag" : "Monat"}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {products.length === 0 && !loading && (
            <Text className="text-center text-gray-500 mt-4">
              Du hast noch keine Produkte hinzugefügt.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductsScreen;
