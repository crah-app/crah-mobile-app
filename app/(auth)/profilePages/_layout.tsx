import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  FlatListComponent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings and Stats',
          headerTitle: 'Settings and Stats',
          // headerLargeTitle: true,
          headerTitleStyle: [
            { fontSize: 20, color: Colors[theme].textPrimary },
          ],
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
      <Stack.Screen
        name="inbox"
        options={{
          headerShown: false,
          headerTitle: () => <></>,
          headerLeft: () => <HeaderLeftLogo />,
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
