import React, { useCallback, useMemo, useRef } from 'react';
import { Tabs, useSegments } from 'expo-router';
import { StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import GetSVGMemo from '@/components/GetSVG';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import ThemedText from '@/components/general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import PostTypeButton from '@/components/PostTypeButton';
import CreateModal from '../modals/createModal';

const Layout = () => {
	const theme = useSystemTheme();
	const segments = useSegments();

	const ref = useRef<BottomSheetModal>(null);

	const handleCreateBtnPress = () => {
		handlePresentModalPress();
	};

	const handlePresentModalPress = useCallback(() => {
		ref.current?.present();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar barStyle={'default'} />
			<CreateModal ref={ref} theme={theme} />

			<Tabs
				backBehavior="history"
				screenOptions={{
					tabBarStyle: [
						styles.tabBarStyle,
						{
							borderTopColor: Colors[theme].primary, // top border color
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
						tabBarButton: (props) => (
							<TouchableOpacity
								style={styles.plusButtonContainer}
								onPress={handleCreateBtnPress}>
								<View style={styles.plusButton}>
									<Ionicons name="add" size={35} color="#FFF" />
								</View>
							</TouchableOpacity>
						),
					}}
				/>

				<Tabs.Screen
					name="statsPages"
					options={{
						tabBarIcon: ({ color }) => (
							<GetSVGMemo
								props={{
									fill: color,
									width: 24,
									height: 24,
								}}
								name={'scooter'}
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
		height: 95,
		borderTopWidth: StyleSheet.hairlineWidth * 5, // top border height
		borderColor: Colors.default.primary,
		paddingHorizontal: 8, // gap between tab bar icon is narrow
		paddingTop: 15, // gap between tab bar icon and border
	},
	plusButtonContainer: {
		bottom: 1,
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
