import Colors from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface Props {
	totalProgress: number;
	progress: number;
	theme: 'light' | 'dark';
}

const ProgressionBar: React.FC<Props> = ({
	progress,
	theme,
	totalProgress,
}) => {
	const progressWidth = useSharedValue(0);

	useEffect(() => {
		const percentage = (100 / totalProgress) * progress;
		progressWidth.value = withTiming(percentage, {
			duration: 400,
			easing: Easing.out(Easing.exp),
		});

		return () => {};
	}, [progress]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: `${progressWidth.value}%`,
		};
	});

	return (
		<View
			style={{
				width: '100%',
				height: 14,
				borderRadius: 12,
				backgroundColor: Colors[theme].container_surface,
			}}>
			<Animated.View
				style={[
					{
						borderRadius: 12,
						height: 14,
						// width: `${(100 / totalProgress) * progress}%`,
						backgroundColor: Colors[theme].primary,
						zIndex: 1,
					},
					animatedStyle,
				]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default ProgressionBar;
