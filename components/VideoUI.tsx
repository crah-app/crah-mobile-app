import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface VideoUIInterface {
	theme: 'light' | 'dark';
	handleVideoPlayer: any;
	isPlaying: boolean;
}

export const VideoUIBtns: React.FC<VideoUIInterface> = ({
	theme,
	handleVideoPlayer,
	isPlaying,
}) => {
	const playBtnColor = theme === 'dark' ? 0 : 255;

	return (
		<TouchableOpacity
			onPress={handleVideoPlayer}
			style={styles.playBtn}
			activeOpacity={0.8}>
			{!isPlaying && (
				<View
					style={{
						padding: 12,
						backgroundColor:
							'gray' +
							`rgba(${playBtnColor},${playBtnColor},${playBtnColor},0.5)`,
						borderRadius: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Ionicons
						name={isPlaying ? 'pause' : 'play'}
						size={24}
						color={'gray' + `rgba(${255},${255},${255},0.8)`}
						style={{ textAlign: 'center', marginLeft: 2 }}
					/>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	playBtn: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
});
