import { useEffect, useState } from 'react';
import { fetchAdresses, Trick } from '@/types';
import { getCachedData, setCachedData } from '@/hooks/cache';

const CACHE_KEY = 'commonTricks';

export const useCommonTricks = () => {
	const [commonTricks, setCommonTricks] = useState<Trick[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				const cached = await getCachedData<Trick[]>(CACHE_KEY);
				if (cached) {
					setCommonTricks(cached);
					console.log('loaded common tricks from cache');
					return;
				}

				console.log('fetch common tricks');
				const res = await fetch(fetchAdresses.allTricks, {
					headers: { 'Cache-Control': 'no-cache' },
				});
				const data = await res.json();
				setCommonTricks(data);
				await setCachedData(CACHE_KEY, data);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { commonTricks, loading, error };
};
