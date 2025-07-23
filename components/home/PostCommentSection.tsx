import React, {
	Dispatch,
	forwardRef,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';
import {
	FlatList,
	PanGestureHandler,
	ScrollView,
} from 'react-native-gesture-handler';
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
	setCommentsCount: Dispatch<SetStateAction<number>>;
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

	const snapPoints = useMemo(() => ['70%'], []);

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
				`http://192.168.0.136:4000/api/posts/${props.postId}/comments/${user?.id}`,
			);

			const text = await response.text();

			if (!response.ok) {
				setError(true);
			}

			const result = JSON.parse(text);

			// console.log('object', result);

			setComments(result);
			setCommentsLoaded(true);
		} catch (error) {
			console.warn('Error [fetchAllComments]', error);
		}
	};

	const onSend = async () => {
		if (!text || !user) return;

		Keyboard.dismiss();

		const messageText = text;

		setText('');

		await PostComment(messageText);
	};

	const PostComment = async (Message: string) => {
		if (!user) return;

		const token = await getToken();
		const message = text;

		const comment: database_comment = {
			PostId: props.postId,
			UserId: user?.id,
			Message: message,
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

			const { insertedId: Id } = JSON.parse(text);

			console.log('uisert d', Id);

			// frontend data
			const newComment: userCommentType = {
				CreatedAt: new Date(),
				Id,
				Message,
				PostId: props.postId,
				UpdatedAt: new Date().toISOString(),
				UserName: user?.username || '',
				UserAvatar: user?.imageUrl || '',
				UserId: user?.id || '',
				likes: 0,
				purpose: 'comment',
				type: CommentType.default,
				liked: false,
				// replyTo: undefined
			};

			setComments((prev) => [newComment, ...prev]);
			props.setCommentsCount((prev) => prev + 1);
		} catch (error) {
			console.warn('Error [PostComment]', error);
		}
	};

	useEffect(() => {
		setCommentsLoaded(false);
		if (!comments) return;
		setCommentsLoaded(true);
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

	const bottomSheetRef = ref as React.RefObject<BottomSheetModal>;

	useEffect(() => {
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				bottomSheetRef?.current?.snapToIndex(1);
			},
		);

		return () => {
			keyboardDidHideListener.remove();
		};
	}, []);

	return (
		<BottomSheetModal
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
						<KeyboardAvoidingView
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
							keyboardVerticalOffset={70}>
							<View
								style={{
									width: '100%',
									justifyContent: 'center',
									alignItems: 'center',
									marginBottom: 20,
									height: 35,
								}}>
								<ThemedText
									theme={theme}
									value={'Comments'}
									style={[defaultStyles.biggerText]}
								/>
							</View>

							<View
								style={{
									height:
										Dimensions.get('window').height * 0.7 -
										insets.bottom * 7.5 -
										55,
								}}>
								{comments.length > 0 ? (
									<FlatList
										showsVerticalScrollIndicator={false}
										// initialNumToRender={3}
										// maxToRenderPerBatch={5}
										// windowSize={1}
										scrollEnabled={true}
										data={comments}
										extraData={comments}
										renderItem={({ item: comment, index }) => {
											const replies = comments.filter(
												(val) => val.replyTo === comment.Id,
											);

											return (
												<View>
													{!comment.replyTo && (
														<CommentRow
															liked={comment.liked}
															postId={props.postId}
															key={index}
															style={{
																backgroundColor: Colors[theme].background2,
															}}
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
										keyExtractor={(item, index) => item.Id.toString()}
									/>
								) : (
									<View
										style={{
											height:
												Dimensions.get('window').height * 0.7 -
												insets.bottom * 7.5 -
												55,
											width: Dimensions.get('window').width,
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
							</View>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									backgroundColor: Colors[theme].background2,
									borderTopWidth: StyleSheet.hairlineWidth,
									borderTopColor: Colors[theme].textPrimary,
									paddingBottom: insets.bottom,
									width: '100%',
								}}>
								<BottomSheetTextInput
									cursorColor={Colors.default.primary}
									maxLength={TextInputMaxCharacters.SmallDescription}
									onChangeText={setText}
									value={text}
									style={[
										{
											padding: 20,
											fontSize: 16,
											color: Colors[theme].textPrimary,
											width: '85%',
										},
									]}
									placeholderTextColor={Colors[theme].gray}
									placeholder={`A comment for ${username}`}
								/>
								<TouchableOpacity
									onPress={onSend}
									style={{ paddingHorizontal: 14, width: '15%' }}>
									<Ionicons
										name="send-outline"
										size={defaultHeaderBtnSize - 6}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</View>
						</KeyboardAvoidingView>
					</View>
				) : (
					<CrahActivityIndicator size={'large'} color={'gray'} />
				)}
			</BottomSheetView>
			{/*  */}
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({});

export default PostCommentSection;
