import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
	progress: number;
	theme: 'light' | 'dark';
}

const ProgressionBar: React.FC<Props> = ({ progress, theme }) => {
	return (
		<View
			style={{
				width: '100%',
				height: 14,
				borderRadius: 12,
				backgroundColor: Colors[theme].container_surface,
			}}>
			<View
				style={{
					borderRadius: 12,
					height: 14,
					width: `${progress}%`,
					backgroundColor: Colors[theme].primary,
					zIndex: 1,
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default ProgressionBar;
