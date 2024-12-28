import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';

const Page = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <ThemedText
        value={
          'lsdfsdwfwergguweighefuigzwegzhewugfhfuidkghjwsghfudkjghkjshdgjkhdfghjkdfgjghjksdghfjkdol'
        }
        theme={theme}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Page;
