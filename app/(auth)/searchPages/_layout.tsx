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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerSearchBarOptions: { placeholder: 'Search for...' },
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: false,
          headerShadowVisible: false,
          title: '',
          headerTitle: () => <View></View>,
          headerLeft: () => <HeaderLeftLogo />,
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
