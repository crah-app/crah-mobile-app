import ThemedText from '@/components/general/ThemedText';
import GetSVG from '@/components/GetSVG';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Rank, TrickSpot } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
	theme: 'light' | 'dark';
	additionalPoints: number; // points of trick
	trickName: string;
	trickSpot?: TrickSpot; // pass this down only when user choosed one specific spot
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
}

function TrickLandedModal({
	theme,
	additionalPoints = 65,
	trickName = 'Buttercup',
	trickSpot = 'Flat',
	visible,
	setVisible,
}: Props) {
	const handleConfirmPress = () => {
		setVisible(false);
	};

	const handleSharePress = () => {};

	const handleOnBackdropPress = () => {
		setVisible(false);
	};

	return (
		<View>
			{/* backdrop */}
			<Modal
				isVisible={visible}
				useNativeDriver
				useNativeDriverForBackdrop
				hasBackdrop={true}
				onBackdropPress={handleOnBackdropPress}>
				{/* upper text */}
				<View
					style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<ThemedText
						theme={theme}
						value={'Congratulations'}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '700' },
						]}
					/>
					<ThemedText
						theme={theme}
						value={`for landing`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '700' },
						]}
					/>

					<ThemedText
						theme={theme}
						value={`${trickName} ${trickSpot || ''}!`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '700' },
						]}
					/>
				</View>

				{/* rank badge and points */}
				<View
					style={{
						flex: 3,
						flexDirection: 'column',
						gap: 18,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{/* badge */}
					<GetSVG
						name={'scooter'}
						props={{ fill: Colors[theme].textPrimary }}
					/>
					<ThemedText
						theme={theme}
						value={`${additionalPoints}`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '600' },
						]}
					/>
				</View>

				{/* footer */}
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						gap: 8,
						alignItems: 'flex-end',
						justifyContent: 'space-between',
					}}>
					<PostTypeButton
						revert
						style={{ width: 75 }}
						fontStyle={{ fontSize: 26 }}
						isIcon
						icon={`share-outline`}
						val={''}
						click_action={handleSharePress}
					/>
					<PostTypeButton
						fontStyle={{ fontSize: 20 }}
						style={{}}
						val={'Nice'}
						click_action={handleConfirmPress}
					/>
					<PostTypeButton
						revert
						style={{
							width: 75,
						}}
						fontStyle={{ fontSize: 26, marginLeft: 4 }}
						isIcon
						icon={`create-outline`}
						val={''}
						click_action={handleSharePress}
					/>
				</View>
			</Modal>
		</View>
	);
}

export default TrickLandedModal;
