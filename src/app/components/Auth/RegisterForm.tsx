import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";

const RegisterForm: React.FC = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
  const [idBackImage, setIdBackImage] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agbChecked, setAgbChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const { register, loading, error } = useAuth();

  const pickImage = async (setImageState: (uri: string | null) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to upload images!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageState(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!agbChecked || !privacyChecked) {
      toast.error("Bitte akzeptiere die AGB und die Datenschutzbestimmungen.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwörter stimmen nicht überein!");
      return;
    }

    const additionalData = {
      lastName,
      firstName,
      address,
      taxId,
      idFrontImage,
      idBackImage,
      whatsappNumber: phoneNumber, // Assuming phoneNumber is for WhatsApp
    };

    await register(email, password, additionalData);

    if (!loading && !error) {
      toast.success("Registrierung erfolgreich!");
    } else if (error) {
      toast.error(`Registrierungsfehler: ${error}`);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F5F7FA] px-6">
      <Text className="text-3xl font-bold text-black mt-10 mb-4">
        Registriere dich!
      </Text>

      <View className="flex-row justify-between w-full mb-4 gap-2">
        <TextInput
          placeholder="Nachname"
          className="flex-1 p-3 rounded-xl bg-white text-gray-700 shadow-sm"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Vorname"
          className="flex-1 p-3 rounded-xl bg-white text-gray-700 shadow-sm"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View className="w-full mb-4">
        <TextInput
          placeholder="E-Mail"
          className="w-full p-3 pl-10 rounded-xl bg-white text-gray-700 shadow-sm"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View className="absolute left-3 top-3">
          <FontAwesome name="envelope-o" size={20} color="gray" />
        </View>
      </View>

      <TextInput
        placeholder="Adresse"
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Steuer ID / Umsatzsteuer ID"
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        value={taxId}
        onChangeText={setTaxId}
      />

      <TouchableOpacity
        onPress={() => pickImage(setIdFrontImage)}
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm items-start justify-center"
      >
        <Text className="text-gray-500">
          Bild vom Personalausweis Vorderseite
        </Text>
        {idFrontImage && (
          <Image
            source={{ uri: idFrontImage }}
            style={{ width: 100, height: 75, marginTop: 5 }}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => pickImage(setIdBackImage)}
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm items-start justify-center"
      >
        <Text className="text-gray-500">
          Bild vom Personalausweis Rückseite
        </Text>
        {idBackImage && (
          <Image
            source={{ uri: idBackImage }}
            style={{ width: 100, height: 75, marginTop: 5 }}
          />
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Telefonnummer - WhatsApp"
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        placeholder="Passwort"
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Passwort wiederholen"
        className="w-full p-3 mb-4 rounded-xl bg-white text-gray-700 shadow-sm"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View className="flex-row w-full mb-6 gap-2">
        <TouchableOpacity
          onPress={() => setAgbChecked(!agbChecked)}
          className={`flex-1 flex-row items-center p-3 rounded-xl bg-white ${
            agbChecked ? "border-[#7C5CFC] border-2" : ""
          }`}
        >
          <View
            className={`w-5 h-5 rounded-md border border-gray-400 mr-2 items-center justify-center ${
              agbChecked ? "bg-[#7C5CFC]" : "bg-white"
            }`}
          >
            {agbChecked && <AntDesign name="check" size={16} color="white" />}
          </View>
          <Text className="text-sm">AGB</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPrivacyChecked(!privacyChecked)}
          className={`flex-1 flex-row items-center p-3 rounded-xl bg-white ${
            privacyChecked ? "border-[#7C5CFC] border-2" : ""
          }`}
        >
          <View
            className={`w-5 h-5 rounded-md border border-gray-400 mr-2 items-center justify-center ${
              privacyChecked ? "bg-[#7C5CFC]" : "bg-white"
            }`}
          >
            {privacyChecked && (
              <AntDesign name="check" size={16} color="white" />
            )}
          </View>
          <Text className="text-sm">Datenschutz</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={
          loading ||
          !agbChecked ||
          !privacyChecked ||
          !idFrontImage ||
          !idBackImage
        }
        className={`w-full bg-[#7C5CFC] p-4 rounded-xl items-center mb-4 ${
          loading ||
          !agbChecked ||
          !privacyChecked ||
          !idFrontImage ||
          !idBackImage
            ? "opacity-50"
            : ""
        }`}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Registrieren..." : "Jetzt registrieren"}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}

      <Text className="text-gray-500 mt-4">
        Hast du bereits ein Konto?{" "}
        <Link href="/(auth)/login" className="text-[#7C5CFC] font-semibold">
          Anmelden
        </Link>
      </Text>
    </View>
  );
};

export default RegisterForm;
