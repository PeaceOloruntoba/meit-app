import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const ProfilePage = () => {
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
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">
          Fehler beim Laden des Profils: {error}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Nicht angemeldet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4 pt-20 flex-col justify-between">
      <View>
        <TouchableOpacity
          onPress={() => router.push("/edit-profile")}
          style={styles.listItem}
        >
          <Text className="text-lg text-gray-800">Profil bearbeiten</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* Handle Impressum navigation */
          }}
          style={styles.listItem}
        >
          <Text className="text-lg text-gray-800">Impressum</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* Handle Rechtliches navigation */
          }}
          style={styles.listItem}
        >
          <Text className="text-lg text-gray-800">Rechtliches</Text>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text className="text-lg text-red-600">Abmelden</Text>
          <Feather name="chevron-right" size={20} color="#d32f2f" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            /* Handle Account löschen */
          }}
          style={styles.deleteAccountButton}
        >
          <Text className="text-lg text-white">Account löschen</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d32f2f",
    marginBottom: 6,
    borderRadius: 10,
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#d32f2f",
    marginTop: 12,
  },
});

export default ProfilePage;
