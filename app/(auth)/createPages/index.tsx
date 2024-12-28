import { View, Text } from 'react-native';
import React from 'react';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';

const Pgae = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <ThemedText theme={theme} value={'create'} />
    </ThemedView>
  );
};

export default Pgae;
