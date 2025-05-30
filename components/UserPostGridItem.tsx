import { View, Text, ViewStyle, StyleSheet, Image } from 'react-native';
import React from 'react';
import ThemedView from './general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './general/ThemedText';
import { RawPost } from '@/types';

interface UserPostGridItemProps {
	post: RawPost;
	style: ViewStyle | ViewStyle[];
}

const UserPostGridItem: React.FC<UserPostGridItemProps> = ({ post, style }) => {
	const theme = useSystemTheme();

	return (
		<ThemedView theme={theme} style={style} flex={0}>
			<Image
				style={{ width: '100%', height: '100%' }}
				source={{
					uri: `https://pub-78edb5b6f0d946d28db91b59ddf775af.r2.dev/${post.CoverSourceKey}`,
				}}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({});

export default UserPostGridItem;
