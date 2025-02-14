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
import { SvgXml } from 'react-native-svg';
import TextLogo from '../../../assets/images/vectors/TextLogo.svg';
import { Ionicons } from '@expo/vector-icons';

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
        headerLargeTitle: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: false,
          headerShadowVisible: false,
          title: '',
          headerTitle: () => <View></View>,
          headerLeft: () => (
            <SvgXml
              width={130}
              height={130}
              xml={TextLogo}
              style={{
                position: 'absolute',
                left: 0,
              }}
            />
          ),
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
