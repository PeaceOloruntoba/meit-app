import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

const ProductListPage = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Your Products</Text>
      {/* List the company's products here */}
      <Link href="/companies/products/create" className="text-blue-500 mt-2">
        Add New Product
      </Link>
    </View>
  );
};

export default ProductListPage;
