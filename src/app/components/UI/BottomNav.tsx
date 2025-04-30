import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import Colors from "../../constants/Colors";

interface BottomNavItem {
  href: string;
  label: string;
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
              {React.cloneElement(item.icon as React.ReactElement, {
                color:
                  pathname === item.href
                    ? Colors.primary
                    : Colors.textSecondary,
              })}
            </View>
          )}
          <Text
            className={`text-xs ${
              pathname === item.href
                ? "text-primary font-semibold"
                : "text-textSecondary"
            }`}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;
