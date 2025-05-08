import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/hook/useAuth";
import { toast } from "sonner-native"; // Import toast

const ProfileScreen = () => {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Profil wird geladen...</Text>
      </View>
    );
  }

  if (error) {
    toast.error("Error: ", error);
  }

  if (!user) {
    toast.error("Unauthorised!!!");
    router.push("/pages/login");
    return;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Erfolgreich abgemeldet!");
      // The AuthProvider should handle redirecting to the login screen
    } catch (err: any) {
      console.error("Logout error:", err.message);
      toast.error(`Abmeldung fehlgeschlagen: ${err.message}`);
    }
  };

  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 flex-col justify-between">
      <View>
        <TouchableOpacity
          onPress={() => router.push("/pages/profile/edit-profile")}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1"
        >
          <Text className="text-lg text-gray-800">Profil bearbeiten</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* Handle Impressum navigation */
          }}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1"
        >
          <Text className="text-lg text-gray-800">Impressum</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* Handle Rechtliches navigation */
          }}
          className="flex-row items-center justify-between px-5 py-4 bg-white mb-1"
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
          onPress={() => {
            /* Handle Account löschen */
          }}
          className="flex-row items-center justify-between px-5 py-4 bg-[#d32f2f] mt-3 rounded-md"
        >
          <Text className="text-lg text-white">Account löschen</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
