import React from 'react';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const Layout = () => {
  const theme = useSystemTheme();
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors[theme].surface },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: Colors[theme].textPrimary,
        tabBarInactiveBackgroundColor: Colors[theme].surface,
        tabBarActiveBackgroundColor: Colors[theme].background,
        headerStyle: {
          backgroundColor: Colors[theme].surface,
        },
        headerTitleStyle: {
          color: Colors[theme].textPrimary,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerRight: () => (
            <Link
              asChild
              href={{
                params: {},
                pathname: '/homePages/messages',
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  name="send-outline"
                  size={24}
                  color={Colors[theme].textPrimary}
                  style={defaultStyles.headerRightBtn}
                />
              </TouchableOpacity>
            </Link>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            // THis icon should be a scooter in the future !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            <Ionicons name="stats-chart-outline" size={24} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  centeredButton: {
    flex: 1,
    position: 'absolute',
    top: -35,
    left: '50%',
    transform: [{ translateX: -30 }],
    zIndex: 1,
  },
  buttonIcon: {
    marginTop: 0,
  },
});

export default Layout;
