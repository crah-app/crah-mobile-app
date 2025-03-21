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
	StatusBar,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import Scooter from '../../assets/images/vectors/scooter.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '@/components/general/ThemedText';
import CreateModal from '@/components/CreatePostDropDownMenu';
import CreatePostDropDownMenu from '@/components/CreatePostDropDownMenu';

const Layout = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();
	const segments = useSegments();

	return (
		<View style={styles.container}>
			<StatusBar barStyle={'default'} />
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
				}}>
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
								display: segments[2] === 'chats' ? 'none' : 'flex',
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
						tabBarButton: (props) => <CreatePostDropDownMenu />,
					}}
				/>

				<Tabs.Screen
					name="statsPages"
					options={{
						tabBarIcon: ({ color }) => (
							<SvgXml width="25" height="25" xml={Scooter} fill={color} />
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
						tabBarStyle: [
							styles.tabBarStyle,
							{
								borderColor: Colors[theme].background,
								backgroundColor: Colors[theme].background,
								paddingBottom: bottom,
								display:
									// prettier-ignore
									(segments[2] !== 'inbox' && segments[2] !== 'settings')
										? 'flex'
										: 'none',
							},
						],
					}}
				/>
			</Tabs>
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
});

export default Layout;
