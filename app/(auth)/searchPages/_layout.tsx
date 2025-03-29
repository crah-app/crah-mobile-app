import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

const Layout = () => {
	const theme = useSystemTheme();
	const [searchText, setSearchText] = useState('');

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
			}}>
			<Stack.Screen
				name="index"
				options={{
					headerStyle: {
						backgroundColor: Colors[theme].surface,
					},
					headerTitleStyle: {
						color: Colors[theme].textPrimary,
					},
					headerShown: true,
					headerSearchBarOptions: {
						placeholder: 'Search for...',
						headerIconColor: Colors[theme].textPrimary,
						textColor: Colors[theme].textPrimary,
						tintColor: Colors[theme].textPrimary,
						hintTextColor: Colors[theme].textPrimary,
						onChangeText: (text) => setSearchText('sf'),
					},
					headerTintColor: Colors[theme].textPrimary,
					headerLargeTitle: false,
					headerShadowVisible: false,
					title: '',
					headerTitle: () => <View></View>,
					headerLeft: () => <HeaderLeftLogo />,
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
