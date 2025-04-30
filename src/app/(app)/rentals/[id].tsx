import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Dummy function to fetch rental details (replace with your actual API call)
const fetchRentalDetails = (id: string) => {
  // In a real app, you'd fetch data from your backend or Firebase
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyRental = {
        id: id,
        name: `Detailed Rental ${id}`,
        imageUrl: `https://via.placeholder.com/600/${Math.floor(
          Math.random() * 16777215
        ).toString(16)}/FFFFFF?Text=Rental+${id}+Details`,
        pricePerMonth: Math.floor(Math.random() * 500000) + 50000,
        location: `Area ${Math.floor(Math.random() * 10) + 1}, Agege, Nigeria`,
        description: `This is a detailed description for rental property ${id}. It includes multiple features, spacious rooms, and excellent amenities. Contact us for more information and to schedule a viewing.`,
        amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
        contact: {
          email: "info@example-rentals.com",
          phone: "+234 800 000 0000",
        },
      };
      resolve(dummyRental);
    }, 500); // Simulate an API delay
  });
};

const RentalDetailsPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRentalDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await fetchRentalDetails(id!);
        setRental(details);
      } catch (e: any) {
        setError("Failed to load rental details.");
        console.error("Error loading rental details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRentalDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-text">Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (!rental) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-text">Rental not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-500">&larr; Back to Rentals</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: rental.imageUrl }}
        className="w-full h-64 rounded-lg mb-4 resize-cover"
      />
      <Text className="text-2xl font-bold text-text mb-2">{rental.name}</Text>
      <Text className="text-primary text-xl mb-3">
        ₦{rental.pricePerMonth}/month
      </Text>
      <Text className="text-secondary-text text-base mb-4">
        {rental.location}
      </Text>
      <Text className="text-text font-medium mb-2">Description:</Text>
      <Text className="text-secondary-text text-base mb-4">
        {rental.description}
      </Text>
      {rental.amenities && rental.amenities.length > 0 && (
        <View className="mb-4">
          <Text className="text-text font-medium mb-2">Amenities:</Text>
          {rental.amenities.map((amenity: string) => (
            <Text key={amenity} className="text-secondary-text text-base mb-1">
              - {amenity}
            </Text>
          ))}
        </View>
      )}
      {rental.contact && (
        <View>
          <Text className="text-text font-medium mb-2">
            Contact Information:
          </Text>
          <Text className="text-secondary-text text-base mb-1">
            Email: {rental.contact.email}
          </Text>
          <Text className="text-secondary-text text-base mb-1">
            Phone: {rental.contact.phone}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RentalDetailsPage;
