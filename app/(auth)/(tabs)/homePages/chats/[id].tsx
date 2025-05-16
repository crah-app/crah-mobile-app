import React, {
	useState,
	useCallback,
	useEffect,
	forwardRef,
	useLayoutEffect,
	useRef,
	useMemo,
} from 'react';
import {
	Bubble,
	BubbleProps,
	Composer,
	Day,
	GiftedChat,
	IMessage,
	InputToolbar,
	LeftRightStyle,
	MessageProps,
	MessageVideoProps,
	RenderMessageTextProps,
	SendProps,
	SystemMessage,
	SystemMessageProps,
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
	Dimensions,
	AppState,
	AppStateStatus,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	router,
	Stack,
	useFocusEffect,
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
import {
	chatCostumMsgType,
	ChatFooterBarTypes,
	ChatMessage,
	CrahUser,
	dropDownMenuInputData,
	errType,
	ItemText,
	LinkPreview,
	Rank,
	selectedRiderInterface,
	selectedTrickInterface,
	TypingStatus,
	urlRegex,
} from '@/types';
import Row from '@/components/general/Row';
import ClerkUser from '@/types/clerk';

import { fetchLinkPreview, getTrickTitle } from '@/utils/globalFuncs';
import DropDownMenu from '@/components/general/DropDownMenu';

import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetTextInput,
	BottomSheetView,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import SearchBar from '@/components/general/SearchBar';
import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';
import socket from '@/utils/socket';
import ChatFooterBar from '@/components/giftedChat/ChatFooter';
import {
	RenderSendEmptyText,
	RenderSendText,
} from '@/components/giftedChat/ComposerComponents';
import { RenderRightInputButton } from '@/components/giftedChat/RenderRightInputButton';
import { RiderRow, TrickRow } from '@/components/giftedChat/UtilityMessageRow';
import {
	CustomMessageView,
	RenderBubble,
	RenderMessageImage,
	RenderMessageVideo,
	TypingIndicator,
} from '@/components/giftedChat/RenderBubbleContents';
import storage from '@/utils/storage';
import { Swipeable } from 'react-native-gesture-handler';
import CostumChatBubble from '@/components/giftedChat/CostumChatBubble';
import { mmkv } from '@/hooks/mmkv';
import CameraComponent from '@/components/giftedChat/CameraComponent';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';
import TransparentLoadingScreen from '@/components/TransparentLoadingScreen';

const ChatScreen = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom } = useSafeAreaInsets();
	const rawParams = useLocalSearchParams();

	const id = rawParams.id as string;

	// states
	const [text, setText] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messagesLoaded, setMessagesLoaded] = useState<boolean>();
	const [errLoadingMessages, setErrLoadingMessages] = useState<boolean>();
	const [typingStatus, setTypingStatus] = useState<TypingStatus | undefined>({
		userId: '',
		isTyping: false,
	});
	const [typing, setTyping] = useState<boolean>(false);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [isGroup, setIsGroup] = useState<boolean>();
	const [chatTitle, setChatTitle] = useState<string>('');

	// attaching a new message like a trick, rider, audio or source
	const [displayChatFooter, setDisplayChatFooter] = useState<boolean>();
	const [attachedMessageType, setAttachedMessageType] = useState<
		ChatFooterBarTypes | undefined
	>();

	const [selectedRiderData, setSelectedRiderData] = useState<
		selectedRiderInterface | undefined
	>();
	const [selectedTrickData, setSelectedTrickData] = useState<
		selectedTrickInterface | undefined
	>();

	const [isInChatRoom, setIsInChatRoom] = useState<boolean>();

	const swipeableRowRef = useRef<Swipeable | null>(null);
	const [replyMessage, setReplyMessage] = useState<ChatMessage>();
	const [isReply, setIsReply] = useState<boolean>(false);
	const [replyMessageId, setReplyMessageId] = useState<string | undefined>();

	const [useCamera, setUseCamera] = useState<boolean>(false);
	const [image, setImage] = useState<PhotoFile | undefined>(undefined);
	const [video, setVideo] = useState<VideoFile | undefined>(undefined);

	// user sends source (vidoe, photo, audio, ...) to chat which has to be loaded to the cloud
	const [loadingSourceToBucket, setLoadingSourceToBucket] = useState<boolean>();
	const [loadedSourceToBucket, setLoadedSourceToBucket] = useState<boolean>();
	const [errLoadingSourceToBucket, setErrLoadingSourceToBucket] =
		useState<boolean>();

	const [loadingSourceProgress, setLoadingSourceProgress] = useState<number>(0);
	const [loadingSourceModalVisible, setLoadingSourceModalVisible] =
		useState<boolean>(false);

	const updateRowRef = useCallback(
		(ref: any) => {
			if (
				ref &&
				replyMessage &&
				ref.props.children.props.currentMessage?._id === replyMessage._id
			) {
				swipeableRowRef.current = ref;
			}
		},
		[replyMessage],
	);

	useEffect(() => {
		if (replyMessage && swipeableRowRef.current) {
			swipeableRowRef.current.close();
			swipeableRowRef.current = null;
		}
	}, [replyMessage]);

	const handleGoBack = () => {
		setIsInChatRoom(false);
		router.back();
		socket.off('recieve-message');
	};

	// helper functin: store messages
	const saveMessagesToStorage = (messagesToSave: ChatMessage[]) => {
		storage.set(`chat-messages-${id}`, JSON.stringify(messagesToSave));
	};

	// send messages
	const onSend = useCallback(
		(newMessages: ChatMessage[]) => {
			if (!messages) return;

			const updatedMessages = GiftedChat.append(messages, newMessages);
			setMessages(updatedMessages);
			saveMessagesToStorage(updatedMessages);
			mmkv.set(`msgs_${id}`, JSON.stringify(updatedMessages));

			setDisplayChatFooter(false);
			setSelectedRiderData(undefined);
			setSelectedTrickData(undefined);
			setAttachedMessageType(undefined);
			setReplyMessage(undefined);
			setIsReply(false);
			setReplyMessageId(undefined);
			setVideo(undefined);
			setImage(undefined);

			socket.emit('send-message', { chatId: id, msg: newMessages });
		},
		[messages, id],
	);

	// recieve messages
	useFocusEffect(
		useCallback(() => {
			setIsInChatRoom(true);

			const receiveMessageHandler = (args: {
				chatId: string;
				msg: ChatMessage[];
			}) => {
				setMessages((previousMessages) => {
					const updatedMessages = GiftedChat.append(previousMessages, args.msg);
					saveMessagesToStorage(updatedMessages);
					return updatedMessages;
				});

				socket.emit('message-seen', {
					chatId: id,
					userId: user?.id,
					isInChat: true, // here in this specific case, the user is certanily in the chat
				});
			};

			socket.on('recieve-message', receiveMessageHandler);

			const loadMessages = async () => {
				// storage.clearAll();

				try {
					// const storedMessages: string | undefined = storage.getString(
					// 	`chat-messages-${id}`,
					// );
					// if (storedMessages !== '[]' && storedMessages) {
					// 	console.log(JSON.parse(storedMessages));

					// 	const parsed: ChatMessage[] = JSON.parse(storedMessages).map(
					// 		(msg: ChatMessage) => ({
					// 			...msg,
					// 			createdAt: new Date(msg.createdAt),
					// 		}),
					// 	);
					// 	setMessages(parsed);
					// 	setMessagesLoaded(true);
					// 	console.log('Loaded messages from MMKV');
					// } else {
					await fetchMessages();
					// }
				} catch (error) {
					console.error('Error loading messages from storage:', error);
					await fetchMessages();
				}
			};

			loadMessages();

			return () => {
				socket.off('recieve-message');
			};
		}, []),
	);

	useEffect(() => {
		if (!isInChatRoom) return;

		socket.emit('message-seen', {
			chatId: id,
			userId: user?.id,
			isInChat: isInChatRoom,
		});

		return () => {
			socket.off('message-seen');
		};
	}, [isInChatRoom]);

	// function for loading messages from server
	const fetchMessages = async () => {
		setErrLoadingMessages(false);
		setMessagesLoaded(false);

		try {
			console.log(' loading fetch', id, user?.id);

			const response = await fetch(
				`http://192.168.0.136:4000/api/chats/messages/${id}/${user?.id}`,
				{
					headers: { 'Cache-Control': 'no-cache' },
				},
			);

			const res: ChatMessage[] = await response.json();

			const updatedMessages = [
				...res.map((msg) => ({
					...msg,
					createdAt: new Date(msg.createdAt),
				})),
				// .reverse(),
			];

			const sortedMessages = [...updatedMessages].sort((a, b) => {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			});
			// console.log(updatedMessages);

			setMessages(sortedMessages);
			saveMessagesToStorage(sortedMessages);
			setFetchedData(res);

			mmkv.set(`msgs_${id}`, JSON.stringify(sortedMessages));

			// is in chat room prevents bug where messages are marked as seen although client is not in the chat page itself
			setIsInChatRoom(true);
		} catch (err) {
			setErrLoadingMessages(true);
		} finally {
			setMessagesLoaded(true);
		}
	};

	// set meta data for chat
	const setFetchedData = (data: ChatMessage[]) => {
		setIsGroup(data[0].isGroup);
		setChatTitle(data[data.length - 1].ChatName);
	};

	// typing handler
	const typingHandler = (text: string) => {
		setText(text);

		if (!typing) {
			setTyping(true);
			handleTyping();
		}

		// Clear the previous timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set a new timeout
		typingTimeoutRef.current = setTimeout(() => {
			setTyping(false);
			handleStopTyping();
		}, 1000); // Adjust the delay as needed (e.g., 1000ms = 1 second)
	};

	useEffect(() => {
		const typingHandler = (data: TypingStatus) => {
			// console.log(data, data.userId !== user?.id);
			if (data.userId !== user?.id) {
				setTypingStatus(data);
			}
		};

		socket.on('user-typing', typingHandler);

		return () => {
			socket.off('user-typing', typingHandler);
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, [user?.id]);

	// Emit Typing Event
	const handleTyping = useCallback(() => {
		socket.emit('user-typing', {
			chatId: id,
			userId: user?.id,
			isTyping: true,
		});
	}, [id, user?.id]);

	// Stop Typing Event
	const handleStopTyping = useCallback(() => {
		socket.emit('user-typing', {
			chatId: id,
			userId: user?.id,
			isTyping: false,
		});
	}, [id, user?.id]);

	useEffect(() => {
		if (!video && !image) return;

		setDisplayChatFooter(true);
		setAttachedMessageType('Source');
		setIsReply(false);
		setReplyMessageId(undefined);

		return () => {};
	}, [video, image]);

	useEffect(() => {
		console.log(loadingSourceProgress);
		return () => {};
	}, [loadingSourceProgress]);

	if (useCamera) {
		return (
			<View style={{ flex: 1 }}>
				<Stack.Screen options={{ headerShown: false }} />
				<CameraComponent
					setUseCamera={setUseCamera}
					setImage={setImage}
					setVideo={setVideo}
					video={video}
					image={image}
				/>
			</View>
		);
	}

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
							<TouchableOpacity onPress={() => {}}>
								<Ionicons
									name="videocam-outline"
									size={26}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>

							{/* call btn */}
							<TouchableOpacity onPress={() => {}} style={{}}>
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
							<TouchableOpacity
								onPress={handleGoBack}
								style={styles.headerLeft}>
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
				{/* loading screen for uploading assets */}
				<TransparentLoadingScreen
					progress={loadingSourceProgress}
					visible={loadingSourceModalVisible}
				/>

				<RenderFetchedData
					ActivityIndicatorStyle={{
						marginTop: Dimensions.get('screen').height * 0.25,
					}}
					errState={errLoadingMessages}
					loadedState={messagesLoaded}
					activityIndicatorColor={Colors[theme].primary}
					activityIndicatorSize={24}
					clientErrorTitle="Something went wrong..."
					clientErrorSubTitle="May try again?"
					renderComponent={
						<View style={{ flex: 1 }}>
							<GiftedChat
								optionTintColor="white"
								isKeyboardInternallyHandled={true}
								renderAvatar={null}
								messages={messages}
								onSend={(messages) => onSend(messages)}
								user={{
									// @ts-ignore
									_id: user.id,
									// @ts-ignore
									name: user?.username,
									avatar: user?.imageUrl,
								}}
								onInputTextChanged={(text) => typingHandler(text)}
								// centered system messages
								renderSystemMessage={(props) => (
									<RenderSystemMessage props={props} />
								)}
								// left action: add btn
								renderActions={(props) => (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											height: 44,
										}}>
										<RenderRightInputButton
											setDisplayFooter={setDisplayChatFooter}
											props={props}
											setAttachedMessageType={setAttachedMessageType}
											setSelectedRiderData={setSelectedRiderData}
											setSelectedTrickData={setSelectedTrickData}
										/>
									</View>
								)}
								renderMessage={(props) => (
									<CostumChatBubble
										{...props}
										setReplyOnSwipeOpen={setReplyMessage}
										updateRowRef={updateRowRef}
										setDisplayFooter={setDisplayChatFooter}
										setAttachedMessageType={setAttachedMessageType}
										setSelectedRiderData={setSelectedRiderData}
										setSelectedTrickData={setSelectedTrickData}
										setSelectedImage={setImage}
										setSelectedVideo={setVideo}
										setIsReply={setIsReply}
										setReplyMessageId={setReplyMessageId}
									/>
								)}
								// chat footer
								renderChatFooter={() => (
									<ChatFooterBar
										setReplyMessageId={setReplyMessageId}
										setIsReply={setIsReply}
										displayFooter={displayChatFooter}
										msgType={attachedMessageType}
										riderData={selectedRiderData}
										trickData={selectedTrickData}
										setAttachedMessageType={setAttachedMessageType}
										setDisplayFooter={setDisplayChatFooter}
										setSelectedRiderData={setSelectedRiderData}
										setSelectedTrickData={setSelectedTrickData}
										setSelectedImage={setImage}
										setSelectedVideo={setVideo}
										sourceData={{
											uri: image?.path || video?.path,
											type: image ? 'image' : 'video',
										}}
										setReplyMessage={setReplyMessage}
										replyMessage={replyMessage}
										isReply={isReply}
										replyToMessageId={replyMessageId}
									/>
								)}
								// right btn: send
								renderSend={(props) => (
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											height: 44,
										}}>
										{text.length > 0 || attachedMessageType !== undefined ? (
											<RenderSendText
												isReply={isReply}
												replyToMessageId={replyMessageId}
												selectedTrickData={selectedTrickData}
												selectedRiderData={selectedRiderData}
												attachedMessageType={attachedMessageType}
												props={props}
												image={image}
												video={video}
												setLoadingSourceProgress={setLoadingSourceProgress}
												setLoadingSourceModalVisible={
													setLoadingSourceModalVisible
												}
											/>
										) : (
											<RenderSendEmptyText
												chatId={id as string}
												props={props}
												useCamera={useCamera}
												setUseCamera={setUseCamera}
											/>
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
										}}
									/>
								)}
								renderQuickReplies={(props) => (
									<QuickReplies color={'white'} {...props} />
								)}
								renderComposer={(props) => (
									<Composer
										{...props}
										textInputStyle={{ color: Colors[theme].textPrimary }}
									/>
								)}
								focusOnInputWhenOpeningKeyboard={true}
								renderMessageVideo={(props) => (
									<RenderMessageVideo props={props} />
								)}
								renderMessageImage={(props) => (
									<RenderMessageImage props={props} />
								)}
								isTyping={typingStatus?.isTyping}
								renderTypingIndicator={() => (
									<TypingIndicator display={typingStatus?.isTyping || false} />
								)}
								renderCustomView={(props) => (
									<CustomMessageView chatId={id} props={props} />
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

const RenderSystemMessage: React.FC<{
	props: SystemMessageProps<ChatMessage>;
}> = ({ props }) => {
	const otherUserId = '';
	const otherUserName = '';

	const navigateToProfile = () => {};

	if (props.currentMessage?._id === 'profile-card') {
		return (
			<View style={{ padding: 16, backgroundColor: '#f2f2f2' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Image
						source={{ uri: `/users/pfps/${otherUserId}.png` }}
						style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
					/>
					<View>
						<Text style={{ fontWeight: 'bold', fontSize: 16 }}>
							{otherUserName}
						</Text>
						<TouchableOpacity onPress={navigateToProfile}>
							<Text style={{ color: 'blue' }}>Profil ansehen</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	// Optional: default system message
	return <SystemMessage {...props} />;
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
