import ThemedText from '@/components/general/ThemedText';
import GetSVG from '@/components/GetSVG';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Rank, SpotInterface, TrickSpot } from '@/types';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';
import B from '../../../../assets/illustrations/pngs/whip_umbrella.png';

const bu = Image.resolveAssetSource(B as ImageSourcePropType);

interface Props {
	theme: 'light' | 'dark';
	additionalPoints: number; // points of trick
	trickName: string;
	trickSpot?: TrickSpot; // pass this down only when user choosed one specific spot
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	setTrickCreated: React.Dispatch<React.SetStateAction<boolean>>;
	setAddedSpot: React.Dispatch<React.SetStateAction<boolean>>;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	setSpots: React.Dispatch<React.SetStateAction<SpotInterface[]>>;
	oldRank: number;
	newRank: number;
	setRankModalVisible: Dispatch<SetStateAction<boolean>>;
}

function TrickLandedModal({
	theme,
	additionalPoints,
	trickName,
	trickSpot,
	visible,
	setVisible,
	setTrickCreated,
	setAddedSpot,
	setValue,
	setSpots,
	oldRank,
	newRank,
	setRankModalVisible,
}: Props) {
	const [displayText, setDisplayText] = useState<string>(
		`${trickName} ${trickSpot || ''}!`,
	);

	const handleConfirmPress = () => {
		setVisible(false);
		setTrickCreated(false);
		setAddedSpot(false);
		setValue('');
		setSpots([]);

		if (oldRank < newRank) {
			setRankModalVisible(true);
		}
	};

	const handleSharePress = () => {};

	const handleOnBackdropPress = () => {
		setVisible(false);
	};

	function getResponsiveFontSize(
		text: string,
		minSize = 24,
		maxSize = 42,
		threshold = 15,
	) {
		if (text.length <= threshold) return maxSize;

		// Linear skalieren:
		const scale = Math.max(minSize, maxSize - (text.length - threshold));

		return scale;
	}

	useEffect(() => {
		setDisplayText(`${trickName} ${trickSpot || ''}!`);
	}, [trickName, trickSpot]);

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
					style={{
						flex: 1,
						flexDirection: 'column',
						alignItems: 'center',
						gap: 4,
					}}>
					<ThemedText
						textShadow
						theme={theme}
						value={'Congratulations'}
						style={[
							{ color: Colors[theme].primary, fontWeight: '700', fontSize: 42 },
						]}
					/>
					<ThemedText
						theme={theme}
						value={`for landing`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].textPrimary, fontWeight: '700' },
						]}
					/>
				</View>

				{/* rank badge and points */}
				<View
					style={{
						flex: 3,
						flexDirection: 'column',
						gap: 42,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{/* badge */}
					{/* <GetSVG
						name={'scooter'}
						props={{ fill: Colors[theme].textPrimary }}
					/> */}
					<ThemedText
						theme={theme}
						value={displayText}
						style={[
							{
								textAlign: 'center',
								color: Colors[theme].textPrimary,
								fontWeight: '700',
								fontSize: getResponsiveFontSize(displayText),
							},
						]}
					/>
					<Image source={bu} style={{ width: 290, height: 300 }} />
					<ThemedText
						theme={theme}
						value={`+${additionalPoints} Points`}
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
						val={'Got it!'}
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
