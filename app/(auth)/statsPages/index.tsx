import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';

const Page = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView flex={1} theme={theme}>
      <ThemedText value="Stats" theme={theme} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Page;
