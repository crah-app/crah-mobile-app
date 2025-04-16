// components/animations/SlideRowWrapper.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface SlideRowWrapperProps {
	children: React.ReactNode;
	shouldSlide: boolean;
	slideDistance?: number;
	style?: ViewStyle;
}

const SlideRowWrapper: React.FC<SlideRowWrapperProps> = ({
	children,
	shouldSlide,
	slideDistance = 60,
	style,
}) => {
	const translateX = useRef(new Animated.Value(0)).current; // Anfangswert auf 0 setzen

	useEffect(() => {
		Animated.timing(translateX, {
			toValue: shouldSlide ? slideDistance : 0, // Nur wenn shouldSlide true ist, verschieben
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [shouldSlide]);

	return (
		<Animated.View
			style={[
				style,
				{
					transform: [{ translateX }],
				},
			]}>
			{children}
		</Animated.View>
	);
};

export default SlideRowWrapper;
