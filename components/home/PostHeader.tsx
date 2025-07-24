import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { RawPost } from '@/types';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { defaultHeaderBtnSize } from '@/constants/Styles';

interface Props {
	post: RawPost;
	postTimeAgo: string;
	optionsModalVisible: boolean;
	setOptionsModalVisible: Dispatch<SetStateAction<boolean>>;
}

const PostHeader: React.FC<Props> = ({
	post,
	postTimeAgo,
	optionsModalVisible,
	setOptionsModalVisible,
}) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const onHeaderPress = () => {
		router.push({
			pathname: '/sharedPages/userProfile',
			params: {
				userId: post.UserId,
				self: user?.id !== post.UserId ? 'false' : 'true',
				linking: 'true',
			},
		});
	};

	const handlePostOptionsPress = () => {
		setOptionsModalVisible((prev) => !prev);
	};

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}>
			{/* left side */}
			<View>
				<TouchableOpacity onPress={onHeaderPress}>
					<View style={styles.header}>
						<Image
							source={{ uri: post.UserAvatar }}
							style={styles.profileImage}
						/>

						<View style={{ flexDirection: 'column', gap: 2 }}>
							<Text
								style={[styles.username, { color: Colors[theme].textPrimary }]}>
								{post.UserName}
							</Text>

							<Text style={[{ color: Colors[theme].gray, fontSize: 14 }]}>
								{post.Title}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
				<Text style={[styles.postTime, { color: 'gray' }]}>{postTimeAgo}</Text>
			</View>
			{/* right side */}
			<View>
				<TouchableOpacity
					style={{ paddingVertical: 12 }}
					onPress={handlePostOptionsPress}>
					<Ionicons
						name="ellipsis-vertical-outline"
						size={defaultHeaderBtnSize - 12}
						color={Colors[theme].textSecondary}
					/>
				</TouchableOpacity>
			</View>
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
