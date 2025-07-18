import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import ThemedText from '../general/ThemedText';
import { RawPost } from '@/types';
import { VideoUIBtns } from '../VideoUI';
import { useDynamicDimensions } from '@/hooks/useDynamicRatioDimensions';

const RenderPostContent = ({
	post,
	theme,
}: {
	post: RawPost;
	theme: 'light' | 'dark';
}) => {
	const mediaUrl = `https://pub-78edb5b6f0d946d28db91b59ddf775af.r2.dev/${post.SourceKey}`;

	const { width, height } = useDynamicDimensions(
		post.sourceWidth,
		post.sourceHeight,
	);

	switch (post.Type) {
		case 'Video':
			const player = useVideoPlayer(mediaUrl, (player) => {
				player.loop = true;
			});

			const { isPlaying } = useEvent(player, 'playingChange', {
				isPlaying: player.playing,
			});

			const handleVideoPlayer = () => {
				isPlaying ? player.pause() : player.play();
			};

			return (
				<View
					style={[
						styles.contentContainer,
						{ backgroundColor: Colors[theme].absoluteContrast },
					]}>
					<VideoView
						player={player}
						style={{
							width: width,
							height: height,
							alignSelf: 'center',
						}}
						contentFit={'contain'} // or cover
						nativeControls={false}
					/>

					<VideoUIBtns
						theme={theme}
						handleVideoPlayer={handleVideoPlayer}
						isPlaying={isPlaying}
					/>
				</View>
			);
		case 'Image':
			return (
				<Image
					source={{
						uri: mediaUrl,
					}}
					style={[
						styles.image,
						{
							width: Dimensions.get('window').width,
							height: Dimensions.get('window').width,
						},
					]}
				/>
			);
		case 'Article':
			return (
				<Link
					asChild
					href={{
						pathname: '/modals/postView',
						params: { data: JSON.stringify(post), type: post.Type },
					}}
					style={[styles.textPost]}>
					<TouchableOpacity>
						<ThemedText
							style={[
								styles.articlePreview,
								{ color: Colors[theme].textPrimary },
							]}
							theme={theme}
							value={`${post.Content?.slice(0, 150)}...`}
						/>
					</TouchableOpacity>
				</Link>
			);
		case 'Text':
			return (
				<Text style={[styles.textPost, { color: Colors[theme].textPrimary }]}>
					{post.Description}
				</Text>
			);

		case 'Music':
			return (
				<View>
					<ThemedText theme={theme} value={'music lol'} />
				</View>
			);
	}
};

const styles = StyleSheet.create({
	image: {
		width: '100%',
		resizeMode: 'cover',
	},
	articlePreview: {
		fontSize: 14,
	},
	textPost: {
		padding: 10,
		fontSize: 14,
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default RenderPostContent;
