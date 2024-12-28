import { Text, TextStyle } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '@/constants/Colors';

interface ThemedTextProps {
  value: string | React.JSX.Element;
  theme: 'light' | 'dark';
  style?: TextStyle | TextStyle[];
}

const ThemedText: React.FC<ThemedTextProps> = ({ value, theme, style }) => {
  return (
    <Text style={[{ color: Colors[theme].textPrimary }, style]}>{value}</Text>
  );
};

export default ThemedText;
