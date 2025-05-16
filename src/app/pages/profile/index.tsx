import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner-native";

const ProfileScreen = () => {
  const { user, loading, error, logout, deleteAccount } = useAuth();
  const router = useRouter();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] =
    useState("");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Profil wird geladen...</Text>
      </View>
    );
  }

  if (error) {
    toast.error("Fehler: ", error);
  }

  if (!user) {
    toast.error("Nicht autorisiert!!!");
    router.push("/pages/login");
    return;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Erfolgreich abgemeldet!");
    } catch (err: any) {
      console.error("Abmeldefehler:", err.message);
      toast.error(`Abmeldung fehlgeschlagen: ${err.message}`);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deleteConfirmationPassword) {
      toast.error("Bitte geben Sie Ihr Passwort zur Bestätigung ein.");
      return;
    }

    const success = await deleteAccount(user.email, deleteConfirmationPassword);
    if (success) {
      setDeleteModalVisible(false);
    } else {
      setDeleteConfirmationPassword("");
    }
  };

  const closeModal = () => {
    setDeleteModalVisible(false);
    setDeleteConfirmationPassword("");
  };

  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 flex-col justify-between pt-20">
      <View>
        <TouchableOpacity
          onPress={() => router.push("/pages/profile/edit-profile")}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1 rounded-md"
        >
          <Text className="text-lg text-gray-800">Profil bearbeiten</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
          }}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1 rounded-md"
        >
          <Text className="text-lg text-gray-800">Impressum</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
          }}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1 rounded-md"
        >
          <Text className="text-lg text-gray-800">Rechtliches</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          className="flex-row items-center justify-between px-5 py-4 bg-white border border-[#d32f2f] mb-1 rounded-md"
          onPress={handleLogout}
        >
          <Text className="text-lg text-red-600">Abmelden</Text>
          <Feather name="chevron-right" size={20} color="#d32f2f" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="flex-row items-center justify-between px-5 py-4 bg-[#d32f2f] mt-3 rounded-md"
        >
          <Text className="text-lg text-white">Konto löschen</Text>
          <Feather name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Modal visible={isDeleteModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-[#00000080]">
          <View className="bg-white p-6 rounded-md w-4/5">
            <Text className="text-xl font-bold mb-4 text-gray-800">
              Konto löschen bestätigen
            </Text>
            <Text className="text-gray-700 mb-4">
              Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion
              kann nicht rückgängig gemacht werden. Bitte geben Sie Ihr Passwort
              ein, um fortzufahren.
            </Text>
            <TextInput
              secureTextEntry
              placeholder="Passwort"
              value={deleteConfirmationPassword}
              onChangeText={setDeleteConfirmationPassword}
              className="border border-gray-300 rounded-md p-2 mb-4"
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={closeModal}
                className="px-4 py-2 rounded-md text-gray-600 mr-2"
              >
                <Text>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                <Text className="text-white">{loading ? "Löschen..." : "Konto löschen"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
