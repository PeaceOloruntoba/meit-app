import React, { useEffect } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import ProductCard from "../../components/UI/ProductCard";
import useProduct from "../../hooks/useProduct";
import { Link } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
import Colors from "../../constants/Colors";

const MyProductsPage = () => {
  const { loading, error, products, getUserProducts } = useProduct();

  useEffect(() => {
    getUserProducts();
  }, []);

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

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-end mb-4">
        <Link href="/add-product" className="bg-black rounded-full p-3">
          <Feather name="plus" size={24} color="white" />
        </Link>
      </View>
      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id!} // Assuming 'id' is always present after fetching
          renderItem={({ item }) => <ProductCard {...item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No products added yet.</Text>
        </View>
      )}
    </View>
  );
};

export default MyProductsPage;
