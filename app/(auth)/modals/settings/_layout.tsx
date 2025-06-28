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
				name="editProfile"
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
