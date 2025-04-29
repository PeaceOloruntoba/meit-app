import React from "react";
import { View, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import ProductCard from "../../components/UI/ProductCard";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

// Dummy product data - replace with your actual data fetching
const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "Produktname 1",
    imageUrl:
      "https://www.bing.com/images/search?view=detailV2&ccid=RRLRTfyo&id=887012984823F99E1CBC718189CCA3D53B93F5EA&thid=OIP.RRLRTfyovae8cElrahuPHwHaE8&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f2944739.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4512d14dfca8bda7bc70496b6a1b8f1f%3frik%3d6vWTO9WjzImBcQ%26pid%3dImgRaw%26r%3d0&exph=2731&expw=4096&q=blue+bmw&simid=607988716747886360&FORM=IRPRST&ck=4E28E45B2FC51F5FB2C6DE645B22245D&selectedIndex=0&itb=0",
    deposit: "30,00 €",
    deliveryCost: "30,00 €",
    pricePerDay: "30 €",
    distance: "20km",
  },
  {
    id: "2",
    name: "Produktname 2",
    imageUrl: "https://via.placeholder.com/300/a1887f",
    deposit: "30,00 €",
    deliveryCost: "30,00 €",
    pricePerMonth: "30 €",
    distance: "20km",
  },
  {
    id: "3",
    name: "Produktname 3",
    imageUrl: "https://via.placeholder.com/300/64b5f6",
    deposit: "00,00 €",
    pickupAvailable: true,
    pricePerDay: "30 €",
    distance: "20km",
  },
  // Add more dummy products
];

const CompanyDashboardPage = () => {
  return (
    <View className="flex-1 pt-20 bg-[#F2F5FA] p-4">
      <View className="flex-row items-center mb-4">
        <View className="flex-1 bg-white rounded-md p-2">
          <TextInput placeholder="Suche..." className="text-sm text-gray-700" />
        </View>
        <Link href="/(app)/companies/add" className="ml-3">
          <TouchableOpacity className="bg-black rounded-md items-center flex justify-center p-3">
            <Feather name="plus" size={28} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={DUMMY_PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CompanyDashboardPage;
