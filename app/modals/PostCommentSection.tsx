import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';

const PostPage = () => {
	const { data } = useLocalSearchParams();
	const theme = useSystemTheme();
	const comments = JSON.parse(data) || [];

	const renderComment = ({ item }) => (
		<View style={styles.commentContainer}>
			<ThemedText theme={theme} style={styles.commentText} value={item.text} />
			<ThemedText
				theme={theme}
				style={styles.commentAuthor}
				value={item.username}
			/>
		</View>
	);

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			<FlatList
				data={comments}
				renderItem={renderComment}
				keyExtractor={(item, index) => index.toString()}
			/>
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
