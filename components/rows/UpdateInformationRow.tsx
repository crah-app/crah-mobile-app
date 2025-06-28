import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Row from '@/components/general/Row';

interface UpdateInformationRowProps {
	updateNumber: number;
	title: string;
	subtitle?: string;
	onPress?: () => void;
}

const UpdateInformationRow: React.FC<UpdateInformationRowProps> = ({
	updateNumber,
	title,
	subtitle,
	onPress,
}) => {
	const theme = useSystemTheme();

	const numberComponent = (
		<View
			style={[
				styles.numberContainer,
				{
					borderColor: Colors[theme].textPrimary,
					borderWidth: 2,
				},
			]}>
			<Text style={[styles.numberText, { color: Colors[theme].textPrimary }]}>
				{updateNumber}
			</Text>
		</View>
	);

	return (
		<Row
			title={title}
			subtitle={subtitle}
			customLeftComponent={numberComponent}
			showAvatar={false}
			onPress={onPress}
		/>
	);
};

const styles = StyleSheet.create({
	numberContainer: {
		width: 46,
		height: 46,
		borderRadius: 23,
		justifyContent: 'center',
		alignItems: 'center',
	},
	numberText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default UpdateInformationRow;
