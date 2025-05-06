import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import Colors from "../../constants/Colors";

interface BottomNavItem {
  href: string;
  icon?: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="flex-row justify-around items-center bg-white border-t border-gray-200 py-2">
      {items.map((item) => (
        <TouchableOpacity
          key={item.href}
          onPress={() => router.push(item.href)}
          className={`flex-1 items-center py-2`}
        >
          {item.icon && (
            <View className="mb-1">
              {React.cloneElement(item.icon as React.ReactElement)}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;
