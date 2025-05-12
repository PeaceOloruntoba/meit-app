import React, { useEffect, useState } from "react"; // Import useState
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useProduct } from "@/hook/useProduct";
import { useAuth } from "@/hook/useAuth"; // Import useAuth
import { useRental } from "@/hook/useRentals"; // Import useRental

const SearchDetailsScreen = () => {
  const router = useRouter();
  const { id: productId } = useLocalSearchParams<{ id: string }>(); // Rename id to productId for clarity
  const {
    product,
    loading: productLoading,
    error: productError,
    getSingleProduct,
  } = useProduct();
  const { user } = useAuth(); // Get the current user
  const {
    createRental,
    loading: rentalLoading,
    error: rentalError,
  } = useRental(); // Get the createRental function
  const [isRenting, setIsRenting] = useState(false); // State to manage the renting process

  useEffect(() => {
    if (productId) {
      getSingleProduct(productId);
    }
  }, [getSingleProduct, productId]);

  const navigateToSearch = () => {
    router.push("/pages/search");
  };

  const handleRentProduct = async () => {
    if (!user?.uid) {
      // Handle unauthenticated user (e.g., redirect to login)
      router.push("/pages/login");
      return;
    }

    if (!product) {
      // Handle case where product data is not yet loaded
      return;
    }

    setIsRenting(true);
    const rentalId = await createRental(
      productId,
      product.userId,
      product.price
    );
    setIsRenting(false);

    if (rentalId) {
      router.push(`/pages/rentals/${rentalId}`);
    }
  };

  const carImageUrl =
    "https://res.cloudinary.com/ducorig4o/image/upload/v1723891447/samples/ecommerce/car-interior-design.jpg";

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  if (productLoading || rentalLoading) {
    return (
      <View className="flex-1 items-center bg-primary justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (productError || rentalError) {
    return (
      <View className="flex-1 items-center bg-primary justify-center">
        <Text className="text-red-500">
          Fehler beim Laden: {productError || rentalError}
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center bg-primary justify-center">
        <Text className="text-gray-500">Produkt nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-primary p-4 pt-20">
      <TouchableOpacity
        onPress={navigateToSearch}
        className="bg-black rounded-lg p-3 shadow-md absolute top-20 right-4"
      >
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 items-start w-full gap-4">
        <Text className="text-textPrimary text-3xl font-bold mb-4">
          {product.name}
        </Text>
        <Text className="text-textSecondary text-md mb-4">
          {product.contactEmail || "Keine Kontakt-E-Mail angegeben"}
        </Text>
        <View className="rounded-lg overflow-hidden w-full aspect-video">
          <Image
            source={{ uri: product.imageUrl || carImageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            placeholder={{ uri: carImageUrl, blurhash: blurhash }}
          />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">
            Beschreibung
          </Text>
          <Text className="text-textSecondary text-sm mb-4">
            {product.description}
          </Text>
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-textPrimary text-lg font-bold mb-2">Daten</Text>
          <View>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-textSecondary text-sm mb-4 font-semibold">
                Preis
              </Text>
              <Text className="text-textSecondary text-sm mb-4">
                {product.price} € pro{" "}
                {product.timePeriod === "Tag" ? "Tag" : "Monat"}
              </Text>
            </View>
            {product.deliveryCost !== undefined && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  Lieferpreis
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.deliveryCost} €
                </Text>
              </View>
            )}
            {product.deposit !== undefined && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  Kaution
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.deposit} €
                </Text>
              </View>
            )}
            {product.startDate && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  Startdatum
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.startDate}
                </Text>
              </View>
            )}
            {product.endDate && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  Enddatum
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.endDate}
                </Text>
              </View>
            )}
            {product.contactEmail && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  E-Mail
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.contactEmail}
                </Text>
              </View>
            )}
            {product.contactWebsite && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  Website
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.contactWebsite}
                </Text>
              </View>
            )}
            {product.contactWhatsApp && (
              <View className="flex flex-row justify-between w-full">
                <Text className="text-textSecondary text-sm mb-4 font-semibold">
                  WhatsApp
                </Text>
                <Text className="text-textSecondary text-sm mb-4">
                  {product.contactWhatsApp}
                </Text>
              </View>
            )}
          </View>
        </View>
        {product.location && (
          <View className="flex flex-col gap-2">
            <Text className="text-textPrimary text-lg font-bold mb-2">
              Standort
            </Text>
            <Text className="text-textSecondary text-sm mb-4">
              {product.location}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleRentProduct}
          className={`bg-indigo-600 py-3 rounded-lg w-full items-center justify-center ${
            isRenting ? "opacity-70" : ""
          }`}
          disabled={isRenting}
        >
          <Text className="text-white font-bold text-lg">
            {isRenting ? "Mieten..." : "Mieten"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchDetailsScreen;
