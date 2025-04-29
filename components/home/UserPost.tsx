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
	TextInputMaxCharacters,
} from '@/types';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetModalProvider,
	BottomSheetTextInput,
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
import { defaultStyles } from '@/constants/Styles';
import CommentRow from '../rows/CommentRow';

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
			<PostCommentSection
				ref={bottomSheetModalRef}
				comments={userComments}
				username={post.username}
			/>
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
					source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
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
		<View style={[styles.footer]}>
			<View style={[styles.upper_footer]}>
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

			{/* lower footer */}
			<View
				style={[
					styles.lower_footer,
					{
						// height: 40,
						// post.type == 'videoPortrait' ||
						// post.type == 'videoLandscape' ||
						// post.type == 'image'
						// 	? reactions.length > 0
						// 		? 145
						// 		: 0
						// 	: reactions.length > 0
						// 	? 145
						// 	: 0,
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
												height: 140,
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

						{/* description */}
						<ThemedView
							theme={theme}
							style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							<ThemedText
								style={{ fontWeight: 'bold', marginRight: 4.5 }}
								theme={theme}
								value={post.username}
							/>
							<ThemedText theme={theme} value={post.caption} />
						</ThemedView>
					</View>
				</View>
			</View>
			{/*  */}
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
	comments: userCommentType[];
	username: string;
}

const PostCommentSection = forwardRef<
	BottomSheetModal,
	PostCommentSectionProps
>((props, ref) => {
	const theme = useSystemTheme();
	const insets = useSafeAreaInsets();

	const { comments: commentsAsProps, username } = props;

	const snapPoints = useMemo(() => ['75%'], []);

	const [commentsLoaded, setCommentsLoaded] = useState(false);

	const [comments, setComments] = useState<userCommentType[]>(commentsAsProps);
	const [text, setText] = useState('');

	const onSend = () => {
		if (!text) return;

		// dummy data
		const newComment: userCommentType = {
			avatar: 'https://randomuser.me/api/portraits/men/32.jp',
			text: 'Das ist ein großartiger Kommentar!',
			user: {
				_id: 1,
				name: 'Felix Schmidt',
				avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
			},
			_id: 101,
			createdAt: new Date('2024-03-04T12:00:00Z'),
			likes: 567,
			purpose: 'comment',
			type: CommentType.default,
		};

		setComments((prev) => [...prev, newComment]);
	};

	useEffect(() => {
		setCommentsLoaded(false);

		if (!comments) return;

		setCommentsLoaded(true);
		// console.log('commentgdssggfs:', comments);
	}, [comments]);

	const renderBackdrop = useCallback((props: any) => {
		const animatedIndex = useSharedValue(0);
		const animatedPosition = useSharedValue(1);

		return (
			<BottomSheetBackdrop
				animatedIndex={animatedIndex}
				animatedPosition={animatedPosition}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		);
	}, []);

	return (
		<BottomSheetModal
			containerStyle={{}}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{ backgroundColor: 'gray' }}
			backgroundStyle={{
				backgroundColor: Colors[theme].surface,
			}}
			ref={ref}
			index={1}
			snapPoints={snapPoints}>
			{/* main content */}
			<BottomSheetView style={{}}>
				{commentsLoaded ? (
					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'space-between',
							height: '100%',
						}}>
						<View
							style={{
								width: '100%',
								justifyContent: 'center',
								alignItems: 'center',
								marginBottom: 20,
							}}>
							<ThemedText
								theme={theme}
								value={'Comments'}
								style={[defaultStyles.biggerText]}
							/>
						</View>

						<ScrollView
							scrollEnabled={true}
							keyboardDismissMode="on-drag"
							contentInsetAdjustmentBehavior="always"
							style={{ alignSelf: 'flex-start', flex: 1 }}>
							{comments.length > 0 ? (
								<BottomSheetFlatList
									scrollEnabled={false}
									data={comments}
									renderItem={({ item: comment, index }) => {
										const replies = comments.filter(
											(val) => val.replyTo === comment._id,
										);

										return (
											<View>
												{!comment.replyTo && (
													<CommentRow
														key={index}
														style={{ backgroundColor: Colors[theme].surface }}
														userId={comment.user._id}
														avatar={comment.avatar}
														text={comment.text}
														responses={replies.length}
														likes={comment.likes}
														date={new Date(comment.createdAt)}
														username={comment.user.name}
														purpose={comment.purpose}
														type={comment.type}
														commentId={comment._id}
														replies={replies}
													/>
												)}
											</View>
										);
									}}
									keyExtractor={(item, index) => index.toString()}
								/>
							) : (
								<View
									style={{
										flex: 1,
										width: Dimensions.get('window').width,
										height: 600,
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<ThemedText
										style={{ color: 'gray' }}
										theme={theme}
										value={`Be the first comment under ${username}'s post!`}
									/>
								</View>
							)}
						</ScrollView>

						<View
							style={{
								width: '100%',
								height: 'auto',
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								backgroundColor: Colors[theme].surface,
								borderTopWidth: StyleSheet.hairlineWidth,
								borderTopColor: Colors[theme].textPrimary,
							}}>
							<BottomSheetTextInput
								maxLength={TextInputMaxCharacters.SmallDescription}
								onChangeText={setText}
								value={text}
								style={[
									styles.composer,
									{
										color: Colors[theme].textPrimary,
									},
								]}
								placeholderTextColor={'gray'}
								placeholder={`A comment for ${username}`}
							/>
							<TouchableOpacity
								onPress={onSend}
								style={{ paddingHorizontal: 14 }}>
								<Ionicons
									name="send-outline"
									size={20}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<CrahActivityIndicator size={'large'} color={'gray'} />
				)}
			</BottomSheetView>
			{/*  */}
		</BottomSheetModal>
	);
});

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
		marginTop: 4,
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
		padding: 20,
		fontSize: 16,
	},
});

export default UserPost;
