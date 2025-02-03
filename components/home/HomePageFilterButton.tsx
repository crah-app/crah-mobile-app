import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import ThemedText from '../ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';

interface HomePageFilterButtonProps {
  text: string;
  style?: ViewStyle | ViewStyle[];
  onPress: (type: GestureResponderEvent) => void;
}

const HomePageFilterButton: React.FC<HomePageFilterButtonProps> = ({
  text,
  style,
  onPress,
}) => {
  const theme = useSystemTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: Colors[theme].surface },
        style,
      ]}
    >
      <ThemedText value={text} theme={theme} style={[styles.text]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    borderRadius: 25,
    width: 100,
    borderWidth: 1,
  },
  text: {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16,
  },
});

export default HomePageFilterButton;
