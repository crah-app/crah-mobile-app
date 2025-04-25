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
	GiftedChat,
	IMessage,
	InputToolbar,
	LeftRightStyle,
	MessageProps,
	MessageVideoProps,
	RenderMessageTextProps,
	SendProps,
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
	Dimensions,
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
	RenderMessageVideo,
} from '@/components/giftedChat/RenderBubbleContents';

const ChatScreen = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom } = useSafeAreaInsets();
	const { id, fromCamera, video, image } = useLocalSearchParams(); // when user goes from the camera page back to the chat page the source has to be given vie local params

	// states
	const [text, setText] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messagesLoaded, setMessagesLoaded] = useState<boolean>();
	const [errLoadingMessages, setErrLoadingMessages] = useState<boolean>();

	const [isGroup, setIsGroup] = useState<boolean>();
	const [chatTitle, setChatTitle] = useState<string>('');

	const [joinedChatRoom, setJoinedChatRoom] = useState<boolean>();

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

	const [selectedVideo, setSelectedVideo] = useState<string | undefined>();
	const [selectedImage, setSelectedImage] = useState<string | undefined>();

	// send message
	const onSend = useCallback((newMessages: ChatMessage[]) => {
		if (!messages) return;
		// console.log('object', newMessages);

		setDisplayChatFooter(false);
		setSelectedRiderData(undefined);
		setSelectedTrickData(undefined);
		setAttachedMessageType(undefined);
		setSelectedVideo(undefined);
		setSelectedImage(undefined);

		socket.emit('send-message', { chatId: id, msg: newMessages });

		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, newMessages),
		);
	}, []);

	useEffect(() => {
		socket.on('recieve-message', (msg: ChatMessage[]) => {
			// console.log('object', msg);

			setMessages((previousMessages) =>
				GiftedChat.append(previousMessages, msg),
			);
		});
	}, []);

	useEffect(() => {
		if (id && user?.id && !joinedChatRoom) {
			socket.emit('join-chat', { chatId: id, userId: user?.id }, () => {
				setJoinedChatRoom(true);
			});
		}
	}, [id, user]);

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

	useEffect(() => {
		if (!fromCamera) return;

		if (video) {
			setSelectedVideo(video as string);
			return;
		}

		if (image) {
			setSelectedImage(image as string);
			return;
		}

		setDisplayChatFooter(true);
	}, [fromCamera]);

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
								onInputTextChanged={setText}
								// centered system messages
								renderSystemMessage={(props) => (
									<SystemMessage {...props} textStyle={{ color: 'white' }} />
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
								// chat footer
								renderChatFooter={() => (
									<ChatFooterBar
										displayFooter={displayChatFooter}
										msgType={attachedMessageType}
										riderData={selectedRiderData}
										trickData={selectedTrickData}
										setAttachedMessageType={setAttachedMessageType}
										setDisplayFooter={setDisplayChatFooter}
										setSelectedRiderData={setSelectedRiderData}
										setSelectedTrickData={setSelectedTrickData}
										setSelectedImage={setSelectedImage}
										setSelectedVideo={setSelectedVideo}
										sourceData={[
											{
												uri: selectedImage || selectedVideo,
												type: selectedImage ? 'image' : 'video',
											},
										]}
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
												selectedTrickData={selectedTrickData}
												selectedRiderData={selectedRiderData}
												attachedMessageType={attachedMessageType}
												props={props}
											/>
										) : (
											<RenderSendEmptyText
												chatId={id as string}
												props={props}
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
											marginTop: displayChatFooter ? 0 : 12,
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
								isTyping={false}
								renderCustomView={(props) => (
									<CustomMessageView props={props} />
								)}
								renderTime={() => <></>}
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
