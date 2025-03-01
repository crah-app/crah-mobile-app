import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import ThemedView from './general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './general/ThemedText';

interface UserPostGridItemProps {
	post: any;
	style: ViewStyle | ViewStyle[];
}

const UserPostGridItem: React.FC<UserPostGridItemProps> = ({ post, style }) => {
	const theme = useSystemTheme();

	return (
		<ThemedView theme={theme} style={[style]}>
			<ThemedText theme={theme} value="LOL" />
		</ThemedView>
	);
};

const styles = StyleSheet.create({});

export default UserPostGridItem;
