import React, {
	ForwardedRef,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	Platform,
	SafeAreaView,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import ThemedView from '../general/ThemedView';
import Reactions from '@/constants/Reactions';
import ThemedText from '../general/ThemedText';
import { formatDistanceToNow } from 'date-fns';
import {
	GestureHandlerRootView,
	ScrollView,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import {
	CommentPurpose,
	userCommentType,
	userPostType,
	ReactionType,
	CommentType,
} from '@/types';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetView,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {
	Bubble,
	Composer,
	GiftedChat,
	IMessage,
	InputToolbar,
} from 'react-native-gifted-chat';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import { QuickReplies } from 'react-native-gifted-chat/lib/QuickReplies';
import { BottomSheetModalRef } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types';
import Modal from 'react-native-modal';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';

const DUMMY_PROFILE_IMAGE = '../../assets/images/vectors/src/person(1).png';
const videoSource =
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

interface UserPostComponentProps {
	post: userPostType;
}

const UserPost: React.FC<UserPostComponentProps> = ({ post }) => {
	// const player = useVideoPlayer(post.videoUrl!, (player) => {
	// 	player.loop = true;
	// });

	// const { isPlaying } = useEvent(player, 'playingChange', {
	// 	isPlaying: player.playing,
	// });

	const theme = useSystemTheme();

	const [userComments, setUserComments] = useState<userCommentType[]>(() => {
		return post.comments.map((msg: any) => ({
			// change "createAt" date type
			...msg,
			createdAt: new Date(msg.createdAt),
		}));
	});
	const [showReactions, setShowReactions] = useState(false);
	const [reactions, setReactions] = useState<ReactionType[]>([]);
	const [likesCount, setLikesCount] = useState(post.likes || 0);
	const [commentsCount, setCommentsCount] = useState(post.comments.length || 0);
	const [shareCount, setshareCount] = useState(post.shares || 0);

	const handleReaction = (reaction: ReactionType) => {
		if (reaction) {
			setReactions((prev: ReactionType[]) => [...prev, reaction]);
		}
		setShowReactions(false);
	};

	const handleLike = () => {
		setLikesCount(likesCount + 1);
	};

	const handleComment = () => {
		setCommentsCount(commentsCount + 1);
	};

	const handleShare = () => {
		setshareCount(shareCount + 1);
	};

	const renderPostContent = () => {
		switch (post.type) {
			// case 'videoLandscape':
			// 	return (
			// 		<View style={styles.contentContainer}>
			// 			<VideoView
			// 				nativeControls={true}
			// 				contentFit="fill"
			// 				player={player}
			// 				style={[
			// 					{
			// 						width: Dimensions.get('window').width,
			// 						height: Dimensions.get('window').width,
			// 					},
			// 				]}
			// 			/>
			// 		</View>
			// 	);
			// case 'videoPortrait':
			// 	return (
			// 		<View style={styles.contentContainer}>
			// 			<VideoView
			// 				nativeControls={true}
			// 				player={player}
			// 				style={[
			// 					{
			// 						width: Dimensions.get('window').width,
			// 						height: Dimensions.get('window').width,
			// 					},
			// 				]}
			// 			/>
			// 		</View>
			// 	);
			// case 'article':
			// 	return (
			// 		<Link
			// 			asChild
			// 			href={{
			// 				pathname: '/modals/postView',
			// 				params: { data: JSON.stringify(post), type: post.type },
			// 			}}
			// 			style={[styles.textPost]}>
			// 			<TouchableOpacity>
			// 				<ThemedText
			// 					style={[
			// 						styles.articlePreview,
			// 						{ color: Colors[theme].textPrimary },
			// 					]}
			// 					theme={theme}
			// 					value={`${post.article?.slice(0, 150)}...`}
			// 				/>
			// 			</TouchableOpacity>
			// 		</Link>
			// 	);
			// case 'text':
			// 	return (
			// 		<Text style={[styles.textPost, { color: Colors[theme].textPrimary }]}>
			// 			{post.text}
			// 		</Text>
			// 	);
			default:
				return (
					<Image
						source={{ uri: post.imageUrl }}
						style={[
							styles.image,
							{
								width: Dimensions.get('window').width,
								height: Dimensions.get('window').width,
							},
						]}
					/>
				);
		}
	};

	const postTimeAgo = formatDistanceToNow(new Date(post.timestamp), {
		addSuffix: true,
	});

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handlCloseModalPress = useCallback(() => {
		bottomSheetModalRef.current?.close();
	}, []);

	// render post
	return (
		<View
			style={[
				styles.postContainer,
				{ backgroundColor: Colors[theme].background },
			]}>
			{/* <BottomSheetModalProvider> */}
			{/* Header */}
			<PostHeader post={post} postTimeAgo={postTimeAgo} />
			{/* Main content */}
			{renderPostContent()}
			{/* Footer */}
			<PostFooter
				likesCount={likesCount}
				commentsCount={commentsCount}
				post={post}
				shareCount={shareCount}
				reactions={reactions}
				setShowReactions={setShowReactions}
				handleLike={handleLike}
				handleShare={handleShare}
				onCommentsBtnPress={handlePresentModalPress}
			/>
			{/* Reactions Modal */}
			<UserPostReactionsModal
				showReactions={showReactions}
				setShowReactions={setShowReactions}
				handleReaction={handleReaction}
			/>
			{/* Post Comment Section */}
			<PostCommentSection ref={bottomSheetModalRef} comments={userComments} />
			{/* </BottomSheetModalProvider> */}
		</View>
	);
};

const PostHeader: React.FC<{ post: userPostType; postTimeAgo: string }> = ({
	post,
	postTimeAgo,
}) => {
	const theme = useSystemTheme();

	return (
		<View>
			<View style={styles.header}>
				<Image
					source={{ uri: '../../assets/images/vectors/src/person(1).png' }}
					style={styles.profileImage}
				/>

				<Text style={[styles.username, { color: Colors[theme].textPrimary }]}>
					{post.username}
				</Text>
			</View>
			<Text style={[styles.postTime, { color: 'gray' }]}>{postTimeAgo}</Text>
		</View>
	);
};

interface PostFooterProps {
	likesCount: number;
	handleLike: () => void;
	handleShare: () => void;
	commentsCount: number;
	post: userPostType;
	shareCount: number;
	reactions: string[];
	setShowReactions: (boolean: boolean) => void;
	onCommentsBtnPress: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
	likesCount,
	commentsCount,
	handleLike,
	handleShare,
	post,
	shareCount,
	setShowReactions,
	reactions,
	onCommentsBtnPress,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={styles.footer}>
			<View style={styles.upper_footer}>
				{/* <left side of the footer> */}
				<View style={styles.footerLeft}>
					{/* like button */}
					<TouchableOpacity style={styles.iconButton} onPress={handleLike}>
						<Ionicons
							name="heart-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{likesCount}
						</Text>
					</TouchableOpacity>

					{/* comment button */}
					<TouchableOpacity
						onPress={onCommentsBtnPress}
						style={styles.iconButton}>
						<Ionicons
							name="chatbubble-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{commentsCount}
						</Text>
					</TouchableOpacity>

					{/* share button */}
					<TouchableOpacity style={styles.iconButton} onPress={handleShare}>
						<Ionicons
							name="share-social-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{shareCount}
						</Text>
					</TouchableOpacity>
				</View>

				{/* reaction button <right side of the footer> */}
				<TouchableOpacity onPress={() => setShowReactions(true)}>
					<Ionicons
						name="happy-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</TouchableOpacity>
			</View>

			<View
				style={[
					styles.lower_footer,
					{
						height:
							post.type == 'videoPortrait' ||
							post.type == 'videoLandscape' ||
							post.type == 'image'
								? reactions.length > 0
									? 45
									: 0
								: reactions.length > 0
								? 45
								: 0,
					},
				]}>
				{/* Reactions in a vertical bubble */}
				<View style={{ height: 'auto' }}>
					{/* // reaction and counter container */}
					<View
						style={[
							{
								// padding: 10,
								// borderRadius: 25,
								// backgroundColor: 'rgba(100,100,100,0.3)',
								flexDirection: 'column',
								overflow: 'hidden',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								marginTop: 2,
								gap: 10,
							},
						]}>
						{/* reaction container */}
						{reactions.length > 0 && (
							<ScrollView
								showsHorizontalScrollIndicator={false}
								horizontal
								style={{
									maxWidth: '100%',
									flexDirection: 'row',
									overflowX: 'hidden',
								}}>
								<View style={{ flexDirection: 'row', gap: 10 }}>
									{reactions.map((reaction: string, index: number) => (
										<View
											style={{
												flexDirection: 'row',
												gap: 6,
												backgroundColor: 'rgba(100,100,100,0.3)',
												padding: 10,
												borderRadius: 20,
												height: 40,
											}}
											key={index + 'Container'}>
											<Text key={index} style={{}}>
												{reaction}
											</Text>

											<Text
												key={index + 'Text'}
												style={[
													{
														color: Colors[theme].textPrimary,
														fontSize: 14,
														fontWeight: 'bold',
													},
												]}>
												{2322}
											</Text>
										</View>
									))}
								</View>
							</ScrollView>
						)}
					</View>
				</View>
			</View>
		</View>
	);
};

interface UserPostReactionsModalProps {
	showReactions: boolean;
	setShowReactions: (boolean: boolean) => void;
	handleReaction: (reaction: ReactionType) => void;
}

const UserPostReactionsModal: React.FC<UserPostReactionsModalProps> = ({
	showReactions,
	setShowReactions,
	handleReaction,
}) => {
	const theme = useSystemTheme();

	return (
		<Modal
			isVisible={showReactions}
			useNativeDriver={true}
			useNativeDriverForBackdrop={true}
			animationIn={'fadeIn'}
			animationOut={'fadeOut'}
			onBackdropPress={() => setShowReactions(false)}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ThemedView
					style={[
						styles.reactionsGrid,
						{
							width: Dimensions.get('window').width / 1.25,
						},
					]}
					theme={theme}>
					{Reactions.map((reaction) => (
						<TouchableOpacity
							key={reaction}
							onPress={() => handleReaction(reaction)}>
							<Text style={{ fontSize: 24 }}>{reaction}</Text>
						</TouchableOpacity>
					))}
				</ThemedView>
			</View>
		</Modal>
	);
};

interface PostCommentSectionProps {
	comments: IMessage[]; // userCommentType[]
}

const PostCommentSection = forwardRef<
	BottomSheetModal,
	PostCommentSectionProps
>((props, ref) => {
	const theme = useSystemTheme();

	const { comments: commentsAsProps } = props;

	const snapPoints = useMemo(() => ['75%'], []);

	const [commentsLoaded, setCommentsLoaded] = useState(false);

	const [comments, setComments] = useState<IMessage[]>(commentsAsProps);
	const [text, setText] = useState('');

	const onSend = (comments: IMessage[]) => {
		setComments((previousMessages) =>
			GiftedChat.append(previousMessages, comments),
		);
	};

	useEffect(() => {
		setCommentsLoaded(false);

		if (!comments) return;

		setCommentsLoaded(true);
		console.log('comments:', comments);
	}, [comments]);

	const renderBackdrop = useCallback((props: any) => {
		const animatedIndex = useSharedValue(0);
		const animatedPosition = useSharedValue(1);

		return (
			<BottomSheetBackdrop
				animatedIndex={animatedIndex}
				animatedPosition={animatedPosition}
				disappearsOnIndex={0}
				appearsOnIndex={1}
			/>
		);
	}, []);

	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{ backgroundColor: 'gray' }}
			backgroundStyle={{
				backgroundColor: Colors[theme].background,
			}}
			ref={ref}
			index={-1}
			snapPoints={snapPoints}>
			{/* main content */}
			<BottomSheetView style={{ flex: 1 }}>
				{commentsLoaded ? (
					<GiftedChat
						isKeyboardInternallyHandled={true}
						renderAvatar={null}
						messages={comments}
						onSend={(comments) => onSend(comments)}
						user={{
							_id: 101, // post id
						}}
						onInputTextChanged={setText}
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
						textInputProps={[styles.composer]}
						renderBubble={(props) => <RenderBubble props={props} />}
						listViewProps={{
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
							<QuickReplies color={Colors[theme].primary} {...props} />
						)}
						renderComposer={(props) => (
							<Composer
								{...props}
								textInputStyle={{ color: Colors[theme].textPrimary }}
							/>
						)}
						focusOnInputWhenOpeningKeyboard={true}
					/>
				) : (
					<CrahActivityIndicator size={'large'} color={Colors[theme].primary} />
				)}
			</BottomSheetView>
			{/*  */}
		</BottomSheetModal>
	);
});

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

