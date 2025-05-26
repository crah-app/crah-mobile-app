import Colors from '@/constants/Colors';
import { selectedRiderInterface, selectedTrickInterface } from '@/types';
import React from 'react';
import { View } from 'react-native';
import Row from '../general/Row';

import Scooter from '../../assets/images/vectors/scooter.svg';
import { useSystemTheme } from '@/utils/useSystemTheme';

export const RenderTrick: React.FC<{
	trickData: selectedTrickInterface | undefined;
	asMessageBubble: boolean;
	position?: 'right' | 'left';
}> = ({ trickData, asMessageBubble, position }) => {
	const theme = useSystemTheme();

	return (
		<View style={{}}>
			<Row
				costumAvatarWidth={18}
				costumAvatarHeight={18}
				showAvatar
				avatarIsSVG
				avatarUrl={Scooter}
				// @ts-ignore
				title={trickData?.name}
				containerStyle={{
					width: 250,
					backgroundColor:
						position === 'right'
							? Colors[theme].primary
							: position === 'left'
							? Colors[theme].surface
							: Colors[theme].surface,
				}}
			/>
		</View>
	);
};

export const RenderRider: React.FC<{
	riderData: selectedRiderInterface | undefined;
	asMessageBubble: boolean;
	position?: 'right' | 'left';
}> = ({ riderData, asMessageBubble, position }) => {
	const theme = useSystemTheme();

	return (
		<View style={{}}>
			<Row
				costumAvatarWidth={18}
				costumAvatarHeight={18}
				showAvatar
				// @ts-ignore
				avatarUrl={riderData?.avatar}
				// @ts-ignore
				title={riderData?.name}
				// subtitle={riderData?.rank + ' #' + riderData?.rankPosition}
				containerStyle={{
					width: 250,
					backgroundColor:
						position === 'right'
							? Colors[theme].primary
							: position === 'left'
							? Colors[theme].surface
							: Colors[theme].surface,
				}}
			/>
		</View>
	);
};
