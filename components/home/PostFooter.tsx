import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '../general/ThemedView';
import ThemedText from '../general/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { RawPost } from '@/types';

interface PostFooterProps {
	likesCount: number;
	handleLike: () => void;
	handleShare: () => void;
	commentsCount: number;
	post: RawPost;
	shareCount: number;
	reactions: string[];
	setShowReactions: (boolean: boolean) => void;
	onCommentsBtnPress: () => void;
	currentUserLiked: boolean | undefined;
}

const PostFooter: React.FC<PostFooterProps> = ({
	likesCount,
	commentsCount,
	handleLike,
	handleShare,
	post,
	shareCount,
	setShowReactions,
	reactions,
	onCommentsBtnPress,
	currentUserLiked,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.footer]}>
			<View style={[styles.upper_footer]}>
				{/* <left side of the footer> */}
				<View style={styles.footerLeft}>
					{/* like button */}
					<View style={styles.iconButton}>
						<TouchableOpacity onPress={handleLike}>
							<Ionicons
								name={currentUserLiked ? 'heart' : 'heart-outline'}
								size={24}
								color={
									currentUserLiked
										? Colors[theme].primary
										: Colors[theme].textPrimary
								}
							/>
						</TouchableOpacity>

						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{likesCount}
						</Text>
					</View>

					{/* comment button */}
					<TouchableOpacity
						onPress={onCommentsBtnPress}
						style={styles.iconButton}>
						<Ionicons
							name="chatbubble-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{commentsCount}
						</Text>
					</TouchableOpacity>

					{/* share button */}
					<TouchableOpacity style={styles.iconButton} onPress={handleShare}>
						<Ionicons
							name="share-social-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
						<Text
							style={[styles.iconCount, { color: Colors[theme].textPrimary }]}>
							{shareCount}
						</Text>
					</TouchableOpacity>
				</View>

				{/* reaction button <right side of the footer> */}
				<TouchableOpacity onPress={() => setShowReactions(true)}>
					<Ionicons
						name="happy-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</TouchableOpacity>
			</View>

			{/* lower footer */}
			<View
				style={[
					// styles.lower_footer,
					{
						// height: 200,
						// height: 40,
						// post.type == 'videoPortrait' ||
						// post.type == 'videoLandscape' ||
						// post.type == 'image'
						// 	? reactions.length > 0
						// 		? 145
						// 		: 0
						// 	: reactions.length > 0
						// 	? 145
						// 	: 0,
					},
				]}>
				{/* Reactions in a vertical bubble */}
				<View style={{ height: 'auto' }}>
					{/* // reaction and counter container */}
					<View
						style={[
							{
								// padding: 10,
								// borderRadius: 25,
								// backgroundColor: 'rgba(100,100,100,0.3)',
								flexDirection: 'column',
								overflow: 'hidden',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								marginTop: 2,
								gap: 10,
							},
						]}>
						{/* reaction container */}
						{reactions.length > 0 && (
							<ScrollView
								showsHorizontalScrollIndicator={false}
								horizontal
								style={{
									backgroundColor: 'rgba(100,100,100,0.3)',
									borderRadius: 20,
									paddingHorizontal: 12,
									maxWidth: '100%',
									flexDirection: 'row',
									overflowX: 'hidden',
								}}>
								<View style={{ flexDirection: 'row', gap: 12 }}>
									{reactions.map((reaction: string, index: number) => (
										<View
											style={{
												flexDirection: 'row',
												gap: 6,
												// backgroundColor: 'rgba(100,100,100,0.3)',
												paddingVertical: 10,
												borderRadius: 20,
												height: 40,
											}}
											key={index + 'Container'}>
											<Text key={index} style={{}}>
												{reaction}
											</Text>

											<Text
												key={index + 'Text'}
												style={[
													{
														color: Colors[theme].textPrimary,
														fontSize: 14,
														fontWeight: 'bold',
													},
												]}>
												{2322}
											</Text>
										</View>
									))}
								</View>
							</ScrollView>
						)}

						{/* description */}
						<ThemedView
							theme={theme}
							style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							<ThemedText
								style={{ fontWeight: 'bold', marginRight: 4.5 }}
								theme={theme}
								value={post.UserName}
							/>
							<ThemedText theme={theme} value={post.Description} />
						</ThemedView>
					</View>
				</View>
			</View>
			{/*  */}
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		gap: 12,
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	lower_footer: {
		marginTop: 4,
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	writeCommentBar: {},
	upper_footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	footerLeft: {
		flexDirection: 'row',
	},
	iconButton: {
		marginRight: 15,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 5,
	},
	iconCount: {
		fontSize: 13,
		fontWeight: '600',
	},
	reactionCountContainer: {
		fontWeight: 'bold',
		borderRadius: '100%',
		fontSize: 12,
	},
});

export default PostFooter;
