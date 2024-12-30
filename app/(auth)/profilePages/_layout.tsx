import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
        options={{ headerTitle: 'Profile', headerShown: true }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings and Stats',
          // headerLargeTitle: true,
          headerTitleStyle: [{ fontSize: 20 }],
          headerShown: true,
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
      <Stack.Screen name="inbox" options={{ headerTitle: 'Inbox' }} />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
