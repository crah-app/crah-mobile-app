import React, { useState } from 'react';
import { Link, Tabs, useSegments } from 'expo-router';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import Scooter from '../../assets/images/vectors/scooter.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '@/components/ThemedText';
import CreateModal from '@/components/CreateModal';

const Layout = () => {
  const theme = useSystemTheme();
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const segments = useSegments();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: [
            styles.tabBarStyle,
            {
              borderColor: Colors[theme].background,
              backgroundColor: Colors[theme].background,
              paddingBottom: bottom,
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
            tabBarShowLabel: true,
            tabBarLabel: 'Home',
            headerShown: false,
            tabBarStyle: [
              styles.tabBarStyle,
              {
                borderColor: Colors[theme].background,
                backgroundColor: Colors[theme].background,
                paddingBottom: bottom,
                display: segments[3] === '[id]' ? 'none' : 'flex',
              },
            ],
          }}
        />

        <Tabs.Screen
          name="searchPages"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
            tabBarShowLabel: true,
            tabBarLabel: 'Search',
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="createPages"
          options={{
            tabBarIcon: () => null,
            headerShown: false,
            tabBarButton: (props) => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.plusButtonContainer}
              >
                <View style={styles.plusButton}>
                  <Ionicons name="add" size={30} color="#FFF" />
                </View>
              </TouchableOpacity>
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
                style={{ color }}
              />
            ),
            tabBarShowLabel: true,
            tabBarLabel: 'Ranks',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profilePages"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
            tabBarShowLabel: true,
            tabBarLabel: 'Profile',
            headerShown: false,
          }}
        />
      </Tabs>

      <CreateModal
        theme={theme}
        visible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  tabBarStyle: {
    position: 'absolute',
    borderRadius: 0,
    borderWidth: 10,
    borderBottomWidth: 10,
    paddingHorizontal: 15,
    height: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'white',
    // borderLeftColor: 'white',
    // borderRightColor: 'white',
  },
  plusButtonContainer: {
    bottom: 0,
    alignItems: 'center',
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
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
