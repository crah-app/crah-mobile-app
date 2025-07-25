import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
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
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Appearance } from 'react-native';
import { mmkv } from '@/hooks/mmkv';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { createNotifications } from 'react-native-notificated';

const { NotificationsProvider, useNotifications, ...events } =
	createNotifications({
		defaultStylesSettings: {
			darkMode: true,
			globalConfig: {
				borderType: 'accent',
				bgColor: Colors.default.background2,
				titleColor: Colors.default.primary,
				descriptionColor: Colors.default.textPrimary,
				accentColor: Colors.default.primary,
				defaultIconType: 'no-icon',
			},
			successConfig: {},
			errorConfig: {},
			warningConfig: {},
			infoConfig: {},
		},
	});

Appearance.setColorScheme('dark');
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

	const SignedInOnce = mmkv.getBoolean('userSignedInOnce');

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
		if (!isLoaded || !loaded) return;

		const inAuthGroup = segments[0] === '(auth)';

		if (isSignedIn && !inAuthGroup) {
			// if this is the users first time signing in. He has to initialize a profile
			// ALl values he defines he can change in his profile settings
			if (!SignedInOnce) {
				router.replace('/createProfile');
				return;
			}

			router.replace('/(auth)/(tabs)/homePages');
			// router.replace('/(auth)/modals/compareRiders');
		} else if (!isSignedIn) {
			router.replace('/');
		}
	}, [isSignedIn, loaded, isLoaded]);

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
			<StatusBar backgroundColor={Colors[theme].background} />

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
					headerShown: false,
				}}
			/>
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modals"
				options={{ headerShown: false, presentation: 'modal' }}
			/>
			<Stack.Screen
				name="createProfile"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
};

const layout = () => {
	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
	const theme = useSystemTheme();

	if (!publishableKey) {
		throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
	}

	const MyTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: Colors[theme].primary,
			background: Colors[theme].background,
			text: Colors[theme].textPrimary,
			card: Colors[theme].surface,
			border: Colors[theme].borderColor,
			notification: Colors[theme].primary,
		},
	};

	//   const navigationRef = useNavigationContainerRef();

	//   useEffect(() => {
	//     // Expo Push-Token registrieren
	//     registerForPushNotificationsAsync().then(token => {
	//       console.log('Push-Token:', token);
	//       // Optional: an deinen Server schicken
	//     });

	//     // Listener für Notification-Tap
	//     const subscription = Notifications.addNotificationResponseReceivedListener(response => {
	//       const data = response.notification.request.content.data;
	//       console.log('Notification-Tap:', data);

	//       // Beispiel: Navigiere zu ChatScreen mit chatId
	//       if (data?.type === 'chat' && data?.chatId) {
	//         navigationRef.navigate('ChatScreen', { chatId: data.chatId });
	//       }
	//     });

	//     return () => subscription.remove();
	//   }, []);

	return (
		<KeyboardProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<NotificationsProvider>
					<ClerkProvider
						appearance={{}}
						tokenCache={tokenCache!}
						publishableKey={publishableKey!}>
						<BottomSheetModalProvider>
							<Root />
						</BottomSheetModalProvider>
					</ClerkProvider>
				</NotificationsProvider>
			</GestureHandlerRootView>
		</KeyboardProvider>
	);
};

export default layout;
