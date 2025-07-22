import ThemedView from '@/components/general/ThemedView';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/general/ThemedText';
import Colors from '@/constants/Colors';
import { ExplorePostOrder, Tags, SearchCategories, RawPost } from '@/types';
import PostTypeButton from '@/components/PostTypeButton';
import { filterPosts } from '@/utils/globalFuncs';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Tag from '@/components/tag';
import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';
import AllPostsRowContainer from '@/components/displayFetchedData/AllPostsRowContainer';
import ArticlesRowContainer from '@/components/displayFetchedData/ArticlesRowContainer';
import VideosRowContainer from '@/components/displayFetchedData/VideosRowContainer';
import TextPostRowContainer from '@/components/displayFetchedData/TextPostRowContainer';
import TricksRowContainer from '@/components/displayFetchedData/TricksRowContainer';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import SearchBar from '@/components/general/SearchBar';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';

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

	const [posts, setPosts] = useState<RawPost[]>([]);

	const [showOptions, setShowOptions] = useState<boolean>(false);

	const CategoryComponent = {
		[SearchCategories.allPosts]: <AllPostsRowContainer />, // all posts
		[SearchCategories.articles]: <ArticlesRowContainer />, // all articles
		[SearchCategories.videos]: <VideosRowContainer />, // all videos
		[SearchCategories.riders]: <AllUserRowContainer contentTitle="Riders" />, // all riders
		[SearchCategories.text]: <TextPostRowContainer />, // all text/ image posts
		[SearchCategories.tricks]: <TricksRowContainer />, // all tricks
	};

	// filter categories
	const FilterPosts = (type: SearchCategories) => {
		setSelectedCategory(type);
		filterPosts(posts, type);
		handlCloseModalPress();
	};

	// filter tags
	const handleTagPress = (tag: Tags) => {
		setSelectedTag(tag === selectedTag ? undefined : tag);
		handlCloseModalPress();
	};

	// friends only checkbox
	const toggleCheckbox = (isChecked: boolean) => {
		setFriendsOnly(isChecked);
		handlCloseModalPress();
	};

	const handleOptionsPress = () => {
		setShowOptions((prev) => !prev);
		handlePresentModalPress();
		handlCloseModalPress();
	};

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['85%'], []);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const handlCloseModalPress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const renderBackdrop = useCallback((props: any) => {
		const animatedIndex = useSharedValue(0);
		const animatedPosition = useSharedValue(1);

		return (
			<BottomSheetBackdrop
				animatedIndex={animatedIndex}
				animatedPosition={animatedPosition}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		);
	}, []);

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
								displayLeftSearchIcon
								query={searchQuery}
								setQuery={setSearchQuery}
								placeholder={'Search...'}
								displayOptionsBtn={true}
								onOptionsPress={handleOptionsPress}
								displayCloseRequestBtn
							/>
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1} style={{ flex: 1, paddingTop: 4 }}>
					<BottomSheetModal
						backdropComponent={renderBackdrop}
						snapPoints={snapPoints}
						handleIndicatorStyle={{ backgroundColor: 'gray' }}
						backgroundStyle={{
							backgroundColor: Colors[theme].background2,
						}}
						ref={bottomSheetRef}>
						<BottomSheetView>
							<View
								style={{
									flexDirection: 'column',
									gap: 24,
									paddingHorizontal: 18,
									paddingBottom: 52,
								}}>
								<ThemedText
									value={'Search Filters'}
									theme={theme}
									style={[
										defaultStyles.biggerText,
										{ textAlign: 'center', marginTop: 8 },
									]}
								/>
								{/* category buttons */}
								<CategoryButtons
									FilterPosts={(type: SearchCategories) => FilterPosts(type)}
									selectedCategory={selectedCategory}
									theme={theme}
								/>
								{/* filter container */}
								<FilterContainer
									toggleCheckbox={toggleCheckbox}
									theme={theme}
									handleTagPress={handleTagPress}
									selectedTag={selectedTag}
									selectedOrder={selectedOrder}
									setSelectedOrder={setSelectedOrder}
									setShowAllTags={setShowAllTags}
									showAllTags={showAllTags}
								/>
							</View>
						</BottomSheetView>
					</BottomSheetModal>

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
			}
		/>
	);
};

interface CategoryButtonsProps {
	FilterPosts: (type: SearchCategories) => void;
	selectedCategory: SearchCategories;
	theme: 'light' | 'dark';
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
	FilterPosts,
	selectedCategory,
	theme,
}) => {
	return (
		<View
			style={[
				styles.category_container,
				{ flexDirection: 'column', alignItems: 'flex-start' },
			]}>
			<ThemedText
				value={'Category'}
				theme={theme}
				style={[
					defaultStyles.biggerText,
					{ textAlign: 'center', marginBottom: 12 },
				]}
			/>

			<View style={{ gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
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
									? 'rgba(255, 0, 0, 0.2)'
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
		</View>
	);
};

interface FilterContainerProps {
	selectedTag?: Tags;
	handleTagPress: (tag: Tags) => void;
	selectedOrder?: ExplorePostOrder;
	setSelectedOrder: (order: ExplorePostOrder) => void;
	showAllTags: boolean;
	setShowAllTags: (show: boolean) => void;
	theme: 'light' | 'dark';
	toggleCheckbox: (isChecked: boolean) => void;
}

const FilterContainer: React.FC<FilterContainerProps> = ({
	selectedTag,
	handleTagPress,
	setSelectedOrder,
	selectedOrder,
	showAllTags,
	setShowAllTags,
	theme,
	toggleCheckbox,
}) => {
	return (
		<View>
			<View
				style={[
					{
						flexDirection: 'column',
						width: '100%',
						backgroundColor: Colors[theme].container_surface,
						borderRadius: 10,
						gap: 12,
					},
				]}>
				{/* tags wrapper */}
				<View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
					<ThemedText
						value={'Tags'}
						theme={theme}
						style={[
							defaultStyles.biggerText,
							{ textAlign: 'center', marginBottom: 16 },
						]}
					/>

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
				{/*  */}

				{/* Order Wrapper */}
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'flex-start',
						gap: 12,
						marginTop: 4,
					}}>
					<ThemedText
						value={'Order'}
						theme={theme}
						style={[defaultStyles.biggerText, { textAlign: 'center' }]}
					/>

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
											{
												borderColor: Colors[theme].textPrimary,
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
				{/*  */}

				{/* Friends Only Wrapper */}
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'flex-start',
						marginTop: 18,
					}}>
					<View style={[styles.tag_container_left, { width: '25%' }]}>
						<ThemedText theme={theme} value={'Friends Only'} />
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
							iconStyle={{ borderColor: 'red' }}
							innerIconStyle={{ borderWidth: 2 }}
							onPress={(isChecked: boolean) => {
								toggleCheckbox(isChecked);
							}}
						/>
					</View>
				</View>
				{/*  */}
			</View>
		</View>
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
		// paddingHorizontal: 12,
	},
	tag_container: {
		gap: 12,
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
