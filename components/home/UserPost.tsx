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
	Share,
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
import {
	CommentPurpose,
	userCommentType,
	ReactionType,
	CommentType,
	TextInputMaxCharacters,
	RawPost,
	upload_source_ratio,
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
import { VideoUIBtns } from '../VideoUI';
import { useDynamicDimensions } from '@/hooks/useDynamicRatioDimensions';

interface UserPostComponentProps {
	post: RawPost;
}

const UserPost: React.FC<UserPostComponentProps> = ({ post }) => {
	const theme = useSystemTheme();

	const [userComments, setUserComments] = useState<userCommentType[]>(() => {
		// 1. remove all nulls
		const raw = Array.isArray(post.comments)
			? post.comments.filter((c): c is NonNullable<typeof c> => c !== null)
			: [];

		// 2. map
		return raw.map((msg: any) => ({
			...msg,
			createdAt: new Date(msg.CreatedAt),
		}));
	});

	const [showReactions, setShowReactions] = useState(false);
	const [reactions, setReactions] = useState<ReactionType[]>([]);
	const [likesCount, setLikesCount] = useState(post.Likes || 0);
	const [commentsCount, setCommentsCount] = useState(post.comments.length || 0);
	const [shareCount, setshareCount] = useState(post.Shares || 0);

	const [currentUserLiked, setCurrentUserLiked] = useState<boolean>();

	const handleReaction = (reaction: ReactionType) => {
		if (reaction) {
			setReactions((prev: ReactionType[]) => [...prev, reaction]);
		}
		setShowReactions(false);
	};

	const handleLike = () => {
		setCurrentUserLiked((prev) => {
			if (!prev) {
				setLikesCount(likesCount + 1);
				return true;
			}

			setLikesCount(likesCount - 1);
			return false;
		});
	};

	const handleComment = () => {
		setCommentsCount(commentsCount + 1);
	};

	const postId = post.Id; // ID des Posts
	const postDeepLink = `yourapp://post/${postId}`; // Deep Link zu diesem Post

	// const handleDeepLink = (event) => {
	// 	const deepLink = event.url;
	// 	if (deepLink.includes('yourapp://post/')) {
	// 		const postId = deepLink.split('/')[2]; // Extrahiere die Post-ID
	// 		// Navigiere zum entsprechenden Post in deiner App
	// 		navigation.navigate('PostDetails', { postId });
	// 	}
	// };

	// useEffect(() => {
	// 	Linking.addEventListener('url', handleDeepLink);
	// 	return () => {
	// 		Linking.removeEventListener('url', handleDeepLink);
	// 	};
	// }, []);

	const handleShare = async () => {
		const postId = 123; // Beispiel-Post-ID
		const postDeepLink = `yourapp://post/${postId}`; // Deep Link erstellen

		try {
			const result = await Share.share({
				message: `Schau dir diesen Post an: ${postDeepLink}`,
				url: postDeepLink, // Der Deep Link
				title: 'Post teilen',
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					console.log(
						'Post geteilt über eine spezielle Aktivität: ',
						result.activityType,
					);
				} else {
					console.log('Post erfolgreich geteilt!');
				}
			} else if (result.action === Share.dismissedAction) {
				console.log('Teilen abgebrochen');
			}
		} catch (error) {
			console.error('Fehler beim Teilen: ', error);
		}
	};

	const renderPostContent = () => {
		const mediaUrl = `https://pub-78edb5b6f0d946d28db91b59ddf775af.r2.dev/${post.SourceKey}`;

		const { width, height } = useDynamicDimensions(
			post.sourceWidth,
			post.sourceHeight,
		);

		switch (post.Type) {
			case 'Video':
				const player = useVideoPlayer(mediaUrl, (player) => {
					player.loop = true;
				});

				const { isPlaying } = useEvent(player, 'playingChange', {
					isPlaying: player.playing,
				});

				const handleVideoPlayer = () => {
					isPlaying ? player.pause() : player.play();
				};

				return (
					<View
						style={[
							styles.contentContainer,
							{ backgroundColor: Colors[theme].absoluteContrast },
						]}>
						<VideoView
							player={player}
							style={{
								width: width,
								height: height,
								alignSelf: 'center',
							}}
							contentFit={'contain'} // or cover
							nativeControls={false}
						/>

						<VideoUIBtns
							theme={theme}
							handleVideoPlayer={handleVideoPlayer}
							isPlaying={isPlaying}
						/>
					</View>
				);
			case 'Image':
				return (
					<Image
						source={{
							uri: mediaUrl,
						}}
						style={[
							styles.image,
							{
								width: Dimensions.get('window').width,
								height: Dimensions.get('window').width,
							},
						]}
					/>
				);
			case 'Article':
				return (
					<Link
						asChild
						href={{
							pathname: '/modals/postView',
							params: { data: JSON.stringify(post), type: post.Type },
						}}
						style={[styles.textPost]}>
						<TouchableOpacity>
							<ThemedText
								style={[
									styles.articlePreview,
									{ color: Colors[theme].textPrimary },
								]}
								theme={theme}
								value={`${post.Content?.slice(0, 150)}...`}
							/>
						</TouchableOpacity>
					</Link>
				);
			case 'Text':
				return (
					<Text style={[styles.textPost, { color: Colors[theme].textPrimary }]}>
						{post.Description}
					</Text>
				);

			case 'Music':
				return (
					<View>
						<ThemedText theme={theme} value={'music lol'} />
					</View>
				);
		}
	};

	const postTimeAgo = formatDistanceToNow(new Date(post.CreatedAt), {
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
				currentUserLiked={currentUserLiked}
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
				username={post.UserName}
			/>
		</View>
	);
};

const PostHeader: React.FC<{ post: RawPost; postTimeAgo: string }> = ({
	post,
	postTimeAgo,
}) => {
	const theme = useSystemTheme();

	return (
		<View>
			<View style={styles.header}>
				<Image source={{ uri: post.UserAvatar }} style={styles.profileImage} />

				<View style={{ flexDirection: 'column', gap: 2 }}>
					<Text style={[styles.username, { color: Colors[theme].textPrimary }]}>
						{post.UserName}
					</Text>

					<Text style={[{ color: Colors[theme].gray, fontSize: 14 }]}>
						{post.Title}
					</Text>
				</View>
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
	post: RawPost;
	shareCount: number;
	reactions: string[];
	setShowReactions: (boolean: boolean) => void;
	onCommentsBtnPress: () => void;
	currentUserLiked: boolean | undefined;
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
	currentUserLiked,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.footer]}>
			<View style={[styles.upper_footer]}>
				{/* <left side of the footer> */}
				<View style={styles.footerLeft}>
					{/* like button */}
					<View style={styles.iconButton}>
						<TouchableOpacity onPress={handleLike}>
							<Ionicons
								name={currentUserLiked ? 'heart' : 'heart-outline'}
								size={24}
								color={
									currentUserLiked
										? Colors[theme].primary
										: Colors[theme].textPrimary
								}
							/>
						</TouchableOpacity>

						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{likesCount}
						</Text>
					</View>

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
					// styles.lower_footer,
					{
						// height: 200,
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
									backgroundColor: 'rgba(100,100,100,0.3)',
									borderRadius: 20,
									paddingHorizontal: 12,
									maxWidth: '100%',
									flexDirection: 'row',
									overflowX: 'hidden',
								}}>
								<View style={{ flexDirection: 'row', gap: 12 }}>
									{reactions.map((reaction: string, index: number) => (
										<View
											style={{
												flexDirection: 'row',
												gap: 6,
												// backgroundColor: 'rgba(100,100,100,0.3)',
												paddingVertical: 10,
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

						{/* description */}
						<ThemedView
							theme={theme}
							style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							<ThemedText
								style={{ fontWeight: 'bold', marginRight: 4.5 }}
								theme={theme}
								value={post.UserName}
							/>
							<ThemedText theme={theme} value={post.Description} />
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
			// @ts-ignore
			user: {
				id: 'felixschmidt',
				username: 'Felix Schmidt',
				imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
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
														userId={comment.user.id}
														avatar={comment.avatar}
														text={comment.text}
														responses={replies.length}
														likes={comment.likes}
														date={new Date(comment.createdAt)}
														username={comment.user.username}
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
		marginTop: 2,
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
		gap: 12,
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	composer: {
		padding: 20,
		fontSize: 16,
	},
});

export default UserPost;
