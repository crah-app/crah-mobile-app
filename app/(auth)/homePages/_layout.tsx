import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Platform,
  Text,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Link, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
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
