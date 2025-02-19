import { TrickDifficulty } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';

interface TrickColumnProps {
  name: string;
  points: number;
  difficulty: TrickDifficulty;
}

const TrickColumn: React.FC<TrickColumnProps> = ({
  name,
  points,
  difficulty,
}) => {
  const theme = useSystemTheme();

  return (
    <View style={[styles.container]}>
      <ThemedText value={name} theme={theme} />
      <ThemedText value={points.toString()} theme={theme} />
      <ThemedText value={difficulty} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
  },
});

export default TrickColumn;
