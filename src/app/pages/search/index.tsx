import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useProduct } from "@/hook/useProduct"; // Import the hook

const SearchScreen = () => {
  const router = useRouter();
  const { products, loading, error, getAllProducts } = useProduct();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<typeof products>([]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (searchText) {
      const results = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(products);
    }
  }, [searchText, products]);

  const handleSearch = useCallback(() => {
    // The filtering is already done in the useEffect above,
    // so no need for a separate loading state here for the basic search.
    console.log("Searching for:", searchText);
  }, [searchText]);

  const handleFilter = () => {
    console.log("Navigating to filters");
    // Implement navigation to filter screen if needed
  };

  const navigateToDetails = (productId: string) => {
    router.push(`/pages/search/${productId}`);
  };

  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  if (loading) {
    return (
      <View className="flex-1 bg-background pt-20 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="mt-2 text-textSecondary">Lade Produkte...</Text>
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
    <View className="flex-1 bg-background pt-20">
      <View className="px-4 pt-6">
        <View className="flex flex-row items-center space-x-2">
          <View className="flex-1 bg-white rounded-lg shadow-sm">
            <TextInput
              className="w-full p-3 text-lg text-textPrimary"
              placeholder="Suche..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={handleFilter}
            className="bg-black rounded-lg p-3 ml-4 shadow-md"
          >
            <Feather name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mt-10 px-4">
          {searchResults.map((product) => (
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
                  placeholder={{ uri: carImageUrl, blurhash: blurhash }}
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
          {searchResults.length === 0 && !loading && (
            <Text className="text-center text-gray-500 mt-4">
              Keine Produkte gefunden.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
