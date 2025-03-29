import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import CommentRow from '@/components/rows/CommentRow';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Text,
	StyleSheet,
	View,
	ListRenderItem,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { CommentPurpose, userCommentType, userPostType } from '@/types';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import Colors from '@/constants/Colors';
import {
	Bubble,
	Composer,
	GiftedChat,
	IMessage,
	InputToolbar,
} from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { QuickReplies } from 'react-native-gifted-chat/lib/QuickReplies';

const PostPage = () => {
	const { data } = useLocalSearchParams();
	const theme = useSystemTheme();

	const [comments, setComments] = useState<IMessage[]>(
		JSON.parse(data as string) || [],
	);
	const [commentsLoaded, setCommentsLoaded] = useState(false);

	useEffect(() => {
		setCommentsLoaded(false);

		if (!comments) return;

		setCommentsLoaded(true);
		// console.log('comments:', comments);
	}, [comments]);

	const onSend = (comments: IMessage[]) => {
		setComments((previousMessages) =>
			GiftedChat.append(previousMessages, comments),
		);
	};

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			{commentsLoaded ? (
				<View />
			) : (
				// <GiftedChat
				// 	isKeyboardInternallyHandled={true}
				// 	renderAvatar={null}
				// 	messages={comments}
				// 	onSend={(comments) => onSend(comments)}
				// 	user={{
				// 		_id: 101, // post id
				// 	}}
				// 	onInputTextChanged={setText}
				// 	// left action: add btn
				// 	renderActions={(props) => (
				// 		<View
				// 			style={{
				// 				alignItems: 'center',
				// 				justifyContent: 'center',
				// 				height: 44,
				// 			}}>
				// 			<RenderRightInputButton props={props} />
				// 		</View>
				// 	)}
				// 	renderSend={(props) => (
				// 		<View
				// 			style={{
				// 				alignItems: 'center',
				// 				justifyContent: 'center',
				// 				height: 44,
				// 			}}>
				// 			{text.length > 0 ? (
				// 				<RenderSendText props={props} />
				// 			) : (
				// 				<RenderSendEmptyText props={props} />
				// 			)}
				// 		</View>
				// 	)}
				// 	textInputProps={[styles.composer]}
				// 	renderBubble={(props) => <RenderBubble props={props} />}
				// 	listViewProps={{
				// 		keyboardShouldPersistTaps: 'handled',
				// 		keyboardDismissMode:
				// 			Platform.OS === 'ios' ? 'interactive' : 'on-drag',
				// 	}}
				// 	renderInputToolbar={(props) => (
				// 		<InputToolbar
				// 			{...props}
				// 			containerStyle={{
				// 				backgroundColor: Colors[theme].surface,
				// 			}}
				// 		/>
				// 	)}
				// 	renderQuickReplies={(props) => (
				// 		<QuickReplies color={Colors[theme].primary} {...props} />
				// 	)}
				// 	renderComposer={(props) => (
				// 		<Composer
				// 			{...props}
				// 			textInputStyle={{ color: Colors[theme].textPrimary }}
				// 		/>
				// 	)}
				// 	focusOnInputWhenOpeningKeyboard={true}
				// />
				<View></View>
				// <FlatList
				// 	scrollEnabled={false}
				// 	data={comments}
				// 	renderItem={({ item: _, index }) => (
				// 		<CommentRow
				// 			key={index}
				// 			userId={_.userId}
				// 			avatar={_.avatar}
				// 			text={_.text}
				// 			responses={_.responses}
				// 			likes={_.likes}
				// 			date={new Date(_.date)}
				// 			username={_.username}
				// 			purpose={_.type as CommentPurpose}
				// 			commentId={_.commentId}
				// 		/>
				// 	)}
				// 	keyExtractor={(item, index) => index.toString()}
				// />
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	commentContainer: {
		marginBottom: 10,
		padding: 10,
		borderRadius: 8,
		backgroundColor: '#f4f4f4',
		borderWidth: 1,
		borderColor: '#ddd',
	},
	commentText: {
		fontSize: 14,
		color: '#333',
	},
	commentAuthor: {
		marginTop: 5,
		fontSize: 12,
		color: '#666',
	},
	composer: {
		paddingHorizontal: 10,
		paddingTop: 8,
		fontSize: 16,
		marginVertical: 4,
	},
});

export default PostPage;
