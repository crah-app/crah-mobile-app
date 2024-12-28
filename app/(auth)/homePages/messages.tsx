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
      <Stack.Screen
        options={{
          title: 'Messages',
          headerTintColor: Colors[theme].textPrimary,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors[theme].textPrimary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ThemedText theme={theme} value="messages" />
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default Page;
