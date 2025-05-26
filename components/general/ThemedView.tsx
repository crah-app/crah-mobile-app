import { View, ViewStyle } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemedViewProps {
	theme: 'light' | 'dark';
	children?: React.ReactNode;
	flex?: number;
	style?: ViewStyle | ViewStyle[];
	gradient?: boolean;
}

const ThemedView: React.FC<ThemedViewProps> = ({
	theme,
	children,
	flex,
	style,
	gradient = false,
}) => {
	return (
		<View style={{ flex }}>
			{gradient ? (
				<LinearGradient
					style={[{ flex }, style]}
					colors={[Colors[theme].background, Colors[theme].background2]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					locations={[0, 0.9]}>
					{children}
				</LinearGradient>
			) : (
				<View
					style={[{ flex, backgroundColor: Colors[theme].background }, style]}>
					{children}
				</View>
			)}
		</View>
	);
};

export default ThemedView;
