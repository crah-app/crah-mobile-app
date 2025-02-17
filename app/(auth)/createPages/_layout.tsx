import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
        headerLeft: () => <HeaderLeftLogo />,
        headerLargeTitle: false,
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="createArticle"
        options={{
          headerTintColor: Colors[theme].textPrimary,
          headerShadowVisible: false,
          headerShown: true,
          title: 'Create Article',
        }}
      />
      <Stack.Screen
        name="createTextPost"
        options={{
          headerTintColor: Colors[theme].textPrimary,
          headerShadowVisible: false,
          headerShown: true,
          title: 'Create Text/ Image',
        }}
      />
      <Stack.Screen
        name="createVideo"
        options={{
          headerTintColor: Colors[theme].textPrimary,
          headerShadowVisible: false,
          headerShown: true,
          title: 'Create Video',
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
