import ThemedView from '@/components/general/ThemedView';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { helpPageParameter, UserGalleryTopics } from '@/types';
import Colors from '@/constants/Colors';
import LeaguesPage from '@/components/rankspage/Leagues';
import YourRank from '@/components/rankspage/YourRank';
import Tricks from '@/components/rankspage/Tricks';
import TrickBuilder from '@/components/rankspage/TrickBuilder';
import { Link, useLocalSearchParams } from 'expo-router';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { Ionicons } from '@expo/vector-icons';
import { defaultHeaderBtnSize } from '@/constants/Styles';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const { pageType } = useLocalSearchParams();

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

	useEffect(() => {
		if (!pageType) return;

		handleGalleryTopic(pageType as UserGalleryTopics);
	}, [pageType]);

	return (
		<HeaderScrollView
			scrollEnabled={false}
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={
						<View
							style={{
								borderLeftWidth: StyleSheet.hairlineWidth,
								borderColor: Colors[theme].textPrimary,
								paddingLeft: 14,
							}}>
							<Link
								href={{
									pathname: '/(auth)/modals/help_modal',
									params: { first: helpPageParameter.statsPages },
								}}>
								<TouchableOpacity>
									<Ionicons
										name="help-circle-outline"
										size={defaultHeaderBtnSize}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</Link>
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView flex={1} theme={theme}>
					<View style={styles.content_container}>
						{/* page navigation buttons */}
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
										borderBottomColor:
											CurrentGalleryTopic === val
												? Colors[theme].primary + 'rgba(255,0,0,0.3)'
												: Colors[theme].surface,
										zIndex: 1000,
									}}
									textStyle={{ fontSize: 15 }}
								/>
							))}
						</ScrollView>
						{/*  */}

						{/* render page content */}
						<View style={{ marginTop: -4 }}>
							{galleryComponents[CurrentGalleryTopic] || (
								<ThemedView theme={theme} flex={1}>
									<NoDataPlaceholder
										containerStyle={{
											flex: 1,
											justifyContent: 'center',
											alignItems: 'center',
											height: Dimensions.get('window').height,
										}}
										arrowStyle={{ display: 'none' }}
										firstTextValue="Stats, Tricks and more..."
										subTextValue=""
									/>
								</ThemedView>
							)}
						</View>
						{/*  */}
					</View>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	content_container: {},
	header_container: {
		paddingHorizontal: 10,
		height: 55,
		flexDirection: 'row',
	},
});

export default Page;
