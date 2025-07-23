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
import { defaultHeaderBtnSize } from '@/constants/Styles';
import { ionicon } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface PostTypeButtonProps {
	val: string;
	click_action: () => void | any;
	style?: ViewStyle | ViewStyle[];
	fontStyle?: TextStyle | TextStyle[];
	isIcon?: boolean;
	icon?: ionicon;
	revert?: boolean;
	splitBackground?: boolean;
	splitBackgroundColors?: string[];
}

const PostTypeButton: React.FC<PostTypeButtonProps> = ({
	val,
	click_action,
	style,
	fontStyle,
	isIcon = false,
	icon,
	revert = false,
	splitBackground = false,
	splitBackgroundColors = [],
}) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			style={[
				{
					backgroundColor: revert ? 'rgb(105, 0, 0)' : Colors[theme].primary,
					borderBottomColor: revert
						? Colors[theme].bgPrimary
						: 'rgb(105, 0, 0)',
				},
				styles.FilterButton,
				style,
			]}
			onPress={click_action}>
			{splitBackground && (
				<View style={StyleSheet.absoluteFill}>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						{splitBackgroundColors.map((backgroundColor, i) => (
							<View
								style={{
									flex: 1,
									backgroundColor,
									borderTopLeftRadius: i === 0 ? 10 : 0,
									borderTopRightRadius:
										i === splitBackgroundColors.length - 1 ? 10 : 0,
									borderBottomLeftRadius: i === 0 ? 7 : 0,
									borderBottomRightRadius:
										i === splitBackgroundColors.length - 1 ? 7 : 0,
								}}
								key={i}
							/>
						))}
					</View>
				</View>
			)}

			{isIcon && icon ? (
				<Ionicons
					size={defaultHeaderBtnSize - 6}
					name={`${icon}`}
					color={revert ? Colors[theme].primary : Colors[theme].textPrimary}
					style={[fontStyle]}
				/>
			) : (
				<ThemedText
					theme={theme}
					value={val}
					// @ts-ignore
					style={[styles.FilterButtonText, fontStyle]}
				/>
			)}
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
		borderStartStartRadius: 10,
		borderEndStartRadius: 10,
		borderStartEndRadius: 7,
		borderEndEndRadius: 7,
		paddingVertical: 10,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		width: 170,
		borderBottomWidth: 5,
	},
	FilterButtonText: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
});

export default PostTypeButton;
