import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const Id = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <SafeAreaView>
        <ThemedText theme={theme} value={'lol'} />
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Id;
