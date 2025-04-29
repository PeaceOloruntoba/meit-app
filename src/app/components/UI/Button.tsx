import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  color = Colors.primary,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: color,
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
        disabled && { opacity: 0.5 },
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;