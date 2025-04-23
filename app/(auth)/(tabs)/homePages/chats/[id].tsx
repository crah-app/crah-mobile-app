import React, {
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useLayoutEffect,
} from 'react';
import {
	Bubble,
	Composer,
	GiftedChat,
	IMessage,
	InputToolbar,
	LeftRightStyle,
	MessageProps,
	RenderMessageTextProps,
	SystemMessage,
	User,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import {
	TouchableOpacity,
	View,
	Image,
	Text,
	StyleSheet,
	ImageBackground,
	Platform,
	ImageSourcePropType,
	InteractionManager,
	KeyboardAvoidingView,
	ActivityIndicator,
	Linking,
	ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	router,
	Stack,
	useLocalSearchParams,
	useNavigation,
} from 'expo-router';
import { QuickReplies } from 'react-native-gifted-chat/lib/QuickReplies';

import { useUser } from '@clerk/clerk-expo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import RenderFetchedData from '@/components/RenderFetchedData';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import ThemedText from '@/components/general/ThemedText';
import { chatCostumMsgType, CrahUser, errType, LinkPreview } from '@/types';
import Row from '@/components/general/Row';
import ClerkUser from '@/types/clerk';

import Scooter from '../../../../../assets/images/vectors/scooter.svg';
import { getTrickTitle } from '@/utils/globalFuncs';

export interface ChatMessage extends IMessage {
	_id: string;
	isGroup: boolean;
	ChatId: string;
	ChatName: string;
	ChatAvatar: string | null;
	user: {
		_id: string;
		name: string;
		avatar: string;
	};
	text: string;
	createdAt: Date;
	participants: User[];
}

const ChatScreen = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom, top } = useSafeAreaInsets();
	const { id } = useLocalSearchParams();

	// states
	const [text, setText] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messagesLoaded, setMessagesLoaded] = useState<boolean>();
	const [errLoadingMessages, setErrLoadingMessages] = useState<boolean>();
	const [userWantsToGoBack, setUserWantsToGoBack] = useState<boolean>(false);

	const [isGroup, setIsGroup] = useState<boolean>();
	const [chatTitle, setChatTitle] = useState<string>('');

	// send message
	const onSend = useCallback((newMessages: ChatMessage[] = []) => {
		if (!messages) return;

		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, newMessages),
		);

		console.log(messages, messages[0]);
	}, []);

	// fetch data
	const fetchMessages = async () => {
		setErrLoadingMessages(false);
		setMessagesLoaded(false);

		fetch(`http://192.168.0.136:4000/api/chats/messages/${id}/${user?.id}`, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res: ChatMessage[]) => {
				setMessages(
					res.splice(0, res.length - 2).map((msg) => {
						msg.createdAt = new Date(msg.createdAt);
						return msg;
					}),
				);
				setFetchedData(res);
			})
			.catch((err) => setErrLoadingMessages(true))
			.finally(() => setMessagesLoaded(true));
	};

	const setFetchedData = (data: ChatMessage[]) => {
		setIsGroup(data[0].isGroup);
		setChatTitle(data[data.length - 1].ChatName);
	};

	useEffect(() => {
		fetchMessages();

		return () => {};
	}, []);

	return (
		<ThemedView theme={theme} flex={1} style={{}}>
			{/* chat header */}
			<Stack.Screen
				options={{
					headerBlurEffect: 'regular',
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerTitleStyle: {
						color: Colors[theme].textPrimary,
					},
					headerShadowVisible: false,
					headerShown: true,
					headerRight: () => (
						<View style={styles.headerRight}>
							{/* video call btn */}
							<TouchableOpacity onPress={() => console.log('Video Call')}>
								<Ionicons
									name="videocam-outline"
									size={26}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>

							{/* call btn */}
							<TouchableOpacity onPress={() => console.log('Call')} style={{}}>
								<Ionicons
									name="call-outline"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							{/*  */}
						</View>
					),

					headerLeft: () => (
						<View style={{}}>
							{/* navigate back btn */}
							<TouchableOpacity onPress={router.back} style={styles.headerLeft}>
								<Ionicons
									name="chevron-back-outline"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</View>
					),

					headerTitle: () => (
						<View style={[styles.headerCenter]}>
							<Image
								source={{
									uri: 'https://randomuser.me/api/portraits/men/32.jpg',
								}}
								style={styles.profilePic}
							/>
							<View style={styles.headerText}>
								{!messagesLoaded ? (
									<Text
										style={[
											styles.userName,
											{ color: Colors[theme].textPrimary },
										]}>
										Lade...
									</Text>
								) : errLoadingMessages ? (
									<Text style={[styles.userName, { color: 'red' }]}>Error</Text>
								) : (
									<Text
										style={[
											styles.userName,
											{ color: Colors[theme].textPrimary },
										]}>
										{chatTitle}
									</Text>
								)}

								<Text
									style={[
										styles.userStatus,
										{
											color: user?.lastSignInAt
												? Colors[theme].primary
												: 'gray',
										},
									]}>
									{user?.lastSignInAt ? 'Online' : 'Offline'}
								</Text>
							</View>
						</View>
					),
				}}
			/>

			{/* GiftedChat */}
			<ImageBackground style={{ flex: 1, paddingBottom: bottom }}>
				<RenderFetchedData
					errState={errLoadingMessages}
					loadedState={messagesLoaded}
					activityIndicatorColor={Colors[theme].primary}
					activityIndicatorSize={24}
					clientErrorTitle="Something went wrong..."
					clientErrorSubTitle="May try again?"
					renderComponent={
						<View style={{ flex: 1 }}>
							<GiftedChat
								isKeyboardInternallyHandled={true}
								renderAvatar={null}
								messages={messages}
								onSend={(messages) => onSend(messages)}
								user={{
									_id: 'user_2vlanCL8M2qebrHnMGQgqdfz7Wo', // chat id
								}}
								onInputTextChanged={setText}
								// centered system messages
								renderSystemMessage={(props) => (
									<SystemMessage
										{...props}
										textStyle={{ color: Colors[theme].textSecondary }}
									/>
								)}
								// left action: add btn
								renderActions={(props) => (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											height: 44,
										}}>
										<RenderRightInputButton props={props} />
									</View>
								)}
								// right btn: send
								renderSend={(props) => (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											height: 44,
										}}>
										{text.length > 0 ? (
											<RenderSendText props={props} />
										) : (
											<RenderSendEmptyText props={props} />
										)}
									</View>
								)}
								// centered text input
								textInputProps={[styles.composer]}
								renderBubble={(props) => <RenderBubble props={props} />}
								listViewProps={{
									// @ts-ignore
									keyboardShouldPersistTaps: 'handled',
									keyboardDismissMode:
										Platform.OS === 'ios' ? 'interactive' : 'on-drag',
								}}
								renderInputToolbar={(props) => (
									<InputToolbar
										{...props}
										containerStyle={{
											backgroundColor: Colors[theme].surface,
											marginTop: 12,
										}}
									/>
								)}
								renderQuickReplies={(props) => (
									<QuickReplies color={Colors[theme].primary} {...props} />
								)}
								renderComposer={(props) => (
									<Composer
										{...props}
										textInputStyle={{ color: Colors[theme].textPrimary }}
									/>
								)}
								focusOnInputWhenOpeningKeyboard={true}
								renderMessageVideo={(props) => (
									<LinkMessageBubble props={props} />
								)}
								isTyping={false}
								renderCustomView={(props) => (
									<CustomMessageView props={props} />
								)}
							/>
							{Platform.OS === 'android' && (
								<KeyboardAvoidingView behavior="padding" />
							)}
						</View>
					}
				/>
			</ImageBackground>
		</ThemedView>
	);
};

