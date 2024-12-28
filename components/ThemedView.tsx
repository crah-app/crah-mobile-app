import { View, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '@/constants/Colors';

interface ThemedViewProps {
  theme: 'light' | 'dark';
  children?: React.ReactNode;
  flex?: number;
  style?: ViewStyle | ViewStyle[];
}

const ThemedView: React.FC<ThemedViewProps> = ({
  theme,
  children,
  flex,
  style,
}) => {
  return (
    <View style={[{ backgroundColor: Colors[theme].background, flex }, style]}>
      {children}
    </View>
  );
};

export default ThemedView;
