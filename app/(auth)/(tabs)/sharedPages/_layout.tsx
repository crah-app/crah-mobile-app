import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
	const theme = useSystemTheme();

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: Colors[theme].background,
				},
				headerTitleStyle: {
					color: Colors[theme].textPrimary,
				},
				headerShadowVisible: false,
			}}>
			<Stack.Screen
				name="userProfile"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
};

export default Layout;