const RenderSendEmptyText: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}>
			<TouchableOpacity
				onPress={() => {
					console.log('camera pressed');
				}}>
				<View>
					<Ionicons
						name="camera-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					console.log('mic pressed');
				}}>
				<View>
					<Ionicons
						name="mic-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const RenderSendText: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			onPress={() => {
				if (props.text && props.text.trim()) {
					props.onSend({ text: props.text.trim() }, true);
				}
			}}
			style={{ paddingHorizontal: 14 }}>
			<Ionicons
				name="send-outline"
				size={24}
				color={Colors[theme].textPrimary}
			/>
		</TouchableOpacity>
	);
};

const RenderRightInputButton: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			onPress={() => console.log('Plus pressed')}
			style={{ paddingHorizontal: 10 }}>
			<Ionicons
				name="add-outline"
				size={24}
				color={Colors[theme].textPrimary}
			/>
		</TouchableOpacity>
	);
};

const CustomMessageView: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();
	const message = props.currentMessage;

	if (!message || !message.type) return null;

	switch (message.type) {
		// case 'link-preview':
		// 	return (
		// 		<View style={{ padding: 10 }}>
		// 			<TouchableOpacity
		// 				onPress={() => Linking.openURL(message.text)}
		// 				style={{ borderRadius: 10, overflow: 'hidden' }}>
		// 				<Image
		// 					source={{ uri: message.previewImage }}
		// 					style={{ width: 250, height: 130 }}
		// 					resizeMode="cover"
		// 				/>
		// 				<Text style={{ color: Colors[theme].primary, paddingTop: 6 }}>
		// 					{message.text}
		// 				</Text>
		// 			</TouchableOpacity>
		// 		</View>
		// 	);

		case 'trick':
			const trickId = props.currentMessage.trickId;

			return <TrickRow trickId={trickId} />;

		case 'rider':
			const riderId = props.currentMessage.riderId;

			return <RiderRow riderId="user_2vlanCL8M2qebrHnMGQgqdfz7Wo" />;

		default:
			return null;
	}
};

