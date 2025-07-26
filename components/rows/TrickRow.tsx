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

	const displaySubTitle = (
		landed: 'landed' | 'not landed' | undefined,
		difficulty: TrickDifficulty | undefined,
		points: number | undefined,
	): string => {
		if (difficulty && points && landed) {
			return `${landed}   Difficulty  ${difficulty}   Points  ${points}`;
		}

		if (difficulty && points) {
			return `Difficulty  ${difficulty}  Points  ${points}`;
		}

		if (difficulty) {
			return `Difficulty: ${difficulty}`;
		}

		if (points) {
			return `Points: ${points}`;
		}

		if (landed) {
			return landed;
		}

		return '';
	};

	return (
		<Row
			title={name}
			highlightWords={[points?.toString() ?? '', difficulty ?? '']}
			subtitle={displaySubTitle(landed, difficulty, points)}
			avatarIsSVG={true}
			subtitleStyle={{
				color: landed == 'landed' ? Colors['default'].primary : 'grey',
			}}
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
