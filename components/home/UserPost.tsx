import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Share, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { formatDistanceToNow } from 'date-fns';
import { userCommentType, ReactionType, RawPost } from '@/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import PostCommentSection from './PostCommentSection';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';
import UserPostReactionsModal from './PostReactionModal';
import RenderPostContent from './RenderPostContent';

interface UserPostComponentProps {
	post: RawPost;
}

const UserPost: React.FC<UserPostComponentProps> = ({ post }) => {
	const theme = useSystemTheme();
	const { user } = useUser();

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
	const [likesCount, setLikesCount] = useState(post.likes || 0);
	const [commentsCount, setCommentsCount] = useState(post.comments.length || 0);
	const [shareCount, setshareCount] = useState(post.shares || 0);
	const [currentUserLiked, setCurrentUserLiked] = useState<boolean>(post.liked);

	useEffect(() => {
		setCurrentUserLiked(post.liked);
		setLikesCount(post.likes);
	}, [post.liked, post.likes]);

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

		fetch(`http://192.168.0.136:4000/api/posts/${postId}/like/${user?.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			},
			body: JSON.stringify({
				currentUserLiked: !currentUserLiked,
			}),
		}).catch((err) => {
			console.warn('Error posting current like status to user post: ', err);
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

	const postTimeAgo = formatDistanceToNow(new Date(post.CreatedAt), {
		addSuffix: true,
	});

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const reactionsModalBottomSheetRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
		bottomSheetModalRef?.current?.snapToIndex(1);
	}, []);

	const handlePresentReactionsModalPress = useCallback(() => {
		reactionsModalBottomSheetRef.current?.present();
		// reactionsModalBottomSheetRef?.current?.snapToIndex(1);
	}, []);

	// render post
	return (
		<View
			style={[
				styles.postContainer,
				{
					backgroundColor: Colors[theme].background,
				},
			]}>
			{/* Header */}
			<PostHeader post={post} postTimeAgo={postTimeAgo} />
			{/* Main content */}
			<RenderPostContent post={post} theme={theme} />
			{/* Footer */}
			<PostFooter
				likesCount={likesCount}
				commentsCount={commentsCount}
				post={post}
				shareCount={shareCount}
				reactions={reactions}
				setShowReactions={handlePresentReactionsModalPress}
				handleLike={handleLike}
				handleShare={handleShare}
				onCommentsBtnPress={handlePresentModalPress}
				currentUserLiked={currentUserLiked}
			/>
			{/* Reactions Modal */}
			<UserPostReactionsModal
				theme={theme}
				ref={reactionsModalBottomSheetRef}
				showReactions={showReactions}
				setShowReactions={setShowReactions}
				handleReaction={handleReaction}
			/>
			{/* Post Comment Section */}
			<PostCommentSection
				ref={bottomSheetModalRef}
				comments={userComments}
				username={post.UserName}
				postId={postId}
				setCommentsCount={setCommentsCount}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		overflow: 'hidden',
		shadowColor: '#000',
		flex: 1,
		marginTop: 2,
	},
});

export default UserPost;