const RenderSendText: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			onPress={() => {
				if (props.text && props.text.trim()) {
					props.onSend({ text: props.text.trim() }, true);
					console.log('send pressed');
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

const RenderBubble: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<Bubble
			{...props}
			containerStyle={{
				width: Dimensions.get('window').width,
			}}
			wrapperStyle={{
				right: { backgroundColor: Colors[theme].textBubbleOwn },
				left: { backgroundColor: Colors[theme].textBubbleOther },
			}}
			textStyle={{
				right: { color: 'white' },
				left: { color: 'white' },
			}}
		/>
	);
};

const RenderSendEmptyText: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<View
			style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}></View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		overflow: 'hidden',
		shadowColor: '#000',
		flex: 1,
	},
	header: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	username: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	postTime: {
		fontSize: 12,
		paddingLeft: 10,
		marginBottom: 15,
		marginTop: -1,
	},
	image: {
		width: '100%',
		resizeMode: 'cover',
	},
	articlePreview: {
		fontSize: 14,
	},
	textPost: {
		padding: 10,
		fontSize: 14,
	},
	footer: {
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	lower_footer: {
		marginTop: 10,
		height: 45,
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	writeCommentBar: {},
	upper_footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	footerLeft: {
		flexDirection: 'row',
	},
	iconButton: {
		marginRight: 15,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 5,
	},
	iconCount: {
		fontSize: 13,
		fontWeight: '600',
	},
	reactionCountContainer: {
		fontWeight: 'bold',
		borderRadius: '100%',
		fontSize: 12,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	reactionsGrid: {
		padding: 20,
		borderRadius: 8,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		zIndex: 1,
		gap: 20,
	},
	contentContainer: {
		flex: 1,
		paddingVertical: 10,
		// alignItems: 'center',
		// justifyContent: 'center',
		// paddingHorizontal: 50,
	},
	composer: {
		paddingHorizontal: 10,
		paddingTop: 8,
		fontSize: 16,
		marginVertical: 4,
	},
});

export default UserPost;
