import ThemedText from '@/components/general/ThemedText';
import GetSVG from '@/components/GetSVG';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Rank } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

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
	oldRank = 0,
	newRank = 0,
	totalUserRankPoints = 12_000,
	visible,
	setVisible,
}: Props) {
	const handleConfirmPress = () => {
		setVisible(false);
	};

	const handleSharePress = () => {};

	return (
		<View>
			{/* backdrop */}
			<Modal hasBackdrop={true} useNativeDriver useNativeDriverForBackdrop>
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
						value={`You ranked up from ${oldRank} to...`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '700' },
						]}
					/>

					<ThemedText
						theme={theme}
						value={`${newRank}`}
						style={[
							defaultStyles.bigText,
							{ color: Colors[theme].primary, fontWeight: '700' },
						]}
					/>
				</View>

				{/* rank badge and points */}
				<View style={{ flex: 3, flexDirection: 'column', gap: 8 }}>
					{/* badge */}
					<GetSVG name={'scooter'} props={{}} />
					<ThemedText
						theme={theme}
						value={`${totalUserRankPoints}`}
						style={[
							defaultStyles.biggerText,
							{ color: Colors[theme].primary, fontWeight: '600' },
						]}
					/>
				</View>

				{/* footer */}
				<View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
					<PostTypeButton
						style={{}}
						isIcon
						icon={`share-outline`}
						val={''}
						click_action={handleSharePress}
					/>
					<PostTypeButton
						style={{}}
						val={'Nice'}
						click_action={handleConfirmPress}
					/>
				</View>
			</Modal>
		</View>
	);
}

export default NewRankModal;
