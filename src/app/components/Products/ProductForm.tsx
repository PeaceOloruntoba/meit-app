import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import { useLocalSearchParams } from "expo-router";

interface ProductFormProps {
  productId?: string; // Optional: for editing existing products
}

const ProductForm: React.FC<ProductFormProps> = ({ productId }) => {
  const [preis, setPreis] = useState("");
  const [zeitraum, setZeitraum] = useState(""); // Consider making this a selection
  const [kaution, setKaution] = useState("");
  const [zustellung, setZustellung] = useState(""); // Consider making this a selection/expandable
  const [lieferpreis, setLieferpreis] = useState("");
  const [bilder, setBilder] = useState<string[]>([]); // Placeholder for image URIs

  useEffect(() => {
    if (productId) {
      // Fetch existing product data based on productId for editing
      console.log(`Fetching product data for ID: ${productId}`);
      // Example:
      // fetchProduct(productId).then(data => {
      //   setPreis(data.preis.toString());
      //   setZeitraum(data.zeitraum);
      //   setKaution(data.kaution.toString());
      //   setZustellung(data.zustellung);
      //   setLieferpreis(data.lieferpreis.toString());
      //   setBilder(data.bilder || []);
      // });
    } else {
      // Reset form for creating a new product
      setPreis("");
      setZeitraum("");
      setKaution("");
      setZustellung("");
      setLieferpreis("");
      setBilder([]);
    }
  }, [productId]);

  const handleSubmit = () => {
    const productData = {
      preis: parseFloat(preis),
      zeitraum,
      kaution: parseFloat(kaution),
      zustellung,
      lieferpreis: parseFloat(lieferpreis),
      bilder,
      // Add other relevant data
    };

    if (productId) {
      console.log("Updating product:", productId, productData);
      // Call your API or Firebase function to update the product
    } else {
      console.log("Creating new product:", productData);
      // Call your API or Firebase function to create a new product
    }
    // Optionally navigate back or show a success message
  };

  const handleBildHochladen = () => {
    // Implement image upload logic here using a library like expo-image-picker
    console.log("Bild hochladen pressed");
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-lg font-semibold mb-2">
        {productId ? "Produkt bearbeiten" : "Produkt hinzufügen"}
      </Text>

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Preis [in €]"
        keyboardType="numeric"
        value={preis}
        onChangeText={setPreis}
      />

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Zeitraum"
        value={zeitraum}
        onChangeText={setZeitraum}
      />

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Kaution"
        keyboardType="numeric"
        value={kaution}
        onChangeText={setKaution}
      />

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Zustellung"
        value={zustellung}
        onChangeText={setZustellung}
      />

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        placeholder="Lieferpreis"
        keyboardType="numeric"
        value={lieferpreis}
        onChangeText={setLieferpreis}
      />

      <TouchableOpacity
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md flex-row justify-between items-center"
        onPress={handleBildHochladen}
      >
        <Text className="text-gray-500">Bilder hochladen</Text>
        {/* You might want to use an icon here */}
        <Text>⬆️</Text>
      </TouchableOpacity>

      {/* Display uploaded images here */}
      {bilder.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm text-gray-600 mb-2">
            Hochgeladene Bilder:
          </Text>
          {/* Render image previews here */}
        </View>
      )}

      <Button
        title={productId ? "Speichern" : "Hinzufügen"}
        onPress={handleSubmit}
        color={Colors.primary}
      />
    </ScrollView>
  );
};

export default ProductForm;
