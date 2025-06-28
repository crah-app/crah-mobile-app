import { InboxNotification } from '@/types';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';

export const useInboxNotifications = () => {
	const { getToken } = useAuth();

	const [notifications, setNotifications] = useState<InboxNotification[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		let isMounted = true;

		const fetchNotifications = async () => {
			try {
				const token = await getToken();

				if (!token) {
					throw new Error('No auth token');
				}

				setLoading(true);
				setError(null);

				const response = await fetch(
					'http://192.168.0.136:4000/api/notifications',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error(`Server error: ${response.status}`);
				}

				const data = await response.json();

				if (isMounted) {
					setNotifications((prev) => {
						const same =
							JSON.stringify(prev) === JSON.stringify(data.notifications);
						return same ? prev : data.notifications;
					});
					setLoading(false);
				}
			} catch (error) {
				if (isMounted) {
					setError(error as Error);
					setLoading(false);
				}
			}
		};

		fetchNotifications();

		return () => {
			isMounted = false;
		};
	}, [getToken]);

	return {
		notifications,
		count: notifications.length,
		loading,
		error,
	};
};
