import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductForm from "../../../components/Products/ProductForm";

const EditProductPage = () => {
  const { productId } = useLocalSearchParams();
  const productIdString =
    typeof productId === "string" ? productId : productId?.[0];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">
        Produkt bearbeiten: {productIdString}
      </Text>
      {productIdString && <ProductForm productId={productIdString} />}
    </View>
  );
};

export default EditProductPage;
