import ThemedView from '@/components/ThemedView';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';

const Page = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <ThemedText theme={theme} value="search" />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Page;
