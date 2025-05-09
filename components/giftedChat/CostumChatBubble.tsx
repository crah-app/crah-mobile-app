import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Message, MessageProps, IMessage } from 'react-native-gifted-chat';
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import {
	ChatFooterBarTypes,
	ChatMessage,
	selectedRiderInterface,
	selectedTrickInterface,
} from '@/types';
import { mmkv } from '@/hooks/mmkv';

type ChatMessageBoxProps = {
	setReplyOnSwipeOpen: (message: ChatMessage) => void;
	updateRowRef: (ref: any) => void;
	setDisplayFooter: (b: boolean) => void;
	setAttachedMessageType: (t: ChatFooterBarTypes | undefined) => void;
	setSelectedRiderData: (u: selectedRiderInterface | undefined) => void;
	setSelectedTrickData: (u: selectedTrickInterface | undefined) => void;
	setSelectedVideo: (source: string | undefined) => void;
	setSelectedImage: (source: string | undefined) => void;
} & MessageProps<IMessage>;

const ChatMessageBox = ({
	setReplyOnSwipeOpen,
	updateRowRef,
	setDisplayFooter,
	setAttachedMessageType,
	setSelectedImage,
	setSelectedRiderData,
	setSelectedTrickData,
	setSelectedVideo,
	...props
}: ChatMessageBoxProps) => {
	const theme = useSystemTheme();

	const isNextMyMessage =
		props.currentMessage &&
		props.nextMessage &&
		isSameUser(props.currentMessage, props.nextMessage) &&
		isSameDay(props.currentMessage, props.nextMessage);

	const translateX = useSharedValue(0);

	const onSwipeOpenAction = () => {
		if (props.currentMessage) {
			setDisplayFooter(true);
			setAttachedMessageType('Reply');
			// @ts-ignore
			setReplyOnSwipeOpen({ ...props.currentMessage });

			renderMessageContent();
		}
	};

	// if message type of message user wants to reply to is from another type than plain text

	const renderMessageContent = () => {
		// @ts-ignore
		switch (props.currentMessage.type) {
			case 'trick':
				const trick = JSON.parse(
					// @ts-ignore
					mmkv.getString(`trick_${props.currentMessage.trickId}`) || '{}',
				);

				// @ts-ignore
				setSelectedTrickData(trick);
				break;

			case 'rider':
				const rider = JSON.parse(
					// @ts-ignore
					mmkv.getString(`rider_${props.currentMessage.riderId}`),
				);

				setSelectedRiderData(rider);
				break;
		}
	};

	const triggerHaptic = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const gestureHandler = useAnimatedGestureHandler({
		onStart: (_, ctx: any) => {
			ctx.startX = translateX.value;
		},
		onActive: (event, ctx) => {
			translateX.value = ctx.startX + event.translationX;
		},
		onEnd: () => {
			if (translateX.value > 15) {
				translateX.value = withSpring(0, { stiffness: 100, damping: 120 });
				runOnJS(onSwipeOpenAction)();
				runOnJS(triggerHaptic)();
			} else {
				translateX.value = withSpring(0, { stiffness: 100, damping: 120 });
			}
		},
	});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	return (
		<PanGestureHandler onGestureEvent={gestureHandler}>
			<Animated.View style={animatedStyle}>
				<View style={styles.iconWrapper}>
					<MaterialCommunityIcons
						name="reply-circle"
						size={26}
						color={Colors[theme].gray}
					/>
				</View>
				<Message {...props} />
			</Animated.View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	iconWrapper: {
		position: 'absolute',
		left: -36,
		top: '50%',
		transform: [{ translateY: -13 }],
	},
});

export default ChatMessageBox;
