import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Layout = () => {
  const theme = useSystemTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[theme].surface,
        },
        headerTitleStyle: {
          color: Colors[theme].textPrimary,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerSearchBarOptions: { placeholder: 'Search for chat' },
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: true,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
