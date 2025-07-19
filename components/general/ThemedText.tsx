import { Text, TextStyle } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

interface ThemedTextProps {
	value: string | React.JSX.Element;
	theme: 'light' | 'dark';
	style?: TextStyle | TextStyle[];
	lineNumber?: number;
	textShadow?: boolean;
	textShadowColor?: string;
}

const ThemedText: React.FC<ThemedTextProps> = ({
	value,
	theme,
	style,
	lineNumber,
	textShadow = false,
	textShadowColor = 'rgba(255,0,0,0.4)',
}) => {
	const shadowStyle: TextStyle = textShadow
		? {
				textShadowColor: textShadowColor,
				textShadowOffset: { width: 4, height: 4 },
				textShadowRadius: 3,
		  }
		: {};

	return (
		<Text
			numberOfLines={lineNumber || undefined}
			style={[{ color: Colors[theme].textPrimary }, shadowStyle, style]}>
			{value}
		</Text>
	);
};

export default ThemedText;
