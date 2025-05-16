import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useProduct } from "@/hook/useProduct";
import Slider from "@react-native-community/slider";

interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  minDeposit: number | null;
  maxDeposit: number | null;
  minDeliveryCost: number | null;
  maxDeliveryCost: number | null;
}

const SearchScreen = () => {
  const router = useRouter();
  const { products, loading, error, getAllProducts } = useProduct();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterState>({
    minPrice: null,
    maxPrice: null,
    minDeposit: null,
    maxDeposit: null,
    minDeliveryCost: null,
    maxDeliveryCost: null,
  });

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    applyFilters();
  }, [searchText, products, filterValues]);

  const applyFilters = useCallback(() => {
    let filteredProducts = products;

    if (searchText) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterValues.minPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filterValues.minPrice
      );
    }

    if (filterValues.maxPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filterValues.maxPrice
      );
    }

    if (
      filterValues.minDeposit !== null &&
      filterValues.minDeposit !== undefined
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.deposit >= filterValues.minDeposit
      );
    }

    if (
      filterValues.maxDeposit !== null &&
      filterValues.maxDeposit !== undefined
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.deposit <= filterValues.maxDeposit
      );
    }

    if (
      filterValues.minDeliveryCost !== null &&
      filterValues.minDeliveryCost !== undefined
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.deliveryCost >= filterValues.minDeliveryCost
      );
    }

    if (
      filterValues.maxDeliveryCost !== null &&
      filterValues.maxDeliveryCost !== undefined
    ) {
      filteredProducts = filteredProducts.filter(
        (product) => product.deliveryCost <= filterValues.maxDeliveryCost
      );
    }

    setSearchResults(filteredProducts);
  }, [searchText, products, filterValues]);

  const handleSearch = useCallback(() => {
    console.log("Suche nach:", searchText);
    // Filtering is handled in the useEffect and applyFilters
  }, [searchText]);

  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const resetFilters = () => {
    setFilterValues({
      minPrice: null,
      maxPrice: null,
      minDeposit: null,
      maxDeposit: null,
      minDeliveryCost: null,
      maxDeliveryCost: null,
    });
  };

  const applyFilterButton = () => {
    applyFilters();
    closeFilterModal();
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
        <Text className="mt-2 text-textSecondary">
          Produkte werden geladen...
        </Text>
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
              placeholder="Suchen..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={openFilterModal}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={closeFilterModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-xl shadow-md">
            <Text className="text-xl font-bold mb-4">Filteroptionen</Text>

            <ScrollView>
              {/* Preis Filter */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">Preis (€)</Text>
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Min."
                    keyboardType="numeric"
                    value={
                      filterValues.minPrice !== null
                        ? String(filterValues.minPrice)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        minPrice: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                  <Text>-</Text>
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Max."
                    keyboardType="numeric"
                    value={
                      filterValues.maxPrice !== null
                        ? String(filterValues.maxPrice)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        maxPrice: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                </View>
              </View>

              {/* Kaution Filter */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">Kaution (€)</Text>
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Min."
                    keyboardType="numeric"
                    value={
                      filterValues.minDeposit !== null
                        ? String(filterValues.minDeposit)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        minDeposit: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                  <Text>-</Text>
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Max."
                    keyboardType="numeric"
                    value={
                      filterValues.maxDeposit !== null
                        ? String(filterValues.maxDeposit)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        maxDeposit: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                </View>
              </View>

              {/* Lieferkosten Filter */}
              <View className="mb-4">
                <Text className="text-lg font-semibold mb-2">
                  Lieferkosten (€)
                </Text>
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Min."
                    keyboardType="numeric"
                    value={
                      filterValues.minDeliveryCost !== null
                        ? String(filterValues.minDeliveryCost)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        minDeliveryCost: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                  <Text>-</Text>
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-md p-2 text-sm"
                    placeholder="Max."
                    keyboardType="numeric"
                    value={
                      filterValues.maxDeliveryCost !== null
                        ? String(filterValues.maxDeliveryCost)
                        : ""
                    }
                    onChangeText={(text) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        maxDeliveryCost: text ? parseInt(text, 10) : null,
                      }))
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex flex-row justify-end mt-6 space-x-4">
              <TouchableOpacity
                onPress={resetFilters}
                className="py-2 px-4 rounded-md"
              >
                <Text className="text-textSecondary">Zurücksetzen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilterButton}
                className="bg-primary py-2 px-4 rounded-md"
              >
                <Text className="text-white">Anwenden</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchScreen;
