import { useEffect, useState } from 'react';
import { CrahUser } from '@/types';
import ClerkUser from '@/types/clerk';

export default function useCrahUser(ClerkUser: ClerkUser | undefined | null) {
	const [user, setUser] = useState<CrahUser | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!ClerkUser?.id) return;

		const loadUser = async () => {
			try {
				const response = await fetch(
					`http://192.168.0.136:4000/api/users/${ClerkUser?.id}`,
				);
				const text = await response.text();

				if (!response.ok) {
					throw new Error(text);
				}

				const result = JSON.parse(text);
				setUser(result[0][0]);
			} catch (err) {
				console.warn('Error [useUser] hook', err);
				setError(err instanceof Error ? err : new Error(String(err)));
			}
		};

		loadUser();
	}, [ClerkUser?.id]);

	return { user, error };
}
