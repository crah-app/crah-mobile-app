import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// currently only for articles to display the whole text
const PostPage = () => {
	const { data, type } = useLocalSearchParams();
	const theme = useSystemTheme();
	const postData = JSON.parse(data as string);
	const article = postData.article;

	return (
		<ThemedView theme={theme} flex={1}>
			<ThemedText
				value={`Post from ${postData.username}`}
				theme={theme}
				style={[styles.container, styles.title]}
			/>

			<ThemedText value={article} theme={theme} style={styles.container} />
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
	},
});

export default PostPage;
