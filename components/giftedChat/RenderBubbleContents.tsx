import Colors from '@/constants/Colors';
import {
	chatCostumMsgType,
	ChatMessage,
	LinkPreview,
	Rank,
	RankColors,
	RankColorsDark,
	urlRegex,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import {
	Bubble,
	BubbleProps,
	MessageVideoProps,
	SystemMessage,
	SystemMessageProps,
} from 'react-native-gifted-chat';
import { ReplyRow, RiderRow, TrickRow } from './UtilityMessageRow';
import { fetchLinkPreview } from '@/utils/globalFuncs';
import {
	ImageBackground,
	View,
	Image,
	Dimensions,
	StyleSheet,
	FlatList,
} from 'react-native';
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
import { useUser } from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import AuraUserProfile from '../AuraUserProfile';
import PostTypeButton from '../PostTypeButton';

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

// system msgs
export const RenderSystemMessage: React.FC<{
	props: SystemMessageProps<ChatMessage>;
	metadata: ChatMessage;
}> = ({ props, metadata }) => {
	const { user } = useUser();
	const theme = useSystemTheme();

	const otherUser = metadata.participants.find(
		(userobj) => userobj._id !== user?.id,
	);
	const otherUserId = otherUser?._id;
	const otherUserName = metadata.ChatName; // in group: Group Name; Normal Chat: name of other user
	const otherUserProfile = otherUser?.avatar;

	const navigateToProfile = () => {};

	const navigateToTrick = () => {};

	// in case of a user to user chat
	const RenderUserProfileCard = () => {
		return (
			<View
				style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					flex: 1,
					gap: 12,
					width: Dimensions.get('window').width,
				}}>
				{otherUserProfile && <AuraUserProfile rank={Rank.Legendary} />}
				<ThemedText
					style={[
						defaultStyles.biggerText,
						{ fontSize: 16, color: RankColors[Rank.Gold][0] },
					]}
					theme={theme}
					value={Rank.Gold}
				/>

				<ThemedText
					style={[
						defaultStyles.biggerText,
						{
							fontSize: 32,
						},
					]}
					theme={theme}
					value={`Im ${otherUserName as string}, what´s up`}
				/>

				<View
					style={{
						marginTop: 12,
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						paddingHorizontal: 12,
						gap: 12,
					}}>
					<ThemedText
						style={[
							defaultStyles.biggerText,
							{
								marginLeft: 12,
								fontSize: 16,
								textAlign: 'center',
								textAlignVertical: 'center',
							},
						]}
						theme={theme}
						value={`Top 5 best flat tricks`}
					/>

					<View
						style={{
							width: Dimensions.get('window').width,
							marginTop: 12,
						}}>
						<FlatList
							style={{
								gap: 8,
								width: Dimensions.get('window').width,
								flexDirection: 'row',
								flexWrap: 'wrap',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							keyExtractor={(item) => item}
							data={[
								'Buttercup',
								'Quint Whip',
								'Whip front whip',
								'bar bar bar',
								'quad heel cr',
							]}
							renderItem={({ item, index }) => (
								<PostTypeButton
									key={index}
									style={{
										backgroundColor: RankColorsDark[Rank.Gold][0],
										paddingVertical: 4,
										paddingHorizontal: 4,
										width: 120,
									}}
									fontStyle={{ fontSize: 14 }}
									val={item}
									click_action={navigateToTrick}
								/>
							)}
						/>
					</View>

					<View
						style={{
							flexDirection: 'row',
							marginTop: 32,
							alignItems: 'center',
							justifyContent: 'center',
							width: Dimensions.get('window').width,
						}}>
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`500 Followers`}
						/>

						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`-`}
						/>
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`50 Posts`}
						/>
					</View>
				</View>
			</View>
		);
	};

	// in case of a group chat
	const RenderGroupProfileCard = () => {
		return (
			<View
				style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					flex: 1,
					gap: 12,
					width: Dimensions.get('window').width,
				}}>
				{/* image */}
				{otherUserProfile && <AuraUserProfile rank={Rank.Bronze} />}
				{/*  */}

				{/* <ThemedText
					style={[
						defaultStyles.biggerText,
						{ fontSize: 16, color: RankColors[Rank.Gold][0] },
					]}
					theme={theme}
					value={Rank.Gold}
				/> */}

				{/* title */}
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<ThemedText
						style={[
							defaultStyles.biggerText,
							{
								fontSize: 32,
							},
						]}
						theme={theme}
						value={`This is`}
					/>
					<ThemedText
						style={[
							defaultStyles.biggerText,
							{
								fontSize: 32,
								color: Colors[theme].primary,
							},
						]}
						theme={theme}
						value={`This is FlatBoysOfficial`}
					/>
				</View>

				{/* group meta data */}
				<View
					style={{
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						paddingHorizontal: 12,
						gap: 12,
					}}>
					<View
						style={{
							flexDirection: 'row',
							marginTop: 18,
							alignItems: 'center',
							justifyContent: 'center',
							width: Dimensions.get('window').width,
						}}>
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`4 Members `}
						/>

						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`-`}
						/>
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{
									marginLeft: 12,
									fontSize: 16,
									textAlign: 'center',
									textAlignVertical: 'center',
								},
							]}
							theme={theme}
							value={`Since 4th January 2025`}
						/>
					</View>

					<View
						style={{
							width: Dimensions.get('window').width,
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 46,
						}}>
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{ color: Colors[theme].gray, fontSize: 17 },
							]}
							theme={theme}
							value={'no group description'}
						/>
					</View>
				</View>
			</View>
		);
	};

	if (props.currentMessage?._id === 'profile-card' && otherUser) {
		return (
			<View
				style={{
					height: 450,
				}}>
				{metadata.isGroup ? (
					<RenderGroupProfileCard />
				) : (
					<RenderUserProfileCard />
				)}
			</View>
		);
	}

	// Optional: default system message
	return <SystemMessage {...props} />;
};
