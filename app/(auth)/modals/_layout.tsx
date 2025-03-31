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
				name="postView"
				options={{
					presentation: 'modal',
					title: '',
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					),
				}}
			/>

			<Stack.Screen
				name="PostCommentSection"
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
					title: 'Comments',
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.push('/(auth)/(tabs)/homePages')}>
							<Ionicons
								name="arrow-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="help_modal"
				options={{
					headerShown: true,
					title: 'Help',
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="TrickModal"
				options={{
					headerShown: true,
					title: 'Trick',
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name="uploadVideoModal"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="compareRider"
				options={{
					presentation: 'modal',
					headerShown: true,
					title: 'compare',
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
