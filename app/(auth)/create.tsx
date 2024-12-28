import { View, Text } from 'react-native';
import React from 'react';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';

const Pgae = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <Text>Page</Text>
    </ThemedView>
  );
};

export default Pgae;
