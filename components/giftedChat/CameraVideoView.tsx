import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated';
import ThemedView from '../general/ThemedView';

interface CameraVideoViewProps {
	video: string;
	setVideo: (s: string | undefined) => void;
	saveVideo: (s: string) => void;
	theme: 'light' | 'dark';
}

const CameraVideoView: React.FC<CameraVideoViewProps> = ({
	video,
	setVideo,
	saveVideo,
	theme,
}) => {
	const videoPlayer = useVideoPlayer(video, (player) => {
		player.loop = true;
		player.play();
	});

	return (
		<ThemedView theme={theme} flex={1}>
			<View
				style={{
					zIndex: 1,
					position: 'absolute',
					flexDirection: 'row',
					width: Dimensions.get('window').width,
					height: Dimensions.get('window').height,
				}}>
				<View
					style={[styles.buttonContainer, { justifyContent: 'space-between' }]}>
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
					width: Dimensions.get('window').width,
					height: Dimensions.get('window').height,
				}}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginBottom: 80,
		paddingHorizontal: 30,
	},
	buttonBackground: {
		padding: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 1000,
	},
});

export default CameraVideoView;
