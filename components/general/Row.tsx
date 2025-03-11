import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	ViewStyle,
	TextStyle,
} from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { SvgFromXml, SvgXml } from 'react-native-svg';

interface ColumnProps {
	title: string;
	subtitle?: string;
	showAvatar?: boolean;
	avatarUrl?: string;
	customLeftComponent?: React.ReactNode;
	customRightComponent?: React.ReactNode;
	leftContainerStyle?: ViewStyle | ViewStyle[];
	onPress?: () => void;
	containerStyle?: ViewStyle;
	titleStyle?: TextStyle;
	subtitleStyle?: TextStyle;
	avatarIsSVG?: boolean;
}

const Row: React.FC<ColumnProps> = ({
	title,
	subtitle,
	showAvatar = true,
	avatarUrl,
	customLeftComponent,
	customRightComponent,
	onPress,
	containerStyle,
	titleStyle,
	subtitleStyle,
	avatarIsSVG,
	leftContainerStyle,
}) => {
	const theme = useSystemTheme();

	return (
		<TouchableOpacity
			style={[
				styles.container,
				{ backgroundColor: Colors[theme].background },
				containerStyle,
			]}
			onPress={onPress}
			activeOpacity={onPress ? 0.7 : 1}>
			<View style={[styles.leftContainer, leftContainerStyle]}>
				{showAvatar && avatarUrl ? (
					<View>
						{avatarIsSVG ? (
							<SvgXml
								xml={avatarUrl}
								fill={Colors[theme].textPrimary}
								style={[styles.avatar]}
								width={46}
								height={42}
							/>
						) : (
							<Image source={{ uri: avatarUrl }} style={styles.avatar} />
						)}
					</View>
				) : (
					customLeftComponent
				)}
			</View>

			<View style={styles.textContainer}>
				<Text
					style={[
						styles.title,
						{ color: Colors[theme].textPrimary },
						titleStyle,
					]}
					numberOfLines={1}>
					{title}
				</Text>
				{subtitle && (
					<Text
						style={[styles.subtitle, { color: 'gray' }, subtitleStyle]}
						numberOfLines={1}>
						{subtitle}
					</Text>
				)}
			</View>

			{customRightComponent && (
				<View style={styles.rightContainer}>{customRightComponent}</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		width: Dimensions.get('window').width,
		padding: 10,
	},
	leftContainer: {
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightContainer: {
		marginLeft: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatar: {
		width: 46,
		height: 46,
		borderRadius: 23,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 13,
		marginTop: 2,
	},
});

export default Row;
