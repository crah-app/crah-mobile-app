import { Text, TextStyle } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '@/constants/Colors';

interface ThemedTextProps {
  value: string | React.JSX.Element;
  theme: 'light' | 'dark';
  style?: TextStyle | TextStyle[];
  lineNumber?: number;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  value,
  theme,
  style,
  lineNumber,
}) => {
  return (
    <Text
      numberOfLines={lineNumber || undefined}
      style={[{ color: Colors[theme].textPrimary }, style]}
    >
      {value}
    </Text>
  );
};

export default ThemedText;
