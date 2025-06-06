import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
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
}) => {
	const theme = useSystemTheme();

	const commentTimeAgo = formatDistanceToNow(new Date(date), {
		addSuffix: true,
	});

	const [responsesContainerOpen, setResponsesContainerOpen] =
		useState<boolean>(false);

	const [text, setText] = useState(commentText);
	const [highlightWords, setHighlightWords] = useState<string[]>([]);

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

	const RenderRightComponent = () => {
		return (
			<View
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					marginRight: 5,
					gap: 3,
				}}>
				<TouchableOpacity>
					<Ionicons name={'heart-outline'} size={22} color={'gray'} />
				</TouchableOpacity>
				<Text style={{ color: 'gray' }}>{likes}</Text>
			</View>
		);
	};

	const RenderTextInTitleComponent = () => {
		return (
			<ThemedText
				style={{ fontSize: 12, color: 'gray' }}
				theme={theme}
				value={commentTimeAgo}
			/>
		);
	};

	const RenderBottomContainer = () => {
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
							onPress={() =>
								setResponsesContainerOpen(!responsesContainerOpen)
							}>
							<ThemedText
								style={{ fontSize: 14, color: 'gray', width: 120 }}
								theme={theme}
								value={`${responsesContainerOpen ? 'close' : 'see'} ${
									responses || 0
								} responses`}
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
								key={index}
								username={reply.user.username}
								avatar={reply.avatar}
								text={reply.text}
								userId={reply.user.id}
								commentId={reply._id}
								likes={reply.likes}
								responses={0}
								date={reply.createdAt}
								purpose={reply.purpose}
								type={reply.type}
								style={{
									backgroundColor: Colors[theme].surface,
								}}
								replies={undefined}
							/>
						))}
					</View>
				)}
			</View>
		);
	};

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
						<RenderRightComponent />
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
				textInTitleComponent={
					<View>
						<RenderTextInTitleComponent />
					</View>
				}
				bottomContainer={<RenderBottomContainer />}
				textContainerStyle={{ width: purpose === 'reply' ? 40 : 'auto' }}
				costumAvatarHeight={purpose === 'reply' ? 32 : 46}
				costumAvatarWidth={purpose === 'reply' ? 32 : 46}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default CommentRow;
