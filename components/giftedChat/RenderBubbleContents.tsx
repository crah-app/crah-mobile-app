import Colors from '@/constants/Colors';
import { chatCostumMsgType, ChatMessage, LinkPreview, urlRegex } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import {
	Bubble,
	BubbleProps,
	MessageVideoProps,
} from 'react-native-gifted-chat';
import { ReplyRow, RiderRow, TrickRow } from './UtilityMessageRow';
import { fetchLinkPreview } from '@/utils/globalFuncs';
import { ImageBackground, View } from 'react-native';
import { GiftedChatProps } from 'react-native-gifted-chat/lib/GiftedChat/types';
import TypingAnimation from 'react-native-typing-animation';
import ThemedText from '../general/ThemedText';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

export const RenderBubble: React.FC<{
	props: BubbleProps<ChatMessage>;
}> = ({ props }) => {
	const theme = useSystemTheme();
	const msgType: chatCostumMsgType = props.currentMessage.type;

	const renderTextColor = (): string => {
		if (typeof props.currentMessage.video === 'string' && msgType === 'text') {
			return 'white';
		}

		if (msgType === 'rider' || msgType === 'trick') {
			return Colors[theme].textPrimary;
		}

		return 'white';
	};

	const renderBackgroundColorRight = (): string => {
		if (typeof props.currentMessage.video === 'string' && msgType === 'text') {
			return Colors[theme].textBubbleOther;
		}

		if (msgType === 'text') {
			return Colors[theme].textBubbleOwn;
		}

		if (msgType === 'rider' || msgType === 'trick') {
			return Colors[theme].container_surface;
		}

		return Colors[theme].textBubbleOwn;
	};

	const renderBackgroundColorLeft = (): string => {
		if (typeof props.currentMessage.video === 'string' && msgType === 'text') {
			return theme === 'dark'
				? Colors[theme].textBubbleOther
				: 'rgb(210, 210, 210)';
		}

		if (msgType === 'text') {
			return Colors[theme].textBubbleOther;
		}

		if (msgType === 'rider' || msgType === 'trick') {
			return Colors[theme].container_surface;
		}

		return Colors[theme].textBubbleOther;
	};

	return (
		<Bubble
			containerStyle={{ left: { margin: 2 }, right: { margin: 2 } }}
			{...props}
			wrapperStyle={{
				right: {
					backgroundColor: renderBackgroundColorRight(),
				},
				left: {
					backgroundColor: renderBackgroundColorLeft(),
				},
			}}
			textStyle={{
				right: { color: renderTextColor() },
				left: { color: renderTextColor() },
			}}
		/>
	);
};

export const CustomMessageView: React.FC<{
	props: BubbleProps<ChatMessage>;
	chatId: string;
}> = ({ props, chatId }) => {
	const theme = useSystemTheme();
	const message: ChatMessage = props.currentMessage;
	// @ts-ignore
	const messageIsReply = message.isReply === 1 || message.isReply;
	const riderId = props.currentMessage.riderId;
	const trickId = props.currentMessage.trickId;

	if (!message || !message.type) return null;

	if (messageIsReply) {
		return (
			<View>
				<ReplyRow
					position={props.position}
					chatId={chatId}
					messageId={message._id}
					replyToMessageId={message.replyToMessageId}
				/>

				{message.type === 'rider' ? (
					<RiderRow riderId={riderId} />
				) : message.type === 'trick' ? (
					<TrickRow trickId={trickId} />
				) : (
					<></>
				)}
			</View>
		);
	}

	switch (message.type) {
		case 'trick':
			return <TrickRow trickId={trickId} />;

		case 'rider':
			return <RiderRow riderId={riderId} />;

		default:
			break;
	}
};

export const RenderMessageVideo: React.FC<{
	props: MessageVideoProps<ChatMessage>;
}> = ({ props }) => {
	const [previewData, setPreviewData] = useState<LinkPreview>();
	const internetLinks: RegExpMatchArray | [] =
		props.currentMessage.text?.match(urlRegex) ?? [];
	const isInternetLink: boolean = internetLinks.length > 0;

	useEffect(() => {
		if (isInternetLink && !previewData) {
			fetchLinkPreview(internetLinks[0]).then((data: LinkPreview) => {
				setPreviewData(data);
			});
		}
	}, [internetLinks]);

	if (
		props.currentMessage.type === 'rider' ||
		props.currentMessage.type === 'trick'
	) {
		return <View></View>;
	}

	return (
		<View>
			{previewData && (
				<ImageBackground
					source={{ uri: previewData.images[0] }}
					style={{
						width: '100%',
						height: 150,
					}}
					resizeMode="cover"
				/>
			)}
		</View>
	);
};

export const TypingIndicator: React.FC<{ display: boolean }> = ({
	display,
}) => {
	const theme = useSystemTheme();
	const opacity = useSharedValue(display ? 1 : 0);
	const margin = useSharedValue(display ? 4 : 0);
	const padding = useSharedValue(display ? 4 : 0);

	useEffect(() => {
		opacity.value = withRepeat(
			withTiming(0.5, { duration: 600, easing: Easing.linear }),
			-1,
			true,
		);

		margin.value = withRepeat(
			withTiming(0.5, { duration: 600, easing: Easing.linear }),
			-1,
			true,
		);

		padding.value = withRepeat(
			withTiming(0.5, { duration: 600, easing: Easing.linear }),
			-1,
			true,
		);
	}, []);

	useEffect(() => {
		opacity.value = withTiming(display ? 1 : 0, { duration: 200 });
		margin.value = withTiming(display ? 4 : 0, { duration: 200 });
		padding.value = withTiming(display ? 4 : 0, { duration: 200 });
	}, [display]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			margin: margin.value,
			padding: padding.value,
		};
	});

	return (
		<Animated.View
			style={[
				{
					backgroundColor: Colors[theme].surface,
					padding: 4,
					borderRadius: 8,
					width: 90,
					justifyContent: 'center',
					alignItems: 'center',
				},
				animatedStyle,
			]}>
			<ThemedText
				style={{ fontWeight: '700' }}
				theme={theme}
				value={'is typing...'}
			/>
		</Animated.View>
	);
};
