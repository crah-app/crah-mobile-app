import Colors from '@/constants/Colors';
import { defaultHeaderBtnSize } from '@/constants/Styles';
import React from 'react';
import { StyleSheet, View, ViewStyle, ActivityIndicator } from 'react-native';

interface CrahActivityIndicatorProps {
	color?: string;
	style?: ViewStyle | ViewStyle[];
	size?: number | 'small' | 'large' | undefined;
}

const CrahActivityIndicator: React.FC<CrahActivityIndicatorProps> = ({
	color = Colors.default.primary,
	style,
	size = defaultHeaderBtnSize,
}) => {
	return <ActivityIndicator color={color} style={style} size={size} />;
};

const styles = StyleSheet.create({});

export default CrahActivityIndicator;
