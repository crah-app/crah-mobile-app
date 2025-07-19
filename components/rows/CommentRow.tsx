import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
	Text,
	Dimensions,
} from 'react-native';
import Row from '../general/Row';
import { CommentPurpose, CommentType, userCommentType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { formatDistanceToNow } from 'date-fns';
import ThemedText from '../general/ThemedText';
import { useAuth, useUser } from '@clerk/clerk-expo';

interface CommentRowProps {
	username: string | null;
	avatar: string;
	text: string;
	userId: string;
	commentId: number;
	likes: number;
	responses: number;
	date: number | Date;
	purpose: CommentPurpose;
	type?: CommentType;
	style?: ViewStyle | ViewStyle[];
	replies: undefined | userCommentType[];
	postId: number;
	liked: boolean;
}

const CommentRow: React.FC<CommentRowProps> = ({
	username,
	avatar,
	text: commentText,
	userId,
	commentId,
	likes,
	responses,
	date,
	purpose,
	type,
	style,
	replies,
	postId,
	liked,
}) => {
	const theme = useSystemTheme();

	const commentTimeAgo = formatDistanceToNow(new Date(date), {
		addSuffix: true,
	});

	const [responsesContainerOpen, setResponsesContainerOpen] =
		useState<boolean>(false);

	const [text, setText] = useState(commentText);
	const [highlightWords, setHighlightWords] = useState<string[]>([]);

	const [commentLikes, setCommentLikes] = useState<number>(likes);

	const extractMentions = (text: string) => {
		const mentionRegex = /@(\w+)/g;
		const matches = text.match(mentionRegex);
		return matches || [];
	};

	const checkUsersInDatabase = async (mentions: string[]) => {
		// const existingUsers = await fetchExistingUsersFromDB(mentions);
		// return mentions.filter((user) =>
		// 	existingUsers.includes(user.replace('@', '')),
		// );
		return mentions;
	};

	useEffect(() => {
		const mentions = extractMentions(text);
		checkUsersInDatabase(mentions).then((validMentions) => {
			setHighlightWords(validMentions);
		});
	}, [text]);

	return (
		<View>
			<Row
				highlightWords={highlightWords}
				containerStyle={[
					// @ts-ignore
					style,
					styles.container,
					{
						width:
							purpose === 'reply'
								? Dimensions.get('window').width - 46 - 10 - 10
								: Dimensions.get('window').width,
					},
				]}
				title={username ?? 'no username'}
				subtitle={text}
				avatarUrl={avatar}
				showAvatar={true}
				customRightComponent={
					<View
						style={{
							marginHorizontal: 10,
							marginTop: 10,
							justifyContent: 'flex-start',
							flex: 1,
						}}>
						<RenderRightComponent
							setLikes={setCommentLikes}
							likes={commentLikes}
							commentId={commentId}
							postId={postId}
							liked={liked}
						/>
					</View>
				}
				titleStyle={{ fontSize: 14 }}
				subtitleStyle={{
					color: Colors[theme].textPrimary,
					fontWeight: 'light',
				}}
				subtitleIsMultiline={true}
				leftContainerStyle={{
					height: '100%',
					justifyContent: 'flex-start',
				}}
				textInTitleComponent={<RenderTextInTitleComponent date={date} />}
				bottomContainer={
					<RenderBottomContainer
						liked={liked}
						setLikes={setCommentLikes}
						postId={postId}
						responses={responses}
						replies={replies}
						setResponsesContainerOpen={setResponsesContainerOpen}
						responsesContainerOpen={responsesContainerOpen}
						purpose={purpose}
					/>
				}
				textContainerStyle={{ width: purpose === 'reply' ? 40 : 'auto' }}
				costumAvatarHeight={purpose === 'reply' ? 32 : 46}
				costumAvatarWidth={purpose === 'reply' ? 32 : 46}
			/>
		</View>
	);
};

const RenderRightComponent: React.FC<{
	likes: number;
	commentId: number;
	postId: number;
	setLikes: Dispatch<SetStateAction<number>>;
	liked: boolean;
}> = ({ likes, commentId, postId, setLikes, liked }) => {
	const { user } = useUser();
	const { getToken } = useAuth();

	const [like, setLike] = useState<boolean>(liked);

	const onCommentLikePress = async () => {
		setLike((prev) => !prev);
		setLikes((prev) => {
			if (!like) {
				return prev + 1;
			}

			return prev - 1;
		});

		try {
			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/posts/comment/${commentId}/like/${user?.id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ like: !like }),
				},
			);

			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}
		} catch (error) {
			console.warn('Error [RenderRightComponent: onCommentLikePress]', error);
		}
	};

	return (
		<View
			style={{
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				marginRight: 5,
				gap: 3,
			}}>
			<TouchableOpacity onPress={onCommentLikePress}>
				<Ionicons
					name={like ? 'heart' : 'heart-outline'}
					size={22}
					color={like ? Colors.default.primary : 'gray'}
				/>
			</TouchableOpacity>
			<Text style={{ color: 'gray' }}>{likes}</Text>
		</View>
	);
};

const RenderTextInTitleComponent: React.FC<{ date: number | Date }> = ({
	date,
}) => {
	const theme = useSystemTheme();
	const commentTimeAgo = formatDistanceToNow(new Date(date), {
		addSuffix: true,
	});
	return (
		<ThemedText
			style={{ fontSize: 12, color: 'gray' }}
			theme={theme}
			value={commentTimeAgo}
		/>
	);
};

const RenderBottomContainer: React.FC<{
	responses: number;
	replies: userCommentType[] | undefined;
	setResponsesContainerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	responsesContainerOpen: boolean;
	purpose: CommentPurpose;
	postId: number;
	setLikes: Dispatch<SetStateAction<number>>;
	liked: boolean;
}> = ({
	responses,
	replies,
	setResponsesContainerOpen,
	responsesContainerOpen,
	purpose,
	postId,
	setLikes,
	liked,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={{ width: '100%', flexDirection: 'column' }}>
			<View
				style={{
					width: '100%',
					marginTop: 4,
					flexDirection: 'row',
					gap: 8,
				}}>
				{responses > 0 && (
					<TouchableOpacity
						onPress={() => setResponsesContainerOpen(!responsesContainerOpen)}>
						<ThemedText
							style={{ fontSize: 14, color: 'gray', width: 120 }}
							theme={theme}
							value={`${
								responsesContainerOpen ? 'close' : 'see'
							} ${responses} responses`}
						/>
					</TouchableOpacity>
				)}

				<TouchableOpacity>
					<ThemedText
						style={{ fontSize: 14, color: 'gray' }}
						theme={theme}
						value={'respond'}
					/>
				</TouchableOpacity>
			</View>

			{((responsesContainerOpen && replies?.length) || 0) > 0 && (
				<View style={{ left: 0 }}>
					{replies?.map((reply, index) => (
						<CommentRow
							liked={liked}
							key={index}
							username={reply.UserName}
							avatar={reply.UserAvatar}
							text={reply.Message}
							userId={reply.UserId}
							commentId={reply.Id}
							likes={reply.likes}
							responses={0}
							date={reply.CreatedAt}
							purpose={reply.purpose}
							type={reply.type}
							style={{ backgroundColor: Colors[theme].surface }}
							replies={undefined}
							postId={postId}
						/>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default CommentRow;
