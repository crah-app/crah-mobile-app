import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React from 'react';
import {
  FlatListComponent,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          // headerSearchBarOptions: { placeholder: 'Search for...' },
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: false,
          headerShadowVisible: false,
          title: '',
          headerTitle: () => <View></View>,
          headerLeft: () => <HeaderLeftLogo />,
          headerRight: () => (
            <View
              style={{
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderColor: Colors[theme].textPrimary,
                paddingLeft: 14,
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={28}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default Layout;
