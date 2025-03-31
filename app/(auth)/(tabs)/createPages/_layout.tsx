import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { Ionicons } from '@expo/vector-icons';

import helpModalContent from '@/JSON/non_dummy_data/inbox_help_modal_content.json';
import { defaultHeaderBtnSize } from '@/constants/Styles';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const Layout = () => {
	const theme = useSystemTheme();

	return (
		<KeyboardProvider>
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
						headerTintColor: Colors[theme].textPrimary,
						headerShadowVisible: false,
						headerShown: true,
						title: 'Create Article',
						headerTitle: () => <View></View>,
						headerRight: () => (
							<Link
								asChild
								href={{
									params: { contents: JSON.stringify(helpModalContent) },
									pathname: '/modals/help_modal',
								}}>
								<TouchableOpacity>
									<Ionicons
										name="help-circle-outline"
										size={defaultHeaderBtnSize}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</Link>
						),
					}}
				/>
				<Stack.Screen
					name="createPost"
					options={{
						headerTintColor: Colors[theme].textPrimary,
						headerShadowVisible: false,
						headerShown: true,
						title: 'Create Text/ Image',
						headerTitle: () => <View></View>,
						headerRight: () => (
							<Link
								asChild
								href={{
									params: { contents: JSON.stringify(helpModalContent) },
									pathname: '/modals/help_modal',
								}}>
								<TouchableOpacity>
									<Ionicons
										name="help-circle-outline"
										size={defaultHeaderBtnSize}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</Link>
						),
					}}
				/>
				<Stack.Screen
					name="createVideo"
					options={{
						headerTintColor: Colors[theme].textPrimary,
						headerShadowVisible: false,
						headerShown: true,
						headerTitle: () => <View></View>,
						headerRight: () => (
							<Link
								asChild
								href={{
									params: { contents: JSON.stringify(helpModalContent) },
									pathname: '/modals/help_modal',
								}}>
								<TouchableOpacity>
									<Ionicons
										name="help-circle-outline"
										size={defaultHeaderBtnSize}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</Link>
						),
					}}
				/>
			</Stack>
		</KeyboardProvider>
	);
};

const styles = StyleSheet.create({});

export default Layout;
