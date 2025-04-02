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
import Scooter from '../../../assets/images/vectors/scooter.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '@/components/general/ThemedText';
import CreateModal from '@/components/CreatePostDropDownMenu';
import CreatePostDropDownMenu from '@/components/CreatePostDropDownMenu';
import { useUser } from '@clerk/clerk-expo';

const Layout = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();
	const segments = useSegments();
	const { user } = useUser();
	return (
		<View style={styles.container}>
			<StatusBar barStyle={'default'} />
			<Tabs
				backBehavior="history"
				screenOptions={{
					tabBarStyle: [
						styles.tabBarStyle,
						{
							borderTopColor: Colors[theme].textPrimary, // top border color
							backgroundColor: Colors[theme].background, // tab bar background color
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
							paddingVertical: 15,
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
								borderTopColor: Colors[theme].textPrimary, // top border color
								backgroundColor: Colors[theme].background, // tab bar background color
							},
							{
								display: segments[3] === 'chats' ? 'none' : 'flex',
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

						// tabBarStyle: [
						// {
						// display:
						// prettier-ignore
						// (segments[2] !== 'inbox' && segments[2] !== 'settings')
						// 	? 'flex'
						// 	: 'none',
						// },
						// ],
					}}
				/>
				<Tabs.Screen
					name="sharedPages"
					options={{
						tabBarIcon: ({ color }) => <></>,
						// tabBarShowLabel: false,
						// tabBarLabel: '',
						headerShown: false,
						href: null, // Dadurch wird es nicht als Tab-Route angezeigt
						// tabBarStyle: [
						// {
						// display:
						// prettier-ignore
						// (segments[2] !== 'inbox' && segments[2] !== 'settings')
						// 	? 'flex'
						// 	: 'none',
						// },
						// ],
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
		height: 80, // tab bar is fully in the screen
		borderTopWidth: StyleSheet.hairlineWidth * 2, // top border height
		paddingHorizontal: 15, // gap between tab bar icon is narrow
	},
});

export default Layout;
