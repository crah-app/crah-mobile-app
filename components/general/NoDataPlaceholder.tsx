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
import { Link } from 'expo-router';
import { useSystemTheme } from '@/utils/useSystemTheme';
import GetSVG from '../GetSVG';

interface NoDataPlaceholderProps {
	arrowStyle?: ViewStyle | ViewStyle[];
	containerStyle?: ViewStyle | ViewStyle[];
	firstTextValue?: string;
	subTextValue?: string;
	onSubTextClickPathname?: string;
}

const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({
	arrowStyle,
	containerStyle,
	firstTextValue,
	subTextValue,
	onSubTextClickPathname,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.placeholderContainer, containerStyle]}>
			<View style={arrowStyle}>
				<GetSVG
					props={{ width: 30, height: 30, fill: Colors[theme].textPrimary }}
					name="arrow_to_down_right"
				/>
			</View>

			<Text style={styles.placeholderText}>
				{firstTextValue ?? "No one's around here"}{' '}
			</Text>
			<Link
				href={{
					pathname: onSubTextClickPathname ?? '/',
				}}
				asChild>
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
