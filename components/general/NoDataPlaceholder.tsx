import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

import arrow from '../../assets/images/vectors/arrow-to-down-right-svgrepo-com.svg';
import { SvgXml } from 'react-native-svg';
import { Link } from 'expo-router';
import { useSystemTheme } from '@/utils/useSystemTheme';

interface NoDataPlaceholderProps {
	arrowStyle?: ViewStyle | ViewStyle[];
	containerStyle?: ViewStyle | ViewStyle[];
	firstTextValue?: string;
	subTextValue?: string;
}

const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({
	arrowStyle,
	containerStyle,
	firstTextValue,
	subTextValue,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.placeholderContainer, containerStyle]}>
			<SvgXml
				width="30"
				height="30"
				xml={arrow}
				fill={Colors[theme].textPrimary}
				style={[
					styles.arrow,
					arrowStyle,
					{
						color: Colors[theme].textPrimary,
					},
				]}
			/>

			<Text style={styles.placeholderText}>
				{firstTextValue ?? "No one's around here"}{' '}
			</Text>
			<Link href={{ pathname: '/(auth)/createPages/createVideo' }} asChild>
				<TouchableOpacity>
					<Text
						style={[styles.placeholderText, { color: Colors.default.primary }]}>
						{subTextValue ?? 'Create A Post'}
					</Text>
				</TouchableOpacity>
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	arrow: {
		position: 'absolute',
		left: 60,
		top: 120,
		flex: 1,
		zIndex: 1,
		transform: [{ rotate: '-105deg' }],
	},
	placeholderContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		bottom: 0,
	},
	placeholderText: {
		fontWeight: '700',
		fontSize: 28,
		color: 'gray',
	},
});

export default NoDataPlaceholder;
