import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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
				headerLeft: () => <HeaderLeftLogo />,
				headerLargeTitle: false,
				animation: 'none',
			}}>
			<Stack.Screen
				name="createArticle"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="createTextPost"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="createVideo"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
