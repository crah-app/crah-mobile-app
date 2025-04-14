import Colors from '@/constants/Colors';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import ThemedText from './ThemedText';

type SegmentedControlProps = {
	options: string[];
	selectedOption: string;
	onOptionPress?: (option: string) => void;
	theme: 'light' | 'dark';
};

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
	({ options, selectedOption, onOptionPress, theme }) => {
		const { width: windowWidth } = useWindowDimensions();

		const Palette = {
			baseGray05: Colors[theme].surface,
			baseGray80: Colors['default'].primary,
			background: Colors['default'].darkPrimary,
		};

		const internalPadding = 6;
		const segmentedControlWidth = 180;

		const itemWidth =
			(segmentedControlWidth - internalPadding) / options.length;

		const rStyle = useAnimatedStyle(() => {
			return {
				left: withTiming(
					itemWidth * options.indexOf(selectedOption) + internalPadding / 2,
				),
			};
		}, [selectedOption, options, itemWidth]);

		return (
			<View
				style={[
					styles.container,
					{
						width: segmentedControlWidth,
						borderRadius: 6,
						paddingLeft: internalPadding / 2,
						backgroundColor: Palette.baseGray05,
					},
				]}>
				<Animated.View
					style={[
						{
							width: itemWidth,
							backgroundColor: Palette.background,
						},
						rStyle,
						styles.activeBox,
					]}
				/>
				{options.map((option) => {
					return (
						<TouchableOpacity
							onPress={() => {
								onOptionPress?.(option);
							}}
							key={option}
							style={[
								{
									width: itemWidth,
								},
								styles.labelContainer,
							]}>
							<ThemedText
								theme={theme}
								value={option}
								style={[styles.label, { color: 'rgba(255, 255, 255, 0.75)' }]}
							/>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	},
);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 34,
	},
	activeBox: {
		position: 'absolute',
		borderRadius: 6,
		height: '80%',
		top: '10%',
	},
	labelContainer: { justifyContent: 'center', alignItems: 'center' },
	label: {
		fontSize: 14,
	},
});

export { SegmentedControl };
