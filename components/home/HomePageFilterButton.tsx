import React from 'react';
import {
	GestureResponderEvent,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface HomePageFilterButtonProps {
	text: string;
	style?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle | TextStyle[];
	onPress: (type: GestureResponderEvent) => void;
}

const HomePageFilterButton: React.FC<HomePageFilterButtonProps> = ({
	text,
	style,
	textStyle,
	onPress,
}) => {
	const theme = useSystemTheme();
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.container,
				{
					backgroundColor: Colors[theme].background,
					borderBottomWidth: 2,
				},
				style,
			]}>
			<ThemedText
				lineNumber={1}
				value={text}
				theme={theme}
				// @ts-ignore
				style={[styles.text, textStyle]}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 5,
	},
	text: {
		textAlign: 'center',
		fontWeight: 600,
		fontSize: 16,
	},
});

export default HomePageFilterButton;
