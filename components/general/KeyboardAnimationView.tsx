import React from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import UseKeyboardGradualAnimation from '../../hooks/useKeyboardGradualAnimation';

const CostumKeyboardAvoidingView: React.FC<{ padding_bottom: number }> = ({
	padding_bottom,
}) => {
	const { height } = UseKeyboardGradualAnimation(20);

	const keyboardView = useAnimatedStyle(() => {
		return {
			height: Math.abs(height.value),
			marginBottom: height.value > 0 ? 0 : padding_bottom,
		};
	});

	return <View style={keyboardView}></View>;
};

export default CostumKeyboardAvoidingView;
