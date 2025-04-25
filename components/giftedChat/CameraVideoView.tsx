import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated';

interface CameraVideoViewProps {
	video: string;
	setVideo: (s: string | undefined) => void;
	saveVideo: (s: string) => void;
}

const CameraVideoView: React.FC<CameraVideoViewProps> = ({
	video,
	setVideo,
	saveVideo,
}) => {
	const videoPlayer = useVideoPlayer(video, (player) => {
		player.loop = true;
		player.play();
	});

	return (
		<Animated.View
			layout={LinearTransition}
			entering={FadeIn}
			exiting={FadeOut}>
			<View
				style={{
					flexDirection: 'row',
					gap: 12,
					justifyContent: 'center',
					alignItems: 'flex-end',
					flex: 1,
				}}>
				<View
					style={[styles.buttonContainer, { justifyContent: 'space-around' }]}>
					<TouchableOpacity
						onPress={() => setVideo(undefined)}
						style={styles.buttonBackground}>
						<Ionicons size={24} color={'white'} name={'refresh-outline'} />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => saveVideo(video)}
						style={styles.buttonBackground}>
						<Ionicons size={24} color={'white'} name={'checkmark-outline'} />
					</TouchableOpacity>
				</View>
			</View>
			<VideoView
				player={videoPlayer}
				style={{
					width: '100%',
					height: '100%',
				}}
				allowsFullscreen
				nativeControls={true}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginBottom: 32,
		paddingHorizontal: 30,
	},
	buttonBackground: {
		padding: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 1000,
	},
});

export default CameraVideoView;
