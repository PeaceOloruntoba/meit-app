import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useProduct } from "@/hook/useProduct"; // Import the hook
import { toast } from "sonner-native";

const AddProductScreen = () => {
  const router = useRouter();
  const { addProduct, loading, error } = useProduct();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [timePeriod, setTimePeriod] = useState<"Tag" | "Monat">("Tag");
  const [deposit, setDeposit] = useState<number | undefined>();
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | undefined>();
  const [additionalDeliveryCost, setAdditionalDeliveryCost] = useState<
    number | undefined
  >();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactWebsite, setContactWebsite] = useState<string>("");
  const [contactWhatsApp, setContactWhatsApp] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleGoBack = () => {
    router.push("/pages/products");
  };

  const handleSaveProduct = async () => {
    if (!name || !description || !price || !timePeriod) {
      toast.error("Bitte fülle alle erforderlichen Felder aus.");
      return;
    }

    const newProduct = {
      name,
      description,
      price: Number(price),
      timePeriod,
      deposit: Number(deposit) || undefined,
      deliveryAvailable,
      deliveryCost: deliveryAvailable
        ? Number(deliveryCost) || undefined
        : undefined,
      additionalDeliveryCost: deliveryAvailable
        ? Number(additionalDeliveryCost) || undefined
        : undefined,
      imageUrl,
      startDate,
      endDate,
      contactEmail,
      contactWebsite,
      contactWhatsApp,
      location,
    };

    await addProduct(newProduct);
    if (!loading && !error) {
      router.push("/pages/products");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-2 right-4 bg-black rounded-md p-2 pt-20 z-10"
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-4 text-textPrimary">
          Produkt hinzufügen
        </Text>
        {error && <Text className="text-red-500 mb-2">{error}</Text>}
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Produktname"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Beschreibung
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            className="border border-secondary rounded-md bg-white p-3 text-lg h-24 text-top"
            placeholder="Produktbeschreibung"
            multiline
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Preis [in €]
          </Text>
          <TextInput
            value={price ? price.toString() : ""}
            onChangeText={(text) => setPrice(Number(text) || undefined)}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Preis"
            keyboardType="numeric"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            zeitraum
          </Text>
          <Picker
            selectedValue={timePeriod}
            onValueChange={(itemValue) =>
              setTimePeriod(itemValue as "Tag" | "Monat")
            }
            className="border border-secondary rounded-md bg-white"
          >
            <Picker.Item label="Tag" value="Tag" />
            <Picker.Item label="Monat" value="Monat" />
          </Picker>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Kaution
          </Text>
          <TextInput
            value={deposit ? deposit.toString() : ""}
            onChangeText={(text) => setDeposit(Number(text) || undefined)}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Kaution"
            keyboardType="numeric"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Zustellung
          </Text>
          <TouchableOpacity
            onPress={() => setDeliveryAvailable(!deliveryAvailable)}
            className={`flex-row items-center rounded-md p-3 border border-secondary bg-white ${
              deliveryAvailable ? "bg-green-100 border-green-500" : ""
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
            <Text className="text-lg font-medium mb-2 text-textPrimary">
              Lieferpreis
            </Text>
            <TextInput
              value={deliveryCost ? deliveryCost.toString() : ""}
              onChangeText={(text) =>
                setDeliveryCost(Number(text) || undefined)
              }
              className="border border-secondary rounded-md bg-white p-3 text-lg"
              placeholder="Lieferpreis"
              keyboardType="numeric"
            />
          </View>
        )}
        {deliveryAvailable && (
          <View className="mb-4">
            <Text className="text-lg font-medium mb-2 text-textPrimary">
              Zusätzlicher Lieferpreis
            </Text>
            <TextInput
              value={
                additionalDeliveryCost ? additionalDeliveryCost.toString() : ""
              }
              onChangeText={(text) =>
                setAdditionalDeliveryCost(Number(text) || undefined)
              }
              className="border border-secondary rounded-md bg-white p-3 text-lg"
              placeholder="Zusätzlicher Lieferpreis"
              keyboardType="numeric"
            />
          </View>
        )}
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Startdatum
          </Text>
          <TextInput
            value={startDate}
            onChangeText={setStartDate}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Enddatum
          </Text>
          <TextInput
            value={endDate}
            onChangeText={setEndDate}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Kontakt Email
          </Text>
          <TextInput
            value={contactEmail}
            onChangeText={setContactEmail}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Email"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Kontakt Website
          </Text>
          <TextInput
            value={contactWebsite}
            onChangeText={setContactWebsite}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Website"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Kontakt WhatsApp
          </Text>
          <TextInput
            value={contactWhatsApp}
            onChangeText={setContactWhatsApp}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="WhatsApp"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Standort
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            className="border border-secondary rounded-md bg-white p-3 text-lg"
            placeholder="Standort"
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg font-medium mb-2 text-textPrimary">
            Bild hochladen
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-white border-dashed border border-secondary rounded-md p-10 items-center justify-center"
          >
            <Feather name="upload" size={24} color="gray" />
          </TouchableOpacity>
          {imageUrl && (
            <View className="mt-4">
              <Image
                source={{ uri: imageUrl }}
                className="w-20 h-20 rounded-md"
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={handleSaveProduct}
          className={`bg-[#7D7AFF] rounded-md p-4 mt-6 items-center ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Speichern</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;