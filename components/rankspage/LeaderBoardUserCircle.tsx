import { StyleSheet, ImageStyle } from 'react-native';
import UserImageCircle from '../general/UserImageCircle';
import React from 'react';

interface LeaderBoardUserCircleProps {
	width: number;
	height: number;
	rank: number;
	imageUri: string;
	style?: ImageStyle | ImageStyle[];
}

const LeaderBoardUserCircle: React.FC<LeaderBoardUserCircleProps> = ({
	width,
	height,
	rank,
	imageUri,
	style,
}) => {
	return (
		<UserImageCircle
			width={width}
			height={height}
			imageUri={imageUri}
			style={[styles.image, style as ImageStyle]}
		/>
	);
};

const styles = StyleSheet.create({
	image: {
		borderWidth: 0,
	},
});

export default LeaderBoardUserCircle;
