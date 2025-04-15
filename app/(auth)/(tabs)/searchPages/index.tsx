import ThemedView from '@/components/general/ThemedView';
import React, { useState } from 'react';
import {
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/general/ThemedText';
import Colors from '@/constants/Colors';
import { ExplorePostOrder, Tags, SearchCategories } from '@/types';
import PostTypeButton from '@/components/PostTypeButton';
import { filterPosts } from '@/utils/globalFuncs';
import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import UserPost from '@/components/home/UserPost';
import Tag from '@/components/tag';
import ClerkUser from '@/types/clerk';
import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';
import AllPostsRowContainer from '@/components/displayFetchedData/AllPostsRowContainer';
import ArticlesRowContainer from '@/components/displayFetchedData/ArticlesRowContainer';
import VideosRowContainer from '@/components/displayFetchedData/VideosRowContainer';
import TextPostRowContainer from '@/components/displayFetchedData/TextPostRowContainer';
import TricksRowContainer from '@/components/displayFetchedData/TricksRowContainer';
import { Stack } from 'expo-router';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import SearchBar from '@/components/general/SearchBar';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';

const Page = () => {
	const theme = useSystemTheme();

	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<SearchCategories>(
		SearchCategories.allPosts,
	);

	const [selectedTag, setSelectedTag] = useState<Tags>();
	const [selectedOrder, setSelectedOrder] = useState<ExplorePostOrder>(
		ExplorePostOrder.toOldest,
	);

	const [friendsOnly, setFriendsOnly] = useState<boolean>(false);
	const [showAllTags, setShowAllTags] = useState<boolean>(false);

	const [posts, setPosts] = useState<any>();

	const CategoryComponent = {
		[SearchCategories.allPosts]: <AllPostsRowContainer />,
		[SearchCategories.articles]: <ArticlesRowContainer />,
		[SearchCategories.videos]: <VideosRowContainer />,
		[SearchCategories.riders]: <AllUserRowContainer contentTitle="Riders" />,
		[SearchCategories.text]: <TextPostRowContainer />,
		[SearchCategories.tricks]: <TricksRowContainer />,
	};

	// filter categories
	const FilterPosts = (type: SearchCategories) => {
		filterPosts(posts, type);
		setSelectedCategory(type);
	};

	// filter tags
	const handleTagPress = (tag: Tags) => {
		setSelectedTag(tag === selectedTag ? undefined : tag);
	};

	// friends only checkbox
	const toggleCheckbox = () => {
		setFriendsOnly(!friendsOnly);
	};

	const CategoryButtons = () => {
		return (
			<View style={styles.category_container}>
				{Object.values(SearchCategories).map((key, index) => (
					<PostTypeButton
						key={index}
						val={key}
						click_action={() => {
							FilterPosts(key);
						}}
						style={{
							backgroundColor:
								key === selectedCategory
									? 'rgba(255, 0, 0, 0.5)'
									: 'transparent',
							borderColor: Colors.default.primary,
							borderWidth: 1,
							minWidth: 90,
							maxWidth: 90,
							shadowColor: 'transparent',
						}}
						fontStyle={{
							fontSize: 13,
						}}
					/>
				))}
			</View>
		);
	};

	const FilterContainer = () => {
		return (
			<View style={[{ paddingHorizontal: 12 }]}>
				<View
					style={[
						{ padding: 20, flexDirection: 'column', width: '100%' },
						{
							backgroundColor: Colors[theme].container_surface,
							borderRadius: 10,
						},
					]}>
					<View style={{ flexDirection: 'row' }}>
						<View style={[styles.tag_container_left]}>
							<ThemedText theme={theme} value={'tags'} />
						</View>

						<View>
							{/* tag container */}
							<View style={[styles.tag_container]}>
								{Object.values(Tags)
									.slice(0, showAllTags ? undefined : 8)
									.map((tag) => {
										const isSelected = tag === selectedTag;
										return (
											<Tag
												handleTagPress={() => handleTagPress(tag)}
												isSelectedOnClick={isSelected}
												tag={tag}
												theme={theme}
												key={tag}
											/>
										);
									})}
							</View>
							{/*  */}

							{/* Toggle button for tags */}
							<TouchableOpacity
								onPress={() => setShowAllTags(!showAllTags)}
								style={{
									marginTop: 10,
									alignSelf: 'flex-start',
								}}>
								<ThemedText
									theme={theme}
									value={showAllTags ? 'Show fewer tags' : 'See all tags'}
									style={{ color: 'gray' }}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ marginTop: 35, flexDirection: 'row' }}>
						<View style={[styles.tag_container_left]}>
							<ThemedText theme={theme} value={'order'} />
						</View>

						<View style={{ gap: 10, flexDirection: 'row' }}>
							{Object.values(ExplorePostOrder).map((val, i) => {
								return (
									<TouchableOpacity
										key={val}
										onPress={() => setSelectedOrder(val)}>
										<ThemedText
											theme={theme}
											value={val}
											style={[
												styles.text2,
												{ borderColor: Colors[theme].textPrimary },
												{
													backgroundColor:
														selectedOrder === val
															? 'rgba(255,0,0,0.4)'
															: 'transparent',
												},
											]}
										/>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>

					<View style={{ marginTop: 35, flexDirection: 'row' }}>
						<View
							style={[
								styles.tag_container_left,
								{ marginRight: 5, width: '25%' },
							]}>
							<ThemedText theme={theme} value={'friends only'} />
						</View>

						<View
							style={{
								gap: 10,
								flexDirection: 'row',
								bottom: 4,
							}}>
							<BouncyCheckbox
								size={25}
								fillColor="red"
								text="Custom Checkbox"
								iconStyle={{ borderColor: 'red' }}
								innerIconStyle={{ borderWidth: 2 }}
								onPress={(isChecked: boolean) => {
									console.log(isChecked);
								}}
							/>
						</View>
					</View>
				</View>
			</View>
		);
	};

	const handleOptionsPress = () => {};

	return (
		<HeaderScrollView
			headerHeight={120}
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={<View></View>}
					headerBottom={
						<View style={{ flex: 1 }}>
							<SearchBar
								query={searchQuery}
								setQuery={setSearchQuery}
								placeholder={'Search...'}
								displayOptionsBtn={true}
								onOptionsPress={handleOptionsPress}
							/>
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					<ScrollView style={{ flex: 1, paddingTop: 4 }}>
						<ThemedView theme={theme} style={styles.container}>
							{/* category buttons */}
							<CategoryButtons />
							{/* filter container */}
							<FilterContainer />

							<View
								style={[
									{
										width: Dimensions.get('window').width,
										minHeight: 300,
										flex: 1,
									},
								]}>
								{CategoryComponent[selectedCategory]}
							</View>
						</ThemedView>
					</ScrollView>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get('window').width,
		flexDirection: 'column',
		justifyContent: 'space-between',
		gap: 12,
		flex: 1,
	},
	category_container: {
		flexDirection: 'row',
		gap: 10,
		flexWrap: 'wrap',
		paddingHorizontal: 12,
	},
	tag_container: {
		gap: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	tag_container_left: {
		width: '15%',
	},
	text2: {
		borderWidth: 1.25,
		borderRadius: 10,
		minWidth: 130,
		maxWidth: 130,
		shadowColor: 'transparent',
		padding: 8,
		fontSize: 13,
		textAlign: 'center',
	},
});

export default Page;
