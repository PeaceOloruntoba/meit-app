import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Link, usePathname, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

interface BottomNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode; // You can use an icon library here (e.g., Ionicons, Feather)
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
          className={`flex-1 items-center py-2 ${pathname === item.href ? '' : ''}`}
        >
          {item.icon && <View className="mb-1">{item.icon}</View>}
          <Text className={`text-xs text-gray-500 ${pathname === item.href ? 'text-primary font-semibold' : ''}`}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;