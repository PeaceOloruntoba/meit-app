import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

// Dummy data for rentals (replace with your actual data fetching)
const dummyRentals = [
  {
    id: "1",
    name: "Spacious Apartment in Lekki",
    imageUrl:
      "https://via.placeholder.com/300/008080/FFFFFF?Text=Lekki+Apartment",
    pricePerMonth: 150000,
    location: "Lekki, Lagos",
  },
  {
    id: "2",
    name: "Cozy Studio in Yaba",
    imageUrl: "https://via.placeholder.com/300/800080/FFFFFF?Text=Yaba+Studio",
    pricePerMonth: 75000,
    location: "Yaba, Lagos",
  },
  {
    id: "3",
    name: "Office Space in Ikeja",
    imageUrl: "https://via.placeholder.com/300/FFA500/FFFFFF?Text=Ikeja+Office",
    pricePerMonth: 250000,
    location: "Ikeja, Lagos",
  },
  {
    id: "4",
    name: "Warehouse in Apapa",
    imageUrl:
      "https://via.placeholder.com/300/4682B4/FFFFFF?Text=Apapa+Warehouse",
    pricePerMonth: 400000,
    location: "Apapa, Lagos",
  },
  // Add more dummy rentals here
];

const RentalItem = ({ rental }: { rental: (typeof dummyRentals)[0] }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/rentals/${rental.id}`)}
      className="bg-white rounded-lg mb-4 overflow-hidden"
    >
      <Image
        source={{ uri: rental.imageUrl }}
        className="w-full h-52 resize-cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold text-text mb-2">{rental.name}</Text>
        <Text className="text-primary text-base mb-1">
          ₦{rental.pricePerMonth}/month
        </Text>
        <Text className="text-secondary-text text-sm">{rental.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const RentalsPage = () => {
  return (
    <View className="flex-1 bg-[#F2F5FA] p-4 pt-20">
      <Text className="text-2xl font-bold mb-4 text-text">
        Available Rentals in Your inbox
      </Text>
      <FlatList
        data={dummyRentals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RentalItem rental={item} />}
      />
    </View>
  );
};

export default RentalsPage;
