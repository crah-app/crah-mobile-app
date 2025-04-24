import Colors from '@/constants/Colors';
import { chatCostumMsgType, ChatMessage, LinkPreview, urlRegex } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import {
	Bubble,
	BubbleProps,
	MessageVideoProps,
} from 'react-native-gifted-chat';
import { RiderRow, TrickRow } from './UtilityMessageRow';
import { fetchLinkPreview } from '@/utils/globalFuncs';
import { ImageBackground, View } from 'react-native';

export const RenderBubble: React.FC<{
	props: BubbleProps<ChatMessage>;
}> = ({ props }) => {
	const theme = useSystemTheme();
	const msgType: chatCostumMsgType = props.currentMessage.type;

	console.log('object2', props.currentMessage);

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

export const CustomMessageView: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();
	const message = props.currentMessage;

	if (!message || !message.type) return null;

	switch (message.type) {
		case 'trick':
			const trickId = props.currentMessage.trickId;

			return <TrickRow trickId={trickId} />;

		case 'rider':
			const riderId = props.currentMessage.riderId;

			return <RiderRow riderId={riderId} />;

		default:
			return null;
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
