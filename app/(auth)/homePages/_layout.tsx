import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Link, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextLogo from '../../../assets/images/vectors/TextLogo.svg';

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
          headerLeft: () => (
            <SafeAreaView>
              <SvgXml
                width={130}
                height={130}
                xml={TextLogo}
                style={{
                  bottom: Platform.OS === 'ios' ? -3 : -65,
                  position: 'absolute',
                  left: 0,
                }}
              />
            </SafeAreaView>
          ),
        }}
      />
      <Stack.Screen
        name="messages"
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
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
