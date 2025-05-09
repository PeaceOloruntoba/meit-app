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
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import useProduct from "../hooks/useProduct"; // Import your Firebase-ready hook
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/Colors";
import { toast } from "sonner-native";

const AddProductPage = () => {
  const { addProduct, loading, error } = useProduct(); // Use the hook
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [timePeriod, setTimePeriod] = useState("");
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

  interface Product {
    id: string;
    name: string;
    description?: string;
    imageUrls?: string[];
    price?: number;
    pricePerDay?: number;
    pricePerMonth?: number;
    deposit?: number;
    deliveryAvailable?: boolean;
    deliveryCost?: number;
    additionalDeliveryCost?: number;
    startDate?: string;
    endDate?: string;
    contactEmail?: string;
    contactWebsite?: string;
    contactWhatsApp?: string;
    location?: string;
    userId: string;
  }

  const handleAddProduct = async () => {
    const productData: { [key: string]: any } = {
      // Use a flexible type for productData
      name,
      description,
      imageUrl,
      price,
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

    if (timePeriod === "Tag" && price !== undefined) {
      productData.pricePerDay = price;
    } else if (timePeriod === "Monat" && price !== undefined) {
      productData.pricePerMonth = price;
    }

    const newProductId = await addProduct(
      productData as Omit<Product, "id" | "userId">
    );
    if (newProductId) {
      router.push(`/my-products/[id]?id=${newProductId}`);
    } else if (error) {
      console.error("Error adding product:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  if (error) {
    toast.error(error);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Produkt hinzufügen</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Produktname"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Beschreibung</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.multilineInput]}
            placeholder="Produktbeschreibung"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preis [in €]</Text>
          <TextInput
            value={price ? price.toString() : ""}
            onChangeText={(text) => setPrice(Number(text) || undefined)}
            style={styles.input}
            placeholder="Preis"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>zeitraum</Text>
          <Picker
            selectedValue={timePeriod}
            onValueChange={(itemValue) => setTimePeriod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tag" value="Tag" />
            <Picker.Item label="Monat" value="Monat" />
            {/* Add other time periods if needed */}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kaution</Text>
          <TextInput
            value={deposit ? deposit.toString() : ""}
            onChangeText={(text) => setDeposit(Number(text) || undefined)}
            style={styles.input}
            placeholder="Kaution"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Zustellung</Text>
          <TouchableOpacity
            onPress={() => setDeliveryAvailable(!deliveryAvailable)}
            style={[
              styles.deliveryToggle,
              deliveryAvailable
                ? styles.deliveryActive
                : styles.deliveryInactive,
            ]}
          >
            <Feather
              name={deliveryAvailable ? "check-circle" : "circle"}
              size={20}
              color={deliveryAvailable ? "green" : "gray"}
              style={styles.deliveryIcon}
            />
            <Text>{deliveryAvailable ? "Ja" : "Nein"}</Text>
          </TouchableOpacity>
        </View>

        {deliveryAvailable && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Lieferpreis</Text>
            <TextInput
              value={deliveryCost ? deliveryCost.toString() : ""}
              onChangeText={(text) =>
                setDeliveryCost(Number(text) || undefined)
              }
              style={styles.input}
              placeholder="Lieferpreis"
              keyboardType="numeric"
            />
          </View>
        )}
        {deliveryAvailable && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Zusätzlicher Lieferpreis</Text>
            <TextInput
              value={
                additionalDeliveryCost ? additionalDeliveryCost.toString() : ""
              }
              onChangeText={(text) =>
                setAdditionalDeliveryCost(Number(text) || undefined)
              }
              style={styles.input}
              placeholder="Zusätzlicher Lieferpreis"
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Startdatum</Text>
          <TextInput
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enddatum</Text>
          <TextInput
            value={endDate}
            onChangeText={setEndDate}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kontakt Email</Text>
          <TextInput
            value={contactEmail}
            onChangeText={setContactEmail}
            style={styles.input}
            placeholder="Email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kontakt Website</Text>
          <TextInput
            value={contactWebsite}
            onChangeText={setContactWebsite}
            style={styles.input}
            placeholder="Website"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kontakt WhatsApp</Text>
          <TextInput
            value={contactWhatsApp}
            onChangeText={setContactWhatsApp}
            style={styles.input}
            placeholder="WhatsApp"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Standort</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholder="Standort"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Bild hochladen</Text>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Feather name="upload" size={24} color="gray" />
          </TouchableOpacity>
          {imageUrl && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleAddProduct}
          style={[styles.saveButton, { backgroundColor: Colors.primary }]}
          disabled={loading} // Disable the button while loading
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Speichern..." : "Speichern"}
          </Text>
        </TouchableOpacity>

        {/* {error && <Text style={styles.errorText}>Fehler: {error}</Text>} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollViewContent: {
    padding: 16,
    paddingTop: 64,
    flexGrow: 1,
  },
  backButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "black",
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  deliveryToggle: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  deliveryActive: {
    backgroundColor: "#e6ffe6",
    borderColor: "green",
  },
  deliveryInactive: {
    borderColor: Colors.secondary,
  },
  deliveryIcon: {
    marginRight: 8,
  },
  uploadContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreviewContainer: {
    marginTop: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default AddProductPage;
