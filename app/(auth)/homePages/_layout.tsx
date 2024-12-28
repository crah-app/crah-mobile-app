import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';

import ScooterBar from '../../../assets/images/vectors/bar.svg';
import ScooterWheel from '../../../assets/images/vectors/wheel.svg';
import TextLogo from '../../../assets/images/vectors/TextLogo.svg';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          headerTitle: () => <View></View>,
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
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 15 }}>
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
            </View>
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
