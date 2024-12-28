import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

import ScooterBar from '../../../assets/images/vectors/bar.svg';
import ScooterWheel from '../../../assets/images/vectors/wheel.svg';

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
          title: 'Home',
          headerTintColor: Colors[theme].textPrimary,
          // headerLargeTitle: true,
          headerShadowVisible: false,
          headerRight: () => (
            <Link
              asChild
              href={{
                params: {},
                pathname: '/homePages/messages',
              }}
            >
              <TouchableOpacity>
                <SvgXml
                  width="25"
                  height="25"
                  xml={ScooterBar}
                  style={[
                    {
                      color: Colors[theme].textPrimary,
                    },
                  ]}
                />
              </TouchableOpacity>
            </Link>
          ),
          headerLeft: () => (
            <TouchableOpacity>
              <SvgXml
                width="25"
                height="25"
                xml={ScooterWheel}
                style={[
                  {
                    color: Colors[theme].textPrimary,
                  },
                ]}
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
