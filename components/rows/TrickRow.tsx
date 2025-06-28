import { TrickDifficulty } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Row from '../general/Row';

import Bars from '../../assets/images/vectors/bar.svg';
import Colors from '@/constants/Colors';

interface TrickRowProps {
	name: string;
	points?: number;
	difficulty?: TrickDifficulty;
	landed?: 'landed' | 'not landed';
	onPress: () => void;
}

const TrickRow: React.FC<TrickRowProps> = ({
	name,
	points,
	difficulty,
	landed,
	onPress,
}) => {
	const theme = useSystemTheme();

	return (
		<Row
			title={name}
			subtitle={landed}
			subtitleStyle={{
				color: landed == 'landed' ? Colors['default'].primary : 'grey',
			}}
			avatarIsSVG={true}
			showAvatar={true}
			avatarUrl={'bar'}
			onPress={onPress}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
	},
});

export default TrickRow;
