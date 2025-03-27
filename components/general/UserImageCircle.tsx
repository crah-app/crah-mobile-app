import * as React from 'react';
import { StyleSheet, Image, ImageStyle } from 'react-native';

interface UserImageCircleProps {
	imageUri: string;
	height: number;
	width: number;
	style?: ImageStyle | ImageStyle[];
}

const UserImageCircle: React.FC<UserImageCircleProps> = ({
	imageUri,
	height,
	width,
	style,
}) => {
	const ParsedUri = JSON.parse(imageUri);

	return (
		<Image
			height={height}
			width={width}
			source={{ uri: ParsedUri }}
			style={[styles.wrapper, style]}
		/>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		borderRadius: 1000,
		borderWidth: 2,
		borderColor: 'red',
	},
});

export default UserImageCircle;
