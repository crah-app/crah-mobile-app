import Colors from '@/constants/Colors';
import React from 'react';
import {
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import ThemedText from './general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';

interface PostTypeButtonProps {
	val: string;
	click_action: () => void | any;
	style?: ViewStyle | ViewStyle[];
	fontStyle?: TextStyle | TextStyle[];
}

const PostTypeButton: React.FC<PostTypeButtonProps> = ({
	val,
	click_action,
	style,
	fontStyle,
}) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			style={[
				styles.FilterButton,
				{ backgroundColor: Colors[theme].primary },
				style,
			]}
			onPress={click_action}>
			<ThemedText
				theme={theme}
				value={val}
				// @ts-ignore
				style={[styles.FilterButtonText, fontStyle]}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	flatListContainer: {
		paddingHorizontal: 15,
		paddingTop: 10,
		paddingBottom: 100,
	},
	popUpInnerWrapper: {
		position: 'absolute',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 5,
		borderRadius: 20,
		overflow: 'hidden',
	},
	PopUpBackground: {
		flex: 1,
		backgroundColor: '#000000cc',
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingVertical: 10,
		alignItems: 'center',
	},
	main: {
		width: '100%',
		paddingHorizontal: 20,
	},
	FilterGrid: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 10,
		height: '100%',
	},
	FilterButton: {
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		width: 200,
	},
	FilterButtonText: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
});

export default PostTypeButton;
