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
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface HomePageFilterButtonProps {
  text: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  onPress: (type: GestureResponderEvent) => void;
}

const HomePageFilterButton: React.FC<HomePageFilterButtonProps> = ({
  text,
  style,
  textStyle,
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
      <ThemedText
        lineNumber={1}
        value={text}
        theme={theme}
        style={[styles.text, textStyle]}
      />
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
