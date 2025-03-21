import { TrickDifficulty } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Column from '../general/Row';

import Bars from '../../assets/images/vectors/bar.svg';
import Colors from '@/constants/Colors';

interface TrickColumnProps {
	name: string;
	points?: number;
	difficulty?: TrickDifficulty;
	landed?: 'landed' | 'not landed';
	onPress: () => void;
}

const TrickColumn: React.FC<TrickColumnProps> = ({
	name,
	points,
	difficulty,
	landed,
	onPress,
}) => {
	const theme = useSystemTheme();

	return (
		<Column
			title={name}
			subtitle={landed}
			subtitleStyle={{
				color: landed == 'landed' ? Colors['default'].primary : 'grey',
			}}
			avatarIsSVG={true}
			showAvatar={true}
			avatarUrl={Bars}
			onPress={onPress}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
	},
});

export default TrickColumn;
