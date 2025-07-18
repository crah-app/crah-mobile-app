import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { RawPost } from '@/types';

const PostHeader: React.FC<{ post: RawPost; postTimeAgo: string }> = ({
	post,
	postTimeAgo,
}) => {
	const theme = useSystemTheme();

	return (
		<View>
			<View style={styles.header}>
				<Image source={{ uri: post.UserAvatar }} style={styles.profileImage} />

				<View style={{ flexDirection: 'column', gap: 2 }}>
					<Text style={[styles.username, { color: Colors[theme].textPrimary }]}>
						{post.UserName}
					</Text>

					<Text style={[{ color: Colors[theme].gray, fontSize: 14 }]}>
						{post.Title}
					</Text>
				</View>
			</View>
			<Text style={[styles.postTime, { color: 'gray' }]}>{postTimeAgo}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	username: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	postTime: {
		fontSize: 12,
		paddingLeft: 10,
		marginBottom: 15,
		marginTop: -1,
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
});

export default PostHeader;
