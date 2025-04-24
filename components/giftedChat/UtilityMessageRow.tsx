import { errType } from '@/types';
import ClerkUser from '@/types/clerk';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import Row from '../general/Row';
import Colors from '@/constants/Colors';
import React from 'react';
import { getTrickTitle } from '@/utils/globalFuncs';

import Scooter from '../../assets/images/vectors/scooter.svg';

export const RiderRow: React.FC<{ riderId: string }> = ({ riderId }) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [fetchedRider, setFetchedRider] = useState<ClerkUser>();
	const [riderLoaded, setRiderLoaded] = useState<boolean>();
	const [error, setError] = useState<errType>();

	useEffect(() => {
		const fetchRider = async () => {
			try {
				setError(undefined);
				setRiderLoaded(false);

				const res = await fetch(
					`http://192.168.0.136:4000/api/users/${riderId}`,
					{
						headers: { 'Cache-Control': 'no-cache' },
					},
				);

				if (!res.ok) {
					setError('not found');
					return;
				}

				const data = await res.json();
				setFetchedRider(data);
			} catch (err) {
				setError('not found');
			} finally {
				setRiderLoaded(true);
			}
		};

		fetchRider();
	}, [riderId]);

	const handleRiderPress = () => {
		router.push({
			pathname: '/(auth)/sharedPages/userProfile',
			params: {
				userId: riderId,
				self: riderId !== user?.id ? 'false' : 'true',
				linking: 'true',
			},
		});
	};

	return (
		<Row
			key={riderId}
			containerStyle={{
				backgroundColor: Colors[theme].container_surface,
				borderRadius: 12,
				width: 250,
			}}
			title={
				!riderLoaded
					? 'loading rider'
					: fetchedRider?.username ?? 'Error loading rider'
			}
			subtitle="rank silver #3"
			avatarUrl={fetchedRider?.imageUrl}
			onPress={handleRiderPress}
		/>
	);
};

export const TrickRow: React.FC<{ trickId: number }> = ({ trickId }) => {
	const theme = useSystemTheme();
	const [fetchedTrick, setFetchedTrick] = useState<any>();
	const [trickLoaded, setTrickLoaded] = useState(false);
	const [error, setError] = useState<errType>();

	useEffect(() => {
		const fetchTrick = async () => {
			try {
				setError(undefined);
				setTrickLoaded(false);

				const res = await fetch(
					`http://192.168.0.136:4000/public/tricks/commonTricks.json`,
					{
						headers: { 'Cache-Control': 'no-cache' },
					},
				);

				if (!res.ok) {
					setError('not found');
					return;
				}

				const data = await res.json();
				setFetchedTrick(data.commonTricks[trickId]);
			} catch (err) {
				setError('not found');
			} finally {
				setTrickLoaded(true);
			}
		};

		fetchTrick();
	}, [trickId]);

	const handleTrickPress = () => {
		router.push({
			pathname: '/modals/TrickModal',
			params: {
				data: JSON.stringify({
					trickName: getTrickTitle(fetchedTrick),
					trickDescription: 'lel',
				}),
			},
		});
	};

	return (
		<Row
			key={trickId}
			avatarIsSVG
			showAvatar
			avatarUrl={Scooter}
			costumAvatarHeight={34}
			costumAvatarWidth={38}
			containerStyle={{
				backgroundColor: Colors[theme].container_surface,
				borderRadius: 12,
				width: 250,
			}}
			subtitle={'loluis'}
			title={!trickLoaded ? 'loading trick' : getTrickTitle(fetchedTrick)}
			onPress={handleTrickPress}
		/>
	);
};
