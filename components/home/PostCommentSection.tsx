import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {
	userCommentType,
	CommentType,
	TextInputMaxCharacters,
	database_comment,
} from '@/types';
import {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import CommentRow from '../rows/CommentRow';
import { useAuth, useUser } from '@clerk/clerk-expo';

interface PostCommentSectionProps {
	postId: number;
	comments: userCommentType[];
	username: string;
}

// on the home feed only the top 2 comments get parsed
// Here all comments of the post get parsed
const PostCommentSection = forwardRef<
	BottomSheetModal,
	PostCommentSectionProps
>((props, ref) => {
	const theme = useSystemTheme();
	const insets = useSafeAreaInsets();
	const { user } = useUser();
	const { getToken } = useAuth();

	const { comments: commentsAsProps, username } = props;

	const snapPoints = useMemo(() => ['75%'], []);

	const [error, setError] = useState<boolean>(false);
	const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);

	const [comments, setComments] = useState<userCommentType[]>([]);
	const [text, setText] = useState<string>('');

	useEffect(() => {
		fetchAllComments();
	}, []);

	const fetchAllComments = async () => {
		setCommentsLoaded(false);
		setError(false);

		try {
			const response = await fetch(
				`http://192.168.0.136:4000/api/posts/${props.postId}/comments`,
			);

			const text = await response.text();

			if (!response.ok) {
				setError(true);
			}

			const result = JSON.parse(text);

			console.log('object', result);

			setComments(result);
			setCommentsLoaded(true);
		} catch (error) {
			console.warn('Error [fetchAllComments]', error);
		}
	};

	const onSend = () => {
		if (!text || !user) return;

		// frontend data
		const newComment: userCommentType = {
			CreatedAt: new Date(),
			Id: Math.floor(Math.random() * 1_000_000_000),
			Message: text,
			PostId: props.postId,
			UpdatedAt: new Date().toISOString(),
			UserName: user?.username || '',
			UserAvatar: user?.imageUrl || '',
			UserId: user?.id || '',
			likes: 0,
			purpose: 'comment',
			type: CommentType.default,
			// replyTo: undefined
		};

		setComments((prev) => [...prev, newComment]);

		PostComment();
	};

	const PostComment = async () => {
		if (!user) return;

		const token = await getToken();

		const comment: database_comment = {
			PostId: props.postId,
			UserId: user?.id,
			Message: text,
			CreatedAt: new Date(),
			updatedAt: new Date(),
		};

		try {
			const response = await fetch(
				`http://192.168.0.136:4000/api/posts/${props.postId}/comment/${user?.id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ comment }),
				},
			);

			const text = await response.text();

			if (!response.ok) {
				console.warn('Error [PostComment]', text);
			}
		} catch (error) {
			console.warn('Error [PostComment]', error);
		}
	};

	useEffect(() => {
		setCommentsLoaded(false);

		if (!comments) return;

		setCommentsLoaded(true);

		console.log(comments);
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
				backgroundColor: Colors[theme].background2,
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
											(val) => val.replyTo === comment.Id,
										);

										return (
											<View>
												{!comment.replyTo && (
													<CommentRow
														key={index}
														style={{ backgroundColor: Colors[theme].surface }}
														userId={comment.UserId}
														avatar={comment.UserAvatar}
														text={comment.Message}
														responses={replies.length}
														likes={comment.likes}
														date={new Date(comment.CreatedAt)}
														username={comment.UserName}
														purpose={comment.purpose}
														type={comment.type}
														commentId={comment.Id}
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
								backgroundColor: Colors[theme].background2,
								borderTopWidth: StyleSheet.hairlineWidth,
								borderTopColor: Colors[theme].textPrimary,
								paddingBottom: insets.bottom,
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
									size={defaultHeaderBtnSize - 6}
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
	composer: {
		padding: 20,
		fontSize: 16,
	},
});

export default PostCommentSection;