const RiderRow: React.FC<{ riderId: string }> = ({ riderId }) => {
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

const TrickRow: React.FC<{ trickId: number }> = ({ trickId }) => {
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
			subtitle="costum trick"
			title={!trickLoaded ? 'loading trick' : getTrickTitle(fetchedTrick)}
			onPress={handleTrickPress}
		/>
	);
};

const RenderBubble: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();
	const msgType: chatCostumMsgType = props.currentMessage.type;

	return (
		<Bubble
			{...props}
			wrapperStyle={{
				right: [
					{
						backgroundColor:
							msgType !== 'text'
								? Colors[theme].container_surface
								: Colors[theme].textBubbleOwn,
					},
				],
				left: [
					{
						backgroundColor:
							msgType !== 'text'
								? Colors[theme].container_surface
								: Colors[theme].textBubbleOther,
					},
				],
			}}
			textStyle={{
				right: { color: Colors[theme].textPrimary },
				left: { color: Colors[theme].textPrimary },
			}}
		/>
	);
};

const urlRegex = /(https?:\/\/[^\s]+)/g;

const LinkMessageBubble: React.FC<{ props: any }> = ({ props }) => {
	const { currentMessage } = props;
	const messageText = currentMessage?.text ?? '';
	const videoUrl = currentMessage?.video;
	const internetLinks = videoUrl?.match(urlRegex);
	const isInternetLink = Boolean(internetLinks.length > 0);
	const theme = useSystemTheme();

	const [previewData, setPreviewData] = useState<LinkPreview>();

	// const player = useVideoPlayer(videoUrl, (player) => {
	// 	player.loop = true;
	// 	player.play();
	// });

	// useEvent(player, 'playingChange', {
	// 	isPlaying: player.playing,
	// });

	// useEffect(() => {
	// 	if (isInternetLink) {
	// 		fetchLinkPreview(internetLinks[0]).then((previewData: LinkPreview) => {
	// 			setPreviewData(previewData);
	// 		});
	// 	}
	// }, [internetLinks]);

	const handleLinkPress = async (url: string) => {
		console.log(url);
		const canOpen = await Linking.canOpenURL(url);
		if (canOpen) {
			Linking.openURL('https://www.youtube.com/watch?v=UTjwyDuVjRM&t');
		} else {
			console.error('Cannot open URL');
		}
	};

	console.log(isInternetLink);

	return (
		<View>
			{isInternetLink ? (
				<View style={{ flex: 0 }}>
					{/* <Image
						style={{
							width: '100%',
							height: 100,
							// flex: 1,
						}}
						source={{ uri: previewData?.images[0] }}
					/>
					<TouchableOpacity onPress={() => handleLinkPress(videoUrl)}>
						<ThemedText
							style={{
								paddingHorizontal: 10,
								paddingVertical: 8,
								color: Colors[theme].primary,
							}}
							theme={theme}
							value={videoUrl}
						/>
					</TouchableOpacity> */}
				</View>
			) : (
				<View style={{ flex: 1 }}>
					{/* <VideoView
						style={{ flex: 1, width: 200, height: 200 }}
						player={player}
						contentFit="contain"
						allowsFullscreen
					/> */}
				</View>
			)}
		</View>
	);
};

const fetchLinkPreview = async (url: string) => {
	try {
		const response = await fetch(
			`http://192.168.0.136:4000/api/chats/link-preview`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			},
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error while loading preview:', error);
		return null;
	}
};

const VideoStyles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 50,
	},
	controlsContainer: {
		padding: 10,
	},
});

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#eee',
		borderRadius: 10,
		alignItems: 'center',
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 6,
		marginRight: 10,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 14,
	},
	description: {
		fontSize: 12,
		color: '#555',
	},
	headerLeft: { marginRight: 20 },
	headerCenter: {
		width: 250,
		flexDirection: 'row',
		gap: 10,
	},
	headerRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 15,
	},
	profilePic: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	headerText: {
		marginLeft: 0,
	},
	userName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	userStatus: {
		fontSize: 12,
	},
	composer: {
		paddingHorizontal: 10,
		paddingTop: 8,
		fontSize: 16,
		marginVertical: 4,
	},
	preview: {
		marginTop: 6,
		marginHorizontal: 10,
		borderRadius: 12,
		overflow: 'hidden',
	},
});

export default ChatScreen;
