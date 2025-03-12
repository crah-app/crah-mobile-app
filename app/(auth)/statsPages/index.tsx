import ThemedView from '@/components/general/ThemedView';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { UserGalleryTopics } from '@/types';
import Colors from '@/constants/Colors';
import LeaguesPage from '@/components/rankspage/Leagues';
import YourRank from '@/components/rankspage/YourRank';
import Tricks from '@/components/rankspage/Tricks';
import TrickBuilder from '@/components/rankspage/TrickBuilder';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const galleryComponents = {
		[UserGalleryTopics.USER_RANK]: <YourRank user={JSON.stringify(user)} />,

		[UserGalleryTopics.LEAGUES]: <LeaguesPage user={JSON.stringify(user)} />,

		[UserGalleryTopics.TRICKS]: <Tricks />,

		[UserGalleryTopics.TRICK_BUILDER]: <TrickBuilder />,
	};

	const [CurrentGalleryTopic, setCurrentGalleryTopic] =
		useState<UserGalleryTopics>(UserGalleryTopics.USER_RANK);

	const handleGalleryTopic = (newTopic: UserGalleryTopics) => {
		setCurrentGalleryTopic(newTopic);
	};

	return (
		<ThemedView flex={1} theme={theme}>
			<View style={styles.content_container}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.header_container}
					style={{ width: 'auto' }}>
					{Object.values(UserGalleryTopics).map((val, i) => (
						<HomePageFilterButton
							text={val}
							onPress={() => handleGalleryTopic(val)}
							key={i}
							style={{
								minWidth: 90,
								marginRight: 8,
								justifyContent: 'center',
								height: 35,
								backgroundColor:
									CurrentGalleryTopic === val
										? Colors[theme].primary + 'rgba(255,0,0,0.3)'
										: Colors[theme].surface,
								zIndex: 1000,
							}}
							textStyle={{ fontSize: 15 }}
						/>
					))}
				</ScrollView>

				<View>{galleryComponents[CurrentGalleryTopic]}</View>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	content_container: {},
	header_container: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: 'transparent',
		height: 55,
		flexDirection: 'row',
		marginBottom: 10,
	},
});

export default Page;
