import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { UserStatus } from '@/types';
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
}) => {
	const [isDeleted, setIsDeleted] = useState(false);
	const [isArchived, setIsArchived] = useState(false);
	const [highlightWords, setHighlightWords] = useState<string[]>(['online']);

	const chatTimeAgo = lastActive
		? `last seen ${formatDistanceToNow(new Date(lastActive), {
				addSuffix: true,
		  })}`
		: '';

	const renderSubTitle = (text?: string): string => {
		text =
			status === UserStatus.OFFLINE
				? chatTimeAgo
				: status.split('o ')[0].charAt(0).toUpperCase() +
				  status.split('o ')[0].slice(1).toLowerCase();

		// if (unreadCount > 0) {
		// 	text = `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
		// }

		return text;
	};

	const handleOnPress = () => {
		router.navigate(`/(auth)/(tabs)/homePages/chats/${id}`);
	};

	const opacityAnim = useRef(new Animated.Value(0)).current;
	const checkboxTranslateX = useRef(new Animated.Value(-60)).current; // Startwert für BouncyCheckbox hinter dem Row

	useEffect(() => {
		if (unreadCount > 0 && status === UserStatus.OFFLINE) {
			setHighlightWords([String(unreadCount), 'new', 'message', 's']);
		} else {
			setHighlightWords(['Online']);
		}
	}, [unreadCount]);

	useEffect(() => {
		if (slideRight) {
			// Wenn geslideRight wird, animiere den BouncyCheckbox in den sichtbaren Bereich
			Animated.timing(checkboxTranslateX, {
				toValue: 0, // Der BouncyCheckbox wird jetzt sichtbar hinter dem Row
				duration: 200,
				useNativeDriver: true,
			}).start();

			Animated.timing(opacityAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			// Wenn nicht geslideRight, setze den BouncyCheckbox wieder hinter den Row
			Animated.timing(checkboxTranslateX, {
				toValue: -60, // BouncyCheckbox bleibt hinter dem Row und ist unsichtbar
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
