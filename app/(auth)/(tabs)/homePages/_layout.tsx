import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

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
          title: '',
          headerTintColor: Colors[theme].textPrimary,
          headerShadowVisible: false,
          headerLeft: () => <HeaderLeftLogo />,
        }}
      />

      <Stack.Screen name="chats" options={{ headerShown: false }} />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
