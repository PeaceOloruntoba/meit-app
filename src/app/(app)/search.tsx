import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useProduct from "../hooks/useProduct";
import ProductCard from "../components/UI/ProductCard";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { products, getAllProducts, loading, error } = useProduct();

  useEffect(() => {
    const fetchProducts = async () => {
      await getAllProducts();
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products) {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (product.location &&
            product.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center p-4">
        <Text className="text-lg text-gray-700">Lädt Produkte...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center p-4">
        <Text className="text-red-500 text-lg">
          Fehler beim Laden der Produkte: {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-md mb-4 p-2 flex-row items-center border border-gray-300">
        <Feather name="search" size={20} color="#888" className="mr-2" />
        <TextInput
          className="flex-1 h-10 text-lg text-gray-700"
          placeholder="Suche..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm("")} className="p-2">
            <Feather name="x" size={20} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView className="flex-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              deposit={product.deposit}
              deliveryCost={product.deliveryCost}
              pricePerDay={product.pricePerDay}
              pricePerMonth={product.pricePerMonth}
              pickupAvailable={product.pickupAvailable}
              distance={product.distance} // Assuming distance is in your product data
            />
          ))
        ) : (
          <Text className="text-lg text-gray-700 text-center mt-8">
            Keine Produkte gefunden.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
