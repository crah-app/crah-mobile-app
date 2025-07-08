import React from 'react';
import {
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import ThemedText from './general/ThemedText';
import { Tags } from '@/types';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface TagProps {
	tag: Tags | string;
	theme: 'light' | 'dark';
	handleTagPress?: (...params: any[]) => void;
	isSelectedOnClick?: boolean;
	DisplayRemoveBtn?: boolean;
	ActionOnRemoveBtnClick?: () => void;
	touchOpacity?: number;
	style?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle | TextStyle[];
}

const Tag: React.FC<TagProps> = ({
	handleTagPress,
	tag,
	isSelectedOnClick,
	theme,
	DisplayRemoveBtn,
	ActionOnRemoveBtnClick,
	touchOpacity,
	style,
	textStyle,
}) => {
	return (
		<TouchableOpacity
			activeOpacity={touchOpacity}
			key={tag}
			onPress={handleTagPress}
			style={[
				isSelectedOnClick && {
					backgroundColor: 'rgba(255,0,0,0.4)',
				},
				{
					borderRadius: 10,
					flexDirection: 'row',
					justifyContent: 'space-between',
					gap: 10,
					width: '100%',
				},
				styles.text,
				{ width: DisplayRemoveBtn ? 140 : 110 },
				{
					borderColor:
						tag === "World's First"
							? Colors[theme].textPrimary
							: Colors[theme].textPrimary,
				},
				style,
			]}>
			<ThemedText
				theme={theme}
				value={tag}
				style={[
					// @ts-ignore
					textStyle || {},
					{
						color:
							tag === "World's First"
								? Colors[theme].textPrimary
								: Colors[theme].textPrimary,
						flex: 1,
					},
				]}
			/>

			{DisplayRemoveBtn && (
				<TouchableOpacity onPress={ActionOnRemoveBtnClick}>
					<Ionicons
						name="close-outline"
						size={16}
						color={Colors[theme].textPrimary}
					/>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 14,
		padding: 5,
		borderWidth: 1.25,
		borderRadius: 10,
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Tag;
