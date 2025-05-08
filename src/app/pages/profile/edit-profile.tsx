import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { useAuth } from "@/hook/useAuth"; // Import useAuth

const EditProfileScreen = () => {
  const { user, loading: authLoading, updateProfile } = useAuth(); // Get user and updateProfile
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(""); // Keep email for display
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false); // Local loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email);
      setAddress(user.address || "");
      setTaxId(user.taxId || "");
      setWhatsappNumber(user.whatsappNumber || "");
      //  setFrontIdImage(user.frontIdImage || null); // Load from user data if available
      //  setBackIdImage(user.backIdImage || null);   // Load from user data if available
    }
  }, [user]);

  const pickImage = async (type: "front" | "back") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (type === "front") {
        setFrontIdImage(uri);
      } else {
        setBackIdImage(uri);
      }
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedData = {
        displayName,
        address,
        taxId,
        whatsappNumber,
        //  frontIdImageUrl: frontIdImage,  //  upload and get url
        //  backIdImageUrl: backIdImage,    // upload and get url
      };

      await updateProfile(user.uid, updatedData); // Call updateProfile from hook
      toast.success("Profil erfolgreich aktualisiert!");
      router.push("/pages/profile");
    } catch (err: any) {
      setError(err.message || "Fehler beim Speichern des Profils.");
      toast.error(`Profilaktualisierung fehlgeschlagen: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F2F5FA]">
        <ActivityIndicator size="large" color="#7C5CFC" />
        <Text className="mt-2 text-gray-600">Profil wird geladen...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F5FA] p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Feather name="arrow-left" size={24} color="#374151" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        Profil bearbeiten
      </Text>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">E-Mail</Text>
        <TextInput
          className="bg-white rounded-md py-3 px-4 text-lg text-gray-800 border border-gray-300"
          value={email}
          editable={false}
          placeholder="E-Mail"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Name</Text>
        <TextInput
          className="bg-white rounded-md py-3 px-4 text-lg text-gray-800 border border-gray-300"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Name"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Adresse
        </Text>
        <TextInput
          className="bg-white rounded-md py-3 px-4 text-lg text-gray-800 border border-gray-300"
          value={address}
          onChangeText={setAddress}
          placeholder="Adresse"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Steuer ID / Umsatzsteuer ID
        </Text>
        <TextInput
          className="bg-white rounded-md py-3 px-4 text-lg text-gray-800 border border-gray-300"
          value={taxId}
          onChangeText={setTaxId}
          placeholder="Steuer ID / Umsatzsteuer ID"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Bild vom Personalausweis Vorderseite
        </Text>
        <TouchableOpacity
          onPress={() => pickImage("front")}
          style={styles.uploadButton}
        >
          <Text className="text-gray-500">
            {frontIdImage ? "Ausgewählt" : "Bild auswählen"}
          </Text>
        </TouchableOpacity>
        {frontIdImage && (
          <Text className="text-sm mt-1 text-gray-600">
            {frontIdImage.split("/").pop()}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Bild vom Personalausweis Rückseite
        </Text>
        <TouchableOpacity
          onPress={() => pickImage("back")}
          style={styles.uploadButton}
        >
          <Text className="text-gray-500">
            {backIdImage ? "Ausgewählt" : "Bild auswählen"}
          </Text>
        </TouchableOpacity>
        {backIdImage && (
          <Text className="text-sm mt-1 text-gray-600">
            {backIdImage.split("/").pop()}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Telefonnummer - WhatsApp
        </Text>
        <TextInput
          className="bg-white rounded-md py-3 px-4 text-lg text-gray-800 border border-gray-300"
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
          placeholder="Telefonnummer - WhatsApp"
          keyboardType="phone-pad"
        />
      </View>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <TouchableOpacity
        onPress={handleSaveProfile}
        className="bg-indigo-600 rounded-md py-3 px-6 items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Speichern</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
});

export default EditProfileScreen;
