// hooks/usePushNotifications.ts
import { useEffect } from 'react';
import { useNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { useRouter } from 'expo-router';

export function usePushNotifications() {
	const router = useRouter();

	useEffect(() => {
		// Register Expo Push-Token
		registerForPushNotificationsAsync().then((token) => {
			console.log('Push-Token:', token);
			// Optional: Send token to server
		});

		// Listener für Notification-Tap
		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const data = response.notification.request.content.data;
				console.log('Notification-Tap:', data);

				// navigate to chatscreen via id
				if (data?.type === 'chat' && data?.chatId) {
					router.navigate({
						pathname: '../app/(auth)/(tabs)/homePages/chats/[id].tsx',
						params: { id: data?.chatId },
					});
				}
			},
		);

		return () => subscription.remove();
	}, [router]);
}
