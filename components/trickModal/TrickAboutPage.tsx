import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import DropDownMenu from '@/components/general/DropDownMenu';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import TrickPreviewCard from '@/components/rankspage/TrickPreviewCard';
import TrickCommunityPage from '@/components/trickModal/TrickCommunityPage';
import TrickExplorePage from '@/components/trickModal/TrickExplorePage';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import getTrickIllustration from '@/hooks/getTrickIllustrations';
import {
	dropDownMenuInputData,
	ItemText,
	SpotInterface,
	TrickDifficulty,
	TrickDifficultyColorMap,
	TrickType,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
	trickName: string;
	trickDefaultPoints: string;
	trickType: TrickType;
}

const TrickAboutPage: React.FC<Props> = ({
	trickName,
	trickDefaultPoints,
	trickType,
}) => {
	const theme = useSystemTheme();
	const trickIllustrations = getTrickIllustration(trickName as string);

	const { user } = useUser();

	const [spots, setSpots] = useState<SpotInterface[]>([
		{ spot: 'Flat', landing_date: new Date() },
		{
			spot: 'Street',
			landing_date: new Date(100000000000),
		},
	]);

	const items: Array<dropDownMenuInputData> = [
		{
			key: 0,
			text: 'default',
		},
		{
			key: 1,
			text: 'park',
		},
		{
			key: 1,
			text: 'street',
		},
		{
			key: 1,
			text: 'flat',
		},
	];

	const handleOnSelect = (val: { key: number; text: ItemText }) => {};

	const AboutSection = () => {
		return (
			<View style={{ marginTop: 12, gap: 10 }}>
				<View style={{ flexDirection: 'row' }}>
					<ThemedText
						style={[styles.aboutText]}
						value={`Trick Name •`}
						theme={theme}
					/>
					<ThemedText
						style={[styles.aboutValue]}
						value={` ${trickName}`}
						theme={theme}
					/>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<ThemedText
						style={[styles.aboutText]}
						value={`Trick Type •`}
						theme={theme}
					/>
					<ThemedText
						style={[styles.aboutValue]}
						value={` ${trickType}`}
						theme={theme}
					/>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<ThemedText
						style={[styles.aboutText]}
						value={`Trick Default Points •`}
						theme={theme}
					/>
					<ThemedText
						style={[styles.aboutValue]}
						value={` ${trickDefaultPoints}`}
						theme={theme}
					/>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<ThemedText
						style={[styles.aboutText]}
						value={`Trick Difficulty •`}
						theme={theme}
					/>
					<ThemedText
						style={[
							styles.aboutValue,
							{
								color:
									Colors[theme].primary ??
									TrickDifficultyColorMap[TrickDifficulty.GOATED],
							},
						]}
						value={` ${TrickDifficulty.GOATED}`}
						theme={theme}
					/>
				</View>
			</View>
		);
	};

	return (
		<ScrollView>
			<View style={{ padding: 12, gap: 24, marginTop: 12 }}>
				{/* upper illustration container */}
				<View>
					<View
						style={{
							backgroundColor: Colors['light'].background,
							borderRadius: 8,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Image
							source={{ uri: trickIllustrations }}
							width={200}
							height={200}
						/>
					</View>
				</View>

				{/* about container */}
				<View>
					<View
						style={{
							borderBottomWidth: 1,
							borderColor: Colors[theme].gray,
							paddingBottom: 6,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<ThemedText
							style={[defaultStyles.biggerText, defaultStyles.bigText]}
							value={'About'}
							theme={theme}
						/>

						<View
							style={{
								flexDirection: 'row',
							}}>
							<ThemedText style={[]} value={'default'} theme={theme} />

							{/* see difficulty and points depending on default, park, street, flat */}
							<DropDownMenu
								onSelect={(_, val) => handleOnSelect(val)}
								items={items}
								triggerComponent={
									<TouchableOpacity>
										<Ionicons
											size={18}
											name="chevron-forward"
											color={Colors[theme].textPrimary}
										/>
									</TouchableOpacity>
								}
							/>
						</View>
					</View>

					<AboutSection />
				</View>

				{/* current-user information about the trick */}
				<View>
					<View
						style={{
							borderBottomWidth: 1,
							borderColor: Colors[theme].gray,
							paddingBottom: 6,
						}}>
						<ThemedText
							style={[defaultStyles.biggerText, defaultStyles.bigText]}
							value={'Your Preview'}
							theme={theme}
						/>
					</View>

					<View style={{ marginTop: 12 }}>
						<TrickPreviewCard
							theme={theme}
							trickName={trickName as string}
							userId={user?.id}
							spots={spots}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {},
	aboutText: { fontSize: 19, fontWeight: '400' },
	aboutValue: { fontSize: 19, fontWeight: '700' },
});

export default TrickAboutPage;
