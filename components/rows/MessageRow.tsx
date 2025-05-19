import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { chatCostumMsgType, UserStatus } from '@/types';
import Row from '@/components/general/Row';
import SwipeableRow from '../general/SwipeableRow';
import FadeOutRowWrapper from '@/components/general/FadeOutRowWrapper';
import SlideRowWrapper from '../general/SlideRowWrapper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Animated, View } from 'react-native';

interface MessageRowProps {
	id: string;
	name: string;
	avatar: string;
	status: UserStatus;
	lastActive?: Date;
	handleOnDelete: () => void;
	handleOnArchive: () => void;
	slideRight: boolean;
	onCheckboxToggle?: (checked: boolean, id: string) => void;
	checked: boolean;
	unreadCount: number;
	lastMessageType: string;
	isTyping: boolean;
}

const MessageRow: React.FC<MessageRowProps> = ({
	id,
	name,
	avatar,
	status,
	lastActive,
	handleOnArchive,
	handleOnDelete,
	slideRight,
	onCheckboxToggle,
	checked,
	unreadCount,
	lastMessageType,
	isTyping,
}) => {
	const [isDeleted, setIsDeleted] = useState(false);
	const [isArchived, setIsArchived] = useState(false);
	const [highlightWords, setHighlightWords] = useState<string[]>([
		String(unreadCount),
		'new',
		'message',
		's',
		'ent',
		'rider',
		'trick',
		'Is',
		'typing',
		'...',
		'Online',
	]);

	const chatTimeAgo = lastActive
		? `last seen ${formatDistanceToNow(new Date(lastActive), {
				addSuffix: true,
		  })}`
		: '';

	const renderSubTitle = (): string => {
		if (isTyping) {
			return 'Is typing...';
		}

		if (unreadCount > 0) {
			switch (lastMessageType) {
				case 'text':
					return `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
				case 'rider':
					return unreadCount === 1
						? `sent rider`
						: `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
				case 'trick':
					return unreadCount === 1
						? `sent trick`
						: `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;

				default:
					return `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
			}
		}

		// fallback to online status or time
		if (status === UserStatus.OFFLINE && unreadCount <= 0) return chatTimeAgo;

		const [prefix] = status.split('o ');
		return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
	};

	const handleOnPress = () => {
		router.navigate({
			pathname: `/(auth)/(tabs)/homePages/chats/[id]`,
			params: { id },
		});
	};

	const handleOnLongPress = () => {
		console.log('object');
	};

	const opacityAnim = useRef(new Animated.Value(0)).current;
	const checkboxTranslateX = useRef(new Animated.Value(-60)).current;

	useEffect(() => {
		if (slideRight) {
			Animated.timing(checkboxTranslateX, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();

			Animated.timing(opacityAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(checkboxTranslateX, {
				toValue: -60,
				duration: 200,
				useNativeDriver: true,
			}).start();

			Animated.timing(opacityAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	}, [slideRight]);

	if (isDeleted || isArchived) {
		return (
			<FadeOutRowWrapper
				onFadeOutComplete={() =>
					isDeleted ? handleOnDelete() : handleOnArchive()
				}>
				<Row
					onLongPress={handleOnLongPress}
					onPress={handleOnPress}
					title={name}
					highlightWords={['online']}
					subtitle={
						status === UserStatus.OFFLINE
							? chatTimeAgo
							: status.split('o ')[0].charAt(0).toUpperCase() +
							  status.split('o ')[0].slice(1).toLowerCase()
					}
					showAvatar={true}
					avatarUrl={avatar}
				/>
			</FadeOutRowWrapper>
		);
	}

	return (
		<SwipeableRow onDelete={handleOnDelete} onArchive={handleOnArchive}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 12,
				}}>
				<Animated.View
					style={{
						opacity: opacityAnim,
						marginLeft: 10,
						transform: [{ translateX: checkboxTranslateX }],
					}}>
					<BouncyCheckbox
						isChecked={checked}
						size={25}
						fillColor="red"
						iconStyle={{ borderColor: 'red' }}
						innerIconStyle={{ borderWidth: 2 }}
						onPress={(isChecked: boolean) => {
							onCheckboxToggle?.(isChecked, String(id));
						}}
					/>
				</Animated.View>

				<SlideRowWrapper shouldSlide={slideRight}>
					<Row
						onPress={handleOnPress}
						title={name}
						highlightWords={highlightWords}
						subtitle={renderSubTitle()}
						showAvatar={true}
						avatarUrl={avatar}
					/>
				</SlideRowWrapper>
			</View>
		</SwipeableRow>
	);
};

export default MessageRow;
