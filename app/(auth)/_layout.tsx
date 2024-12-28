import React from 'react';
import { Link, Tabs } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import Scooter from '../../assets/images/vectors/scooter.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Layout = () => {
  const theme = useSystemTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: [
            styles.tabBarStyle,
            {
              borderColor: Colors[theme].background,
              backgroundColor: Colors[theme].surface,
              bottom: bottom / 2.5,
            },
          ],
          tabBarInactiveTintColor: Colors[theme].textPrimary,
          tabBarActiveTintColor: Colors.default.primary,
          headerStyle: {
            backgroundColor: Colors[theme].surface,
          },
          headerTitleStyle: {
            color: Colors[theme].textPrimary,
          },
          headerShadowVisible: false,
          tabBarItemStyle: [
            {
              paddingVertical: 10,
            },
          ],
        }}
      >
        <Tabs.Screen
          name="homePages"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
            tabBarShowLabel: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="searchPages"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
            tabBarShowLabel: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="createPages"
          options={{
            tabBarIcon: () => null,
            tabBarShowLabel: false,
            headerShown: false,
            tabBarButton: (props) => (
              <Link
                {...props}
                style={styles.plusButtonContainer}
                href={{ pathname: '/createPages' }}
                asChild
              >
                <TouchableOpacity>
                  <View style={[styles.plusButton]}>
                    <Ionicons name="add" size={30} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </Link>
            ),
          }}
        />

        <Tabs.Screen
          name="statsPages"
          options={{
            tabBarIcon: ({ color }) => (
              <SvgXml
                width="25"
                height="25"
                xml={Scooter}
                fill={color}
                style={[{ color }]}
              />
            ),
            tabBarShowLabel: false,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profilePages"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
            tabBarShowLabel: false,
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.primary,
  },
  tabBarStyle: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 10,
    paddingHorizontal: 15,
    height: 70,
  },
  plusButtonContainer: {
    position: 'absolute',
    top: 5,
    left: '50%',
    transform: [{ translateX: -25 }],
    zIndex: 1,
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#8B0000',
    backgroundColor: Colors.default.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default Layout;
