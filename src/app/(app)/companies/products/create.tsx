import React from "react";
import { View, Text } from "react-native";
import ProductForm from "../../../components/Products/ProductForm";

const CreateProductPage = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Create New Product</Text>
      <ProductForm />
    </View>
  );
};

export default CreateProductPage;
