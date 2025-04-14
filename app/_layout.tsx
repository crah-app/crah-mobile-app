import { Text, TouchableOpacity, View } from 'react-native';
import React, { Component, useEffect } from 'react';
import {
	Link,
	Slot,
	SplashScreen,
	Stack,
	useRouter,
	useSegments,
} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import {
	ClerkProvider,
	ClerkLoaded,
	useAuth,
	SignedIn,
	SignedOut,
} from '@clerk/clerk-expo';
import { tokenCache } from '@/cache';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { dark } from '@clerk/themes';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
	initialRouteName: 'index',
};

const Root = () => {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const theme = useSystemTheme();
	const router = useRouter();

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			console.log('loaded', loaded);
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	useEffect(() => {
		if (!isLoaded) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (isSignedIn && !inAuthGroup) {
			router.replace('/(auth)/(tabs)/homePages');
		} else if (!isSignedIn) {
			router.replace('/');
		}
	}, [isSignedIn]);

	if (!loaded || !isLoaded) {
		return <Slot />;
	}

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: Colors[theme].surface,
				},
			}}>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="login"
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
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modals"
				options={{ headerShown: false, presentation: 'modal' }}
			/>
		</Stack>
	);
};

const layout = () => {
	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

	if (!publishableKey) {
		throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
	}

	return (
		<ClerkProvider
			appearance={{}}
			tokenCache={tokenCache!}
			publishableKey={publishableKey!}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<BottomSheetModalProvider>
					<Root />
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</ClerkProvider>
	);
};

export default layout;
