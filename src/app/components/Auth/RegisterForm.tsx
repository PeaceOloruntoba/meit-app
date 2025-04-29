import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "expo-router";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";

const RegisterForm: React.FC = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [idFrontImage, setIdFrontImage] = useState(""); // Placeholder for image upload
  const [idBackImage, setIdBackImage] = useState(""); // Placeholder for image upload
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agbChecked, setAgbChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const { register, loading, error } = useAuth();

  const handleRegister = async () => {
    if (!agbChecked || !privacyChecked) {
      console.error("Please accept the terms and privacy policy.");
      // Set an error state to display to the user
      return;
    }
    if (password !== confirmPassword) {
      console.error("Passwords do not match!");
      // Set an error state to display to the user
      return;
    }
    // In a real application, you would likely collect all the form data
    const registrationData = {
      lastName,
      firstName,
      email,
      address,
      taxId,
      idFrontImage,
      idBackImage,
      phoneNumber,
      // You might not send password directly here depending on your backend
    };
    await register(email, password, false, registrationData); // Assuming not a company registration here
    if (!loading && !error) {
      console.log("Registration successful!");
      // Potentially navigate the user
    } else if (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <View className="flex-1 items-center bg-white px-6 py-10">
      <Text className="text-3xl font-bold text-black mb-6">
        Registriere dich!
      </Text>

      <View className="flex-row justify-between w-full mb-4 gap-2">
        <TextInput
          placeholder="Nachname"
          className="flex-1 p-3 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Vorname"
          className="flex-1 p-3 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View className="w-full mb-4">
        <TextInput
          placeholder="E-Mail"
          className="w-full p-3 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
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
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        placeholder="Steuer ID / Umsatzsteuer ID"
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
        value={taxId}
        onChangeText={setTaxId}
      />

      <TouchableOpacity
        onPress={() => console.log("Upload ID Front")}
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm items-start justify-center"
      >
        <Text className="text-gray-500">
          Bild vom Personalausweis Vorderseite
        </Text>
        {idFrontImage ? <Text>{idFrontImage}</Text> : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => console.log("Upload ID Back")}
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm items-start justify-center"
      >
        <Text className="text-gray-500">
          Bild vom Personalausweis Rückseite
        </Text>
        {idBackImage ? <Text>{idBackImage}</Text> : null}
      </TouchableOpacity>

      <TextInput
        placeholder="Telefonnummer - WhatsApp"
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        placeholder="Passwort"
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Passwort wiederholen"
        className="w-full p-3 mb-4 rounded-xl bg-[#F5F7FA] text-gray-700 shadow-sm"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View className="flex-row w-full mb-6 gap-2">
        <TouchableOpacity
          onPress={() => setAgbChecked(!agbChecked)}
          className={`flex-1 flex-row items-center p-3 rounded-xl bg-[#F5F7FA] ${
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
          className={`flex-1 flex-row items-center p-3 rounded-xl bg-[#F5F7FA] ${
            privacyChecked ? "border-[#7C5CFC] border-2" : ""
          }`}
        >
          <View
            className={`w-5 h-5 rounded-md border border-gray-400 mr-2 items-center justify-center ${
              privacyChecked ? "bg-white" : "bg-white"
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
        disabled={loading || !agbChecked || !privacyChecked}
        className={`w-full bg-[#7C5CFC] p-4 rounded-xl items-center mb-4 ${
          loading || !agbChecked || !privacyChecked ? "opacity-50" : ""
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
