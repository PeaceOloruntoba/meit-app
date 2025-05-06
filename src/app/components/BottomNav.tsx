// ./components/BottomNav.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { Feather } from "@expo/vector-icons";

interface BottomNavItem {
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="flex-row justify-around items-center bg-white border-t border-gray-200 py-2">
      {items.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        const iconColor = isActive ? Colors.primary : Colors.textPrimary;

        const coloredIcon = React.cloneElement(
          item.icon as React.ReactElement,
          {
            color: iconColor,
          }
        );

        return (
          <TouchableOpacity
            key={item.href}
            onPress={() => router.push(item.href)}
            className={`flex-1 items-center py-2`}
          >
            <View className="mb-1">{coloredIcon}</View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
