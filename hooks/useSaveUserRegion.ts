// hooks/useSaveUserRegion.ts
import { useEffect, useState } from 'react';
import { mmkv } from './mmkv';
import { useAuth } from '@clerk/clerk-expo';

type RegionData = {
	region: string | null;
	country: string | null;
};

export const useSaveUserRegion = (userId: string | null | undefined) => {
	const { getToken } = useAuth();

	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [error, setError] = useState<Error | null>(null);
	const [regionData, setRegionData] = useState<RegionData>({
		region: null,
		country: null,
	});

	useEffect(() => {
		const saveRegionIfNeeded = async () => {
			try {
				const token = await getToken();

				const alreadySaved = mmkv.getBoolean('@region_saved');

				if (alreadySaved) {
					console.log('Region already saved — reading from mmkv...');
					const region = mmkv.getString('@region_value') || null;
					const country = mmkv.getString('@country_value') || null;
					setRegionData({ region, country });
					setStatus('success');
					return;
				}

				if (!userId) {
					console.warn('No userId given — skipping region save.');
					return;
				}

				setStatus('loading');

				// get region
				const response = await fetch(
					'https://ipinfo.io/json?token=<YOUR_IPINFO_TOKEN>',
				);
				const data = await response.json();

				const region = data.region || 'Unknown';
				const country = data.country || 'Unknown';

				console.log(`Fetched region: ${region}, country: ${country}`);

				// fetch to backend
				const saveResponse = await fetch(
					'http://192.168.0.136:4000/api/users/region',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ userId, region, country }),
					},
				);

				if (!saveResponse.ok) {
					throw new Error(`Server error: ${saveResponse.status}`);
				}

				// mark as saved
				mmkv.set('@region_saved', true);
				mmkv.set('@region_value', region);
				mmkv.set('@country_value', country);

				setRegionData({ region, country });
				setStatus('success');
			} catch (err: any) {
				console.error('Error saving region:', err);
				setError(err);
				setStatus('error');
			}
		};

		saveRegionIfNeeded();
	}, [userId]);

	return {
		status,
		error,
		region: regionData.region,
		country: regionData.country,
	};
};
