import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import DropDownMenu from '@/components/general/DropDownMenu';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import TrickPreviewCard from '@/components/rankspage/TrickPreviewCard';
import TrickAboutPage from '@/components/trickModal/TrickAboutPage';
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

interface TrickStructure {
	trickName: string;
	trickId: number;
	trickDescription: string;
}

const TrickModal = () => {
	const {
		trickName,
		trickDescription,
		trickId,
		trickType,
		trickDefaultPoints,
	} = useLocalSearchParams();

	const theme = useSystemTheme();

	const map = {
		// general and personal information
		About: (
			<TrickAboutPage
				trickName={trickName as string}
				trickDefaultPoints={trickDefaultPoints as string}
				trickType={trickType as TrickType}
			/>
		),

		// similar tricks ot tricks the community build upon this trick
		Community: <TrickCommunityPage />,

		// User Posts where trick is mentioned
		Explore: <TrickExplorePage />,
	};

	const [selectedTab, setSelectedTab] = useState<
		'About' | 'Community' | 'Explore'
	>('About');

	const ModalHeader = () => {
		return (
			<View
				style={{
					backgroundColor: Colors[theme].container_surface,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-around',
				}}>
				{Object.keys(map).map((value, index) => (
					<TouchableOpacity
						// @ts-ignore
						onPress={() => setSelectedTab(value)}
						style={{
							padding: 14,
							borderColor:
								selectedTab === value
									? Colors[theme].primary
									: Colors[theme].textPrimary,
							borderWidth: selectedTab === value ? 2 : 0,
							borderRadius: 5,
							flex: 1,
						}}>
						<ThemedText
							theme={theme}
							value={value}
							style={{
								fontWeight: '600',
								textAlign: 'center',
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			{/* Stack Header */}
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor: Colors[theme].background,
					},
					headerShown: true,
					headerLeft: () => (
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="close-outline"
								color={Colors[theme].textPrimary}
								style={[defaultStyles.biggerText, { fontSize: 30 }]}
							/>
						</TouchableOpacity>
					),
					headerTitle: () => (
						<ThemedText
							style={[defaultStyles.biggerText]}
							value={trickName as string}
							theme={theme}
						/>
					),
				}}
			/>

			<ScrollView>
				{/* Header */}
				<ModalHeader />

				{map[selectedTab]}
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {},
	aboutText: { fontSize: 19, fontWeight: '400' },
	aboutValue: { fontSize: 19, fontWeight: '700' },
});

export default TrickModal;
