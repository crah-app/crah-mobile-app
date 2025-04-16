// components/animations/FadeOutRowWrapper.tsx
import React, { useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface Props {
	children: React.ReactNode;
	onFadeOutComplete: () => void;
	style?: ViewStyle;
}

const FadeOutRowWrapper: React.FC<Props> = ({
	children,
	onFadeOutComplete,
	style,
}) => {
	const opacity = useRef(new Animated.Value(1)).current;
	const translateX = useRef(new Animated.Value(0)).current;

	const fadeOut = () => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(translateX, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start(() => {
			onFadeOutComplete();
		});
	};

	React.useEffect(() => {
		fadeOut();
	}, []);

	return (
		<Animated.View
			style={[
				style,
				{
					opacity,
					transform: [{ translateX }],
				},
			]}>
			{children}
		</Animated.View>
	);
};

export default FadeOutRowWrapper;
