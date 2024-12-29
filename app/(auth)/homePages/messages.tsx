import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';

const Page = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={1}>
      <ThemedText theme={theme} value="messages" />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Page;
