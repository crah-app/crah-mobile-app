import React, { useState } from 'react';
import { Link, Tabs } from 'expo-router';
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

const Layout = () => {
  const theme = useSystemTheme();
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

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

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: 'absolute',
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: Colors[theme].container_surface,
                  position: 'absolute',
                  bottom: Platform.OS === 'ios' ? 70 + 20 : 70 + 30,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: 'rgba(0,0,0,1)',
                },
              ]}
            >
              <View
                style={[
                  {
                    width: '100%',
                    paddingBottom: 4,
                    borderBottomColor: Colors[theme].textPrimary,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '90%',
                      marginTop: 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalText,
                      { color: Colors[theme].textPrimary, fontWeight: 700 },
                    ]}
                  >
                    create
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                }}
              >
                <Link
                  onPress={() => setModalVisible(false)}
                  href={{ pathname: '/(auth)/createPages/createVideo' }}
                  style={[
                    styles.modalCategory,
                    {
                      borderBottomColor: 'rgba(255,255,255,0.3)',
                      textAlign: 'center',
                    },
                  ]}
                >
                  <ThemedText theme={theme} value={'Video'} />
                </Link>

                <Link
                  onPress={() => setModalVisible(false)}
                  href={{ pathname: '/(auth)/createPages/createTextPost' }}
                  style={[
                    styles.modalCategory,
                    {
                      borderBottomColor: 'rgba(255,255,255,0.3)',
                      textAlign: 'center',
                    },
                  ]}
                >
                  <ThemedText theme={theme} value={'Text'} />
                </Link>

                <Link
                  onPress={() => setModalVisible(false)}
                  href={{ pathname: '/(auth)/createPages/createTextPost' }}
                  style={[
                    styles.modalCategory,
                    {
                      borderBottomColor: 'rgba(255,255,255,0.3)',
                      textAlign: 'center',
                    },
                  ]}
                >
                  <ThemedText theme={theme} value={'Image'} />
                </Link>

                <Link
                  onPress={() => setModalVisible(false)}
                  href={{ pathname: '/(auth)/createPages/createArticle' }}
                  style={[
                    styles.modalCategory,
                    {
                      borderBottomColor: 'transparent',
                      textAlign: 'center',
                    },
                  ]}
                >
                  <ThemedText theme={theme} value={'Article'} />
                </Link>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    position: 'absolute',
    borderRadius: 70,
    borderWidth: 10,
    borderBottomWidth: 40,
    paddingHorizontal: 10,
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    borderTopWidth: 0,
  },
  plusButtonContainer: {
    bottom: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: 200,
  },
  modalText: {
    fontSize: 18,
  },

  modalCategory: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
});

export default Layout;
