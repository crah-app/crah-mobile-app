import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

type SwipeableRowProps = {
	children: React.ReactNode;
	onDelete: () => void;
	onArchive: () => void;
};

const SwipeableRow: React.FC<SwipeableRowProps> = ({
	children,
	onDelete,
	onArchive,
}) => {
	const theme = useSystemTheme();
	let swipeableRow: Swipeable | null = null;

	const close = () => swipeableRow?.close();

	const renderAction = (
		text: string,
		color: string,
		x: number,
		progress: Animated.AnimatedInterpolation<number>,
		callback: () => void,
	) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [x, 0],
		});

		const pressHandler = () => {
			close();
			callback();
		};

		return (
			<Animated.View
				style={{
					flex: 1,
					transform: [{ translateX: trans }],
				}}>
				<RectButton
					style={[styles.rightAction, { backgroundColor: color }]}
					onPress={pressHandler}>
					<Text
						style={[styles.actionText, { color: Colors[theme].textPrimary }]}>
						{text}
					</Text>
				</RectButton>
			</Animated.View>
		);
	};

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		_dragAnimatedValue: Animated.AnimatedInterpolation<number>,
	) => (
		<View style={{ width: 150, flexDirection: 'row' }}>
			{renderAction(
				'Delete',
				Colors['default'].darkPrimary,
				150,
				progress,
				onDelete,
			)}
			{renderAction('Archive', Colors[theme].gray, 150, progress, onArchive)}
		</View>
	);

	// const renderLeftActions = (
	// 	progress: Animated.AnimatedInterpolation<number>,
	// 	_dragAnimatedValue: Animated.AnimatedInterpolation<number>,
	// ) => (
	// 	<View style={{ width: 150, flexDirection: 'row' }}>
	// 		{renderAction('Archive', Colors[theme].gray, 150, progress, onArchive)}
	// 	</View>
	// );

	return (
		<Swipeable
			ref={(ref) => (swipeableRow = ref)}
			enableTrackpadTwoFingerGesture
			friction={1.4}
			overshootRight={false}
			// overshootLeft={false}
			leftThreshold={40}
			rightThreshold={40}
			renderRightActions={renderRightActions}>
			{children}
		</Swipeable>
	);
};

export default SwipeableRow;

const styles = StyleSheet.create({
	actionText: {
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
		alignSelf: 'flex-start',
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});
