import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For the "zeitraum" dropdown
import { Feather } from "@expo/vector-icons"; // For icons
import useProduct from "../hooks/useProduct";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // For image uploading
import Colors from "../constants/Colors";

const AddProductPage = () => {
  const { addProduct } = useProduct();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [timePeriod, setTimePeriod] = useState(""); // "Tag", "Monat", etc.
  const [deposit, setDeposit] = useState<number | undefined>();
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | undefined>();
  const [additionalDeliveryCost, setAdditionalDeliveryCost] = useState<
    number | undefined
  >(); // Or priceRange
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactWebsite, setContactWebsite] = useState<string>("");
  const [contactWhatsApp, setContactWhatsApp] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleAddProduct = async () => {
    const productData = {
      name,
      description,
      imageUrl: imageUrls,
      price,
      pricePerDay: timePeriod === "Tag" ? price : undefined,
      pricePerMonth: timePeriod === "Monat" ? price : undefined,
      deposit,
      deliveryAvailable,
      deliveryCost,
      additionalDeliveryCost,
      startDate,
      endDate,
      contactEmail,
      contactWebsite,
      contactWhatsApp,
      location,
    };

    const newProductId = await addProduct(productData);
    if (newProductId) {
      // Optionally navigate to the product details page after successful addition
      router.push(`/[product-details]?id=${newProductId}`);
    }
    // No need to navigate on error, the hook handles error display
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 5, // Limit to 5 images
      quality: 0.5, // Reduce image quality
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImageUrls(selectedImages);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-6 right-4 bg-black rounded-full p-2 z-10"
      >
        <Text className="text-white text-lg">X</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-4">Produkt hinzufügen</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Produktname"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Beschreibung</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          className="border border-gray-300 rounded-md p-2 h-24"
          placeholder="Produktbeschreibung"
          multiline
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Preis [in €]</Text>
        <TextInput
          value={price ? price.toString() : ""}
          onChangeText={(text) => setPrice(Number(text) || undefined)}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Preis"
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">zeitraum</Text>
        <Picker
          selectedValue={timePeriod}
          onValueChange={(itemValue) => setTimePeriod(itemValue)}
          className="border border-gray-300 rounded-md"
        >
          <Picker.Item label="Tag" value="Tag" />
          <Picker.Item label="Monat" value="Monat" />
          {/* Add other time periods if needed */}
        </Picker>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Kaution</Text>
        <TextInput
          value={deposit ? deposit.toString() : ""}
          onChangeText={(text) => setDeposit(Number(text) || undefined)}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Kaution"
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Zustellung</Text>
        <TouchableOpacity
          onPress={() => setDeliveryAvailable(!deliveryAvailable)}
          className={`flex-row items-center rounded-md p-2 ${
            deliveryAvailable
              ? "bg-green-100 border-green-500"
              : "border border-gray-300"
          }`}
        >
          <Feather
            name={deliveryAvailable ? "check-circle" : "circle"}
            size={20}
            color={deliveryAvailable ? "green" : "gray"}
            className="mr-2"
          />
          <Text>{deliveryAvailable ? "Ja" : "Nein"}</Text>
        </TouchableOpacity>
      </View>

      {deliveryAvailable && (
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">Lieferpreis</Text>
          <TextInput
            value={deliveryCost ? deliveryCost.toString() : ""}
            onChangeText={(text) => setDeliveryCost(Number(text) || undefined)}
            className="border border-gray-300 rounded-md p-2"
            placeholder="Lieferpreis"
            keyboardType="numeric"
          />
        </View>
      )}
      {deliveryAvailable && (
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">
            Zusätzlicher Lieferpreis
          </Text>
          <TextInput
            value={
              additionalDeliveryCost ? additionalDeliveryCost.toString() : ""
            }
            onChangeText={(text) =>
              setAdditionalDeliveryCost(Number(text) || undefined)
            }
            className="border border-gray-300 rounded-md p-2"
            placeholder="Zusätzlicher Lieferpreis"
            keyboardType="numeric"
          />
        </View>
      )}

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Startdatum</Text>
        <TextInput
          value={startDate}
          onChangeText={setStartDate}
          className="border border-gray-300 rounded-md p-2"
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Enddatum</Text>
        <TextInput
          value={endDate}
          onChangeText={setEndDate}
          className="border border-gray-300 rounded-md p-2"
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Kontakt Email</Text>
        <TextInput
          value={contactEmail}
          onChangeText={setContactEmail}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Email"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Kontakt Website</Text>
        <TextInput
          value={contactWebsite}
          onChangeText={setContactWebsite}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Website"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Kontakt WhatsApp</Text>
        <TextInput
          value={contactWhatsApp}
          onChangeText={setContactWhatsApp}
          className="border border-gray-300 rounded-md p-2"
          placeholder="WhatsApp"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Standort</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Standort"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Bilder hochladen</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-100 border border-dashed border-gray-400 rounded-md p-10 flex items-center justify-center"
        >
          <Feather name="upload" size={24} color="gray" />
        </TouchableOpacity>
        {imageUrls.length > 0 && (
          <View className="mt-4 flex flex-row flex-wrap">
            {imageUrls.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                className="w-20 h-20 rounded-md mr-2 mb-2"
              />
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={handleAddProduct}
        className="bg-black rounded-md p-3 mt-6"
      >
        <Text className="text-white text-lg font-semibold text-center">
          Speichern
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddProductPage;
