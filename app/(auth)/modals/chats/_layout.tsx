import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
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
				name="ChatInfoModal"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="SearchNewChatModal"
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="CameraComponent"
				options={{
					animation: 'fade',
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="MediaLibrary"
				options={{
					animation: 'fade',
					headerShown: false,
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
