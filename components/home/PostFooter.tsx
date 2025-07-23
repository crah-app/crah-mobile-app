import React, { useEffect } from 'react';
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
	reactions: Record<string, { amount: number; name: string }>;
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

			{/* reaction container */}
			{Object.keys(reactions).length > 0 && (
				<ScrollView
					showsHorizontalScrollIndicator={false}
					horizontal
					style={{
						maxWidth: '100%',
						flexDirection: 'row',
						overflowX: 'hidden',
						// bottom: 28,
					}}>
					<View style={{ flexDirection: 'row', gap: 12 }}>
						{Object.keys(reactions).map((reaction: string, index: number) => {
							const codePointStr = reaction;
							const codePointNum = parseInt(codePointStr, 16);

							const emoji = String.fromCodePoint(codePointNum);

							return (
								<View
									style={{
										flexDirection: 'row',
										gap: 6,
										alignItems: 'center',
									}}
									key={index + 'Container'}>
									<Text key={index} style={{ fontSize: 16 }}>
										{emoji}
									</Text>

									<Text
										key={index + 'Text'}
										style={[
											{
												color: Colors[theme].textPrimary,
												fontSize: 16,
												fontWeight: 'bold',
											},
										]}>
										{reactions[reaction].amount}
									</Text>
								</View>
							);
						})}
					</View>
				</ScrollView>
			)}

			{/* lower footer */}
			<View>
				<View style={{ height: 'auto' }}>
					<View
						style={[
							{
								flexDirection: 'column',
								overflow: 'hidden',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
								marginTop: 2,
								gap: 10,
							},
						]}>
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
});

export default PostFooter;
