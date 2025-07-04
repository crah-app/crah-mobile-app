import { ChatMessage, errType, TrickDifficulty } from '@/types';
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
import { mmkv } from '@/hooks/mmkv';
import { View, Text } from 'react-native';
import { RenderRider, RenderTrick } from './MessageAttachments';

// costum message bubble view for a sended rider
export const RiderRow: React.FC<{ riderId: string }> = ({ riderId }) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [fetchedRider, setFetchedRider] = useState<ClerkUser>();
	const [riderLoaded, setRiderLoaded] = useState<boolean>();
	const [error, setError] = useState<errType>();

	useEffect(() => {
		const fetchRider = async () => {
			const cacheKey = `rider_${riderId}`;

			const cache = mmkv.getString(cacheKey);
			// if (cache) {
			// 	setFetchedRider(JSON.parse(cache));
			// 	setRiderLoaded(true);
			// 	return;
			// }

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

				mmkv.set(
					cacheKey,
					JSON.stringify({
						name: data.username,
						_id: data.id,
						avatar: data.imageUrl,
						// @ts-ignore
						rank: data.rank ?? 'Diamond',
						// @ts-ignore
						rankPosition: data.rankPosition ?? 3,
					}),
				);
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

// costum message bubble view for a sended trick
export const TrickRow: React.FC<{ trickId: string }> = ({ trickId }) => {
	const theme = useSystemTheme();
	const [fetchedTrick, setFetchedTrick] = useState<any>();
	const [trickLoaded, setTrickLoaded] = useState(false);
	const [error, setError] = useState<errType>();

	useEffect(() => {
		const fetchTrick = async () => {
			setTrickLoaded(false);
			setError(undefined);

			const cacheKey = `trick_${trickId}`;

			// Check cache first
			const cached = mmkv.getString(cacheKey);
			// if (cached) {
			// 	setFetchedTrick(JSON.parse(cached));
			// 	setTrickLoaded(true);
			// 	return;
			// }

			try {
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
				const trick = data.commonTricks[trickId];

				setFetchedTrick(trick);
				mmkv.set(
					cacheKey,
					JSON.stringify({
						id: trickId,
						name: getTrickTitle(trick),
						difficulty: TrickDifficulty.GOATED,
						costum: false,
					}),
				); // Cache it
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
				trickName: getTrickTitle(fetchedTrick),
				trickId: trickId,
				trickDescription: 'lel',
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

// costum reply view to message chat bubble to render message the user replied to
export const ReplyRow: React.FC<{
	position: 'right' | 'left'; // is the chat message from current user or other user
	chatId: string;
	messageId: string;
	replyToMessageId: string | undefined;
}> = ({ position, chatId, messageId, replyToMessageId }) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const cache: ChatMessage[] = JSON.parse(
		mmkv.getString(`msgs_${chatId}`) ?? '{}',
	);

	// message the user wants to reply to
	const cachedMessage: ChatMessage | undefined = cache.find(
		(msg) => msg._id === replyToMessageId,
	);

	const replyToMessageTrickId = cachedMessage?.trickId;
	const replyToMessageRiderId = cachedMessage?.riderId;

	let cachedMessageSenderName: string | undefined = cachedMessage?.user.name;

	// trick- and riderId from message the user wants to reply to
	const cachedTrick = JSON.parse(
		mmkv.getString(`trick_${replyToMessageTrickId}`) ?? '{}',
	);
	const cachedRider = JSON.parse(
		mmkv.getString(`rider_${replyToMessageRiderId}`) ?? '{}',
	);

	if (cachedMessage?.user.name === user?.username) {
		cachedMessageSenderName = 'You';
	}

	return (
		<View
			style={{
				paddingBottom: 2,
			}}>
			<View style={{ flexDirection: 'column' }}>
				<Text
					style={{
						color: Colors[theme].textSecondary,
						paddingHorizontal: 10,
						paddingTop: 5,
						fontWeight: '600',
						fontSize: 14,
					}}>
					{cachedMessageSenderName}
				</Text>
				{/* render message text */}
				{cachedMessage?.text && cachedMessage.type === 'text' && (
					<Text
						style={{
							color: Colors[theme].textSecondary,
							paddingHorizontal: 10,
							fontSize: 13,
							fontWeight: '500',
						}}>
						{cachedMessage.text.length > 20
							? cachedMessage?.text.substring(0, 20) + '...'
							: cachedMessage?.text}
					</Text>
				)}

				{/* render other content if it is not a text message */}
				<View>
					{cachedMessage?.type === 'rider' ? (
						<RenderRider
							position={position}
							asMessageBubble
							riderData={cachedRider}
						/>
					) : cachedMessage?.type === 'trick' ? (
						<RenderTrick
							position={position}
							asMessageBubble
							trickData={cachedTrick}
						/>
					) : (
						<></>
					)}
				</View>
			</View>
		</View>
	);
};
