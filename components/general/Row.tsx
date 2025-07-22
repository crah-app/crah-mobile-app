import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	ViewStyle,
	TextStyle,
	ImageStyle,
} from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import GetSVG from '../GetSVG';
import { svg_name } from '@/types';

interface RowProps {
	title: string;
	subtitle?: string;
	showAvatar?: boolean;
	avatarUrl?: string | undefined | svg_name;
	customLeftComponent?: React.ReactNode;
	customRightComponent?: React.ReactNode;
	leftContainerStyle?: ViewStyle | ViewStyle[];
	onPress?: () => void;
	containerStyle?: ViewStyle | ViewStyle[];
	titleStyle?: TextStyle | TextStyle[];
	subtitleStyle?: TextStyle | TextStyle[];
	avatarIsSVG?: boolean;
	subtitleIsMultiline?: boolean;
	textInTitleComponent?: React.ReactNode;
	bottomContainer?: React.ReactNode;
	textContainerStyle?: ViewStyle | ViewStyle[];
	highlightWords?: Array<string>;
	highlightColor?: string;
	costumAvatarWidth?: number;
	costumAvatarHeight?: number;
	avatarStyle?: ImageStyle | ImageStyle[];
	onLongPress?: () => void;
	children?: React.ReactNode;
}

const Row: React.FC<RowProps> = ({
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
	subtitleIsMultiline,
	textInTitleComponent,
	bottomContainer,
	textContainerStyle,
	highlightWords,
	highlightColor = Colors.default.primary,
	costumAvatarWidth,
	costumAvatarHeight,
	avatarStyle,
	onLongPress,
	children,
}) => {
	const theme = useSystemTheme();

	const highlightText = (text: string, words: Array<string> | undefined) => {
		if (!words || words.length === 0) return text;

		// Erstelle einen regulären Ausdruck für die Highlight-Wörter
		const regex = new RegExp(
			`(${words
				.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
				.join('|')})`,
			'gi',
		);

		// Zerlege den Text in hervorgehobene und normale Teile
		const parts = text.split(regex);

		return parts.map((part, index) =>
			words.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
				<Text key={index} style={{ color: highlightColor, fontWeight: 'bold' }}>
					{part}
				</Text>
			) : (
				<Text key={index}>{part}</Text>
			),
		);
	};

	return (
		<TouchableOpacity
			onPressIn={onLongPress}
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
							<GetSVG
								props={{
									width: 42,
									height: 42,
									fill: Colors[theme].textPrimary,
								}}
								name={avatarUrl as svg_name}
							/>
						) : (
							<Image
								source={{
									uri:
										avatarUrl ??
										'https://randomuser.me/api/portraits/men/32.jpg',
								}}
								style={[styles.avatar, avatarStyle]}
								width={costumAvatarWidth || 46}
								height={costumAvatarHeight || 46}
							/>
						)}
					</View>
				) : (
					customLeftComponent
				)}
			</View>

			<View style={[styles.textContainer, textContainerStyle]}>
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<Text
						style={[
							styles.title,
							{ color: Colors[theme].textPrimary },
							titleStyle,
						]}
						numberOfLines={1}>
						{title}
					</Text>

					{textInTitleComponent}
				</View>
				{subtitle && (
					<Text
						style={[styles.subtitle, { color: 'gray' }, subtitleStyle]}
						numberOfLines={subtitleIsMultiline ? 5 : 1}>
						{highlightText(subtitle, highlightWords)}
					</Text>
				)}

				{bottomContainer}
				{children && <View style={{ marginTop: 8 }}>{children}</View>}
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
		borderRadius: 23,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
		height: 'auto',
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 13,
		marginTop: 2,
		height: 'auto',
	},
});

export default Row;
