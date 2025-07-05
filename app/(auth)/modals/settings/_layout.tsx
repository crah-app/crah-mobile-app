import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const Layout = () => {
	const theme = useSystemTheme();
	const router = useRouter();

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
				name="editProfile"
				options={{
					presentation: 'modal',
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="changeEmail"
				options={{
					presentation: 'modal',
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="changePassword"
				options={{
					presentation: 'modal',
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="deleteAccount"
				options={{
					presentation: 'modal',
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="sendFeedback"
				options={{
					presentation: 'modal',
					headerShown: false,
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
