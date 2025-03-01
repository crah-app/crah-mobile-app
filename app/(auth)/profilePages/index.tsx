import {
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
	FlatList,
	ScrollView,
	SafeAreaView,
	Dimensions,
	Text,
} from 'react-native';
import React, { useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import ThemedText from '@/components/general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import UserPostGridItem from '@/components/UserPostGridItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { PostTypeIonicons } from '@/types';

// dummy data
import tricks from '@/JSON/tricks.json';
import posts from '../../../JSON/posts.json';
import UserImageCircle from '@/components/general/UserImageCircle';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom } = useSafeAreaInsets();
	const windowWidth = Dimensions.get('window').width;

	const [activePostFilterIcon, setActivePostFilterIcon] = useState(`all`);

	const pathData = `M0,100 A${windowWidth},${windowWidth / 3} 0 0,0 ${
		windowWidth / 2
	},100`;

	const pathData2 = `M0,100 A${windowWidth},${windowWidth / 3} 0 0,0 ${
		windowWidth / 2
	},100`;

	return (
		<ThemedView theme={theme} flex={1}>
			<SafeAreaView>
				<ScrollView
					contentContainerStyle={styles.scrollViewContainer}
					showsVerticalScrollIndicator={false}>
					<View style={{ flex: 1 }}>
						<View style={styles.upperHeader}>
							<Link asChild href={{ pathname: '/profilePages/inbox' }}>
								<TouchableOpacity style={{ position: 'absolute', left: 10 }}>
									<Ionicons
										size={24}
										color={Colors[theme].textPrimary}
										name="mail-outline"
									/>
								</TouchableOpacity>
							</Link>

							<Link href="/profilePages/settings" asChild>
								<TouchableOpacity style={{ position: 'absolute', right: 10 }}>
									<Ionicons
										size={24}
										color={Colors[theme].textPrimary}
										name="settings-outline"
									/>
								</TouchableOpacity>
							</Link>
						</View>

						<Svg
							width={windowWidth}
							height={200}
							style={{
								position: 'absolute',
								top: 30,
								left: -32,
							}}>
							<Path
								d={pathData}
								fill="transparent"
								stroke={Colors[theme].primary}
								strokeWidth={2}
							/>
						</Svg>

						<Svg
							width={windowWidth}
							height={200}
							style={{
								position: 'absolute',
								top: 30,
								right: windowWidth / -2 - 32,
							}}>
							<Path
								d={pathData2}
								fill="transparent"
								stroke={Colors[theme].primary}
								strokeWidth={2}
							/>
						</Svg>

						<View style={[styles.header]}>
							<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								<ThemedText
									theme={theme}
									value={
										user?.username! == '' ? user?.fullName! : user?.username!
									}
									style={[styles.UserName]}
								/>
								<UserImageCircle
									width={88}
									height={88}
									imageUri={JSON.stringify(user?.imageUrl)}
								/>
							</View>

							<View style={[styles.UserRankDataContainer]}>
								<View style={{ alignItems: 'center' }}>
									<ThemedText
										theme={theme}
										value="Best Trick"
										style={[styles.UserDataText, { color: 'red' }]}
									/>
									<ThemedText
										theme={theme}
										value="Buttercup Flat"
										style={styles.UserDataText}
									/>
								</View>

								<View style={{ alignItems: 'center' }}>
									<ThemedText
										theme={theme}
										value="User Rank"
										style={[styles.UserDataText, { color: 'red' }]}
									/>
									<ThemedText
										theme={theme}
										value="#257"
										style={styles.UserDataText}
									/>
								</View>
							</View>

							<View style={[styles.UserDataContainer]}>
								<View style={{ alignItems: 'center' }}>
									<ThemedText
										theme={theme}
										value="Flat Rider"
										style={[styles.UserDataText, { color: 'red' }]}
									/>

									<ThemedText
										theme={theme}
										value="26 years old - asparagus enjoyer"
										style={[styles.UserDataText]}
									/>
								</View>

								<View
									style={{
										alignItems: 'center',
										borderTopWidth: StyleSheet.hairlineWidth,
										borderColor: Colors[theme].textPrimary,
										paddingTop: 10,
										minHeight: 296,
									}}>
									<ThemedText
										theme={theme}
										value="Top 5 Best Flat Tricks"
										style={[styles.UserDataText]}
									/>

									{tricks.length > 0 ? (
										<FlatList
											data={tricks}
											keyExtractor={(item) => item.id}
											renderItem={({ item, index }) => (
												<ThemedText
													key={index}
													theme={theme}
													value={
														item.name.length > 22
															? item.name.substring(0, 20) + '...'
															: item.name
													}
													style={{
														backgroundColor: 'rgba(255, 0, 0, 0.33)',
														padding: 10,
														borderRadius: 15,
													}}
												/>
											)}
											contentContainerStyle={[styles.bestTricksContainer, {}]}
										/>
									) : (
										<ThemedText
											theme={theme}
											value={'No Data'}
											style={{
												paddingTop: 10,
												fontWeight: 'bold',
												color: 'gray',
											}}
										/>
									)}
								</View>

								<View
									style={[
										styles.UserPostFilterContainer,
										{
											borderColor: Colors[theme].textPrimary,
											borderTopWidth: StyleSheet.hairlineWidth,
											paddingTop: 10,
										},
									]}>
									{Object.values(PostTypeIonicons).map((icon, index) => (
										<TouchableOpacity
											onPress={() =>
												setActivePostFilterIcon(
													Object.keys(PostTypeIonicons)[index],
												)
											}>
											<Ionicons
												name={icon}
												size={
													activePostFilterIcon ==
													Object.keys(PostTypeIonicons)[index]
														? 26
														: 25
												}
												color={
													activePostFilterIcon ==
													Object.keys(PostTypeIonicons)[index]
														? Colors['default'].primary
														: Colors[theme].textPrimary
												}
											/>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</View>

						<View style={[styles.main]}>
							<View style={{ flex: 1, bottom }}>
								{posts.length > 0 ? (
									<FlatList
										style={styles.PostsGridContainer}
										data={posts}
										keyExtractor={(item) => item.id}
										numColumns={3}
										renderItem={({ item, index }) => (
											<UserPostGridItem
												key={index}
												post={item}
												style={[
													styles.GridItem,
													{ borderColor: Colors[theme].textPrimary },
												]}
											/>
										)}
										contentContainerStyle={[styles.flatListContainer, {}]}
									/>
								) : (
									<NoDataPlaceholder />
								)}
							</View>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	scrollViewContainer: {
		flexGrow: 1,
		paddingBottom: 20,
	},
	upperHeader: {
		width: '100%',
		height: 35,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	flatListContainer: {},
	bestTricksContainer: {
		width: Dimensions.get('window').width / 1.1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		top: 10,
		gap: 10,
		justifyContent: 'center',
	},
	header: {
		width: '100%',
		height: 500,
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderBottomWidth: 36,
		borderBottomColor: 'gray',
		paddingBottom: 15,
	},
	UserName: {
		fontSize: 35,
		fontWeight: '700',
		textAlign: 'center',
	},
	UserProfile: {
		borderRadius: 50,
		marginTop: 10,
		borderWidth: 2,
		borderColor: 'red',
	},
	UserRankDataContainer: {
		width: '85%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		top: Dimensions.get('window').height / 7,
	},
	UserDataContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		top: 90,
		gap: 30,
		flex: 1,
	},
	UserDataText: {
		fontSize: 16,
		fontWeight: '600',
		alignItems: 'center',
	},
	UserPostFilterContainer: {
		width: Dimensions.get('window').width,
		justifyContent: 'space-evenly',
		bottom: 140,
		zIndex: 10,
		flexDirection: 'row',
		borderBottomWidth: 2,
		paddingBottom: 10,
	},
	main: {
		width: '100%',
		flex: 1,
	},
	PostsGridContainer: {},
	GridItem: {
		width: '33.33%',
		aspectRatio: 1,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Page;
