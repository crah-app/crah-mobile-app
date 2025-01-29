import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
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
          // headerSearchBarOptions: { placeholder: 'Search for chat' },
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: false,
          headerShadowVisible: false,
          title: '',
          headerTitle: () => <View></View>,
          headerLeft: () => (
            <SafeAreaView>
              <SvgXml
                width={130}
                height={130}
                xml={TextLogo}
                style={{
                  bottom: Platform.OS === 'ios' ? -61.5 : -15,
                  position: 'absolute',
                  left: 0,
                }}
              />
            </SafeAreaView>
          ),
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
