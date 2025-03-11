import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import CommentRow from '@/components/rows/CommentRow';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet, View, ListRenderItem } from 'react-native';
import { CommentPurpose, userCommentType, userPostType } from '@/types';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import Colors from '@/constants/Colors';

const PostPage = () => {
	const { data } = useLocalSearchParams();
	const theme = useSystemTheme();
	const comments: userCommentType = JSON.parse(data as string).comments || [];

	const [commentsLoaded, setCommentsLoaded] = useState(false);

	useEffect(() => {
		setCommentsLoaded(false);

		if (!comments) return;

		setCommentsLoaded(true);
		console.log(comments);
	}, [comments]);

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			{commentsLoaded ? (
				<FlatList
					scrollEnabled={false}
					data={[comments]}
					renderItem={({ item: _, index }) => (
						<CommentRow
							key={index}
							userId={_.userId}
							avatar={_.avatar}
							text={_.text}
							responses={_.responses}
							likes={_.likes}
							date={new Date(_.date)}
							username={_.username}
							purpuse={_.type as CommentPurpose}
							commentId={_.commentId}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			) : (
				<CrahActivityIndicator size={'large'} color={Colors[theme].primary} />
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
});

export default PostPage;
