import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
	Dimensions,
} from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

import arrow from '../../assets/images/vectors/arrow-to-down-right-svgrepo-com.svg';
import { Link } from 'expo-router';
import { useSystemTheme } from '@/utils/useSystemTheme';
import GetSVG from '../GetSVG';
import ThemedText from './ThemedText';
import { defaultStyles } from '@/constants/Styles';

interface NoDataPlaceholderProps {
	arrowStyle?: ViewStyle | ViewStyle[];
	containerStyle?: ViewStyle | ViewStyle[];
	firstTextValue?: string;
	subTextValue?: string;
	onSubTextClickPathname?: string;
	retryFunction?: () => void;
}

const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({
	arrowStyle,
	containerStyle,
	firstTextValue,
	subTextValue,
	onSubTextClickPathname,
	retryFunction = () => {},
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

			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Text style={styles.placeholderText}>
					{firstTextValue ?? 'Something went wrong, please try again.'}{' '}
				</Text>
			</View>

			<View style={{ top: 20 }}>
				<TouchableOpacity style={{}} onPress={() => retryFunction()}>
					<ThemedText
						value="Retry"
						theme={theme}
						style={[
							defaultStyles.outlinedBtn,
							{
								padding: 10,
								borderWidth: 2,
								width: Dimensions.get('window').width - 128,
								borderRadius: 10,
								color: Colors[theme].primary,
								fontSize: 20,
								fontWeight: '500',
								backgroundColor: 'rgba(255, 0,0, 0.05)',
							},
						]}
					/>
				</TouchableOpacity>
			</View>
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
		fontWeight: '400',
		fontSize: 20,
		color: 'gray',
	},
});

export default NoDataPlaceholder;
