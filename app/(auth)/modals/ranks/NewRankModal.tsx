import ThemedText from '@/components/general/ThemedText';
import GetSVG from '@/components/GetSVG';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Rank, UserGalleryTopics } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import Modal from 'react-native-modal';
import B from '../../../../assets/illustrations/pngs/whip_umbrella.png';
import { router } from 'expo-router';

const bu = Image.resolveAssetSource(B as ImageSourcePropType);

interface Props {
	theme: 'light' | 'dark';
	oldRank: number;
	newRank: number;
	totalUserRankPoints: number;
	visible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
}

function NewRankModal({
	theme,
	oldRank = -1,
	newRank = -1,
	totalUserRankPoints = -1,
	visible,
	setVisible,
}: Props) {
	const handleConfirmPress = () => {
		setVisible(false);
	};

	const handleSharePress = () => {};

	const handleRankBtnPress = () => {
		router.push({
			pathname: '/(auth)/(tabs)/statsPages',
			params: { pageType: UserGalleryTopics.LEAGUES },
		});

		setTimeout(() => {
			setVisible(false);
		}, 300);
	};

	const handleOnBackdropPress = () => {
		setVisible(false);
	};

	const oldRankName = Rank.getRankNameByIndex(oldRank);
	const newRankName = Rank.getRankNameByIndex(newRank);

	return (
		<View>
			{/* backdrop */}
			<Modal
				hasBackdrop={true}
				useNativeDriver
				useNativeDriverForBackdrop
				isVisible={visible}
				onBackdropPress={handleOnBackdropPress}>
				{/* upper text */}
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						alignItems: 'center',
						gap: 12,
					}}>
					<ThemedText
						textShadow
						theme={theme}
						value={'Congratulations'}
						style={[
							{ color: Colors[theme].primary, fontWeight: '700', fontSize: 42 },
						]}
					/>

					<View style={{ flexDirection: 'row' }}>
						<ThemedText
							theme={theme}
							value={`You ranked up from `}
							style={[
								defaultStyles.bigText,
								{
									color: Colors[theme].textPrimary,
									fontWeight: '700',
									fontSize: 23,
								},
							]}
						/>
						<ThemedText
							theme={theme}
							value={`${oldRankName}`}
							style={[
								defaultStyles.bigText,
								{
									color: Colors[theme].primary,
									fontWeight: '700',
									fontSize: 23,
								},
							]}
						/>
						<ThemedText
							theme={theme}
							value={` to...`}
							style={[
								defaultStyles.bigText,
								{
									color: Colors[theme].textPrimary,
									fontWeight: '700',
									fontSize: 23,
								},
							]}
						/>
					</View>
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
					{/* rank */}
					<ThemedText
						theme={theme}
						value={`${newRankName}`}
						style={[
							{ color: Colors[theme].primary, fontWeight: '700', fontSize: 36 },
						]}
					/>
					{/* badge */}
					<Image source={bu} style={{ width: 290, height: 300 }} />

					{/* points */}
					<ThemedText
						theme={theme}
						value={`+${totalUserRankPoints} Points`}
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
						icon={'bar-chart-outline'}
						val={''}
						click_action={handleRankBtnPress}
					/>
				</View>
			</Modal>
		</View>
	);
}

export default NewRankModal;
