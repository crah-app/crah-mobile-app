import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Easing,
	Dimensions,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import UserPost from '@/components/home/UserPost';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';

import { filterPosts } from '@/utils/globalFuncs';
import PostTypeFilterModal from '@/components/home/PostTypeFilterModal';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { ContentFilterTypes, RawPost } from '@/types';
import CostumHeader from '@/components/header/CostumHeader';

// dummy-data
import MessagesButton from '@/components/home/MessagesButton';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { useAuth, useUser } from '@clerk/clerk-expo';
import HeaderFlatList from '@/components/header/HeaderFlatList';
import GetSVG from '@/components/GetSVG';
import { mmkv } from '@/hooks/mmkv';
import PostTypeButton from '@/components/PostTypeButton';

const POST_CACHE_KEY = 'allPosts';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { getToken } = useAuth();

	// content logic
	const [filterIsVisible, setFilterIsVisbile] = useState(false);

	const rotation = useRef(new Animated.Value(0)).current;

	const handleClickWheel = () => {
		if (!UserPostsLoaded || errLoadingUserPosts) return;

		setFilterIsVisbile(!filterIsVisible);

		rotation.setValue(0);
		Animated.timing(rotation, {
			toValue: 1,
			duration: 1000,
			easing: Easing.bounce,
			useNativeDriver: true,
		}).start();
	};

	const rotateInterpolate = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	// fetch posts logic
	const [ContentFilterSelected, setSelectedContentFilter] =
		useState<ContentFilterTypes>(ContentFilterTypes.explore);

	const HandleFilterContentType = (type: ContentFilterTypes) => {
		setSelectedContentFilter(type);
	};

	const [userPosts, setUserPosts] = useState<any>();
	const [UserPostsLoaded, SetUserPostsLoaded] = useState<boolean>();
	const [errLoadingUserPosts, setErrLoadingUserPosts] = useState<boolean>();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = async () => {
		setRefreshing(true);
		await fetchPosts(ContentFilterSelected);
		setRefreshing(false);
	};

	const FilterPosts = (type: string) => {
		if (!UserPostsLoaded || errLoadingUserPosts) return;

		let filteredPosts = filterPosts(userPosts, type);

		setUserPosts(filteredPosts);
		setFilterIsVisbile(false);
	};

	const fetchPosts = async (category: ContentFilterTypes) => {
		try {
			setErrLoadingUserPosts(false);
			SetUserPostsLoaded(false);

			const token = await getToken();

			let address = `http://192.168.0.136:4000/api/posts/all/currentUser/${user?.id}`;

			switch (category) {
				case ContentFilterTypes.friends:
					address = `http://192.168.0.136:4000/api/posts/currentUser/${user?.id}/friends`;
					break;

				case ContentFilterTypes.rank:
					const currentRank = mmkv.getString('rank');
					address = `http://192.168.0.136:4000/api/posts/rank/${currentRank}/all`;
					break;

				default:
					address = `http://192.168.0.136:4000/api/posts/all/currentUser/${user?.id}`;
					break;
			}

			await fetch(address, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					// console.log(res);
					setUserPosts(res);
				})
				.catch((err) => {
					console.warn(err);
					setErrLoadingUserPosts(err);
				})
				.finally(() => SetUserPostsLoaded(true));
		} catch (error) {
			console.warn('Error [fetchPosts]', error);
		}
	};

	useEffect(() => {
		fetchPosts(ContentFilterSelected);

		return () => {};
	}, []);

	useEffect(() => {
		fetchPosts(ContentFilterSelected);

		return () => {};
	}, [ContentFilterSelected]);

	return (
		<HeaderFlatList
			retryFunction={handleRefresh}
			errWhileLoading={errLoadingUserPosts}
			dataLoaded={UserPostsLoaded}
			setRefreshing={setRefreshing}
			theme={theme}
			headerHeight={60}
			data={userPosts}
			keyExtractor={(item: RawPost) => item.Id.toString()}
			renderItem={({ item }) => <UserPost key={item.Id} post={item} />}
			refreshing={refreshing}
			onRefresh={handleRefresh}
			headerChildren={
				<CostumHeader
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={
						<View style={{ flexDirection: 'row', gap: 15 }}>
							<TouchableOpacity onPress={handleClickWheel}>
								<Animated.View
									style={{
										transform: [{ rotate: rotateInterpolate }],
									}}>
									<GetSVG
										props={{
											fill: Colors[theme].textPrimary,
											width: 24,
											height: 24,
										}}
										name={'wheel'}
									/>
								</Animated.View>
							</TouchableOpacity>
							<MessagesButton />
						</View>
					}
					theme={theme}
				/>
			}
			childrenAboveList={
				<View>
					<View style={styles.ContentFilterContainer}>
						{Object.values(ContentFilterTypes).map((value) => (
							<HomePageFilterButton
								key={value}
								text={value}
								onPress={() => HandleFilterContentType(value)}
								style={{
									borderBottomColor:
										ContentFilterSelected === value
											? Colors[theme].primary
											: Colors[theme].surface,
								}}
							/>
						))}
					</View>

					{/* <PostTypeButton
						style={{
							marginVertical: 18,
							width: Dimensions.get('window').width - 24,
							marginHorizontal: 12,
						}}
						val="Did you land a new trick?"
						click_action={() => {}}
					/> */}

					{/* <Row
						title={'Rank #1 Silver'}
						avatarUrl={user?.imageUrl}
						costumAvatarHeight={32}
						costumAvatarWidth={32}
						containerStyle={{
							borderBottomWidth: 1,
							borderBottomColor: Colors[theme].gray,
							backgroundColor: Colors[theme].background,
						}}
						subtitle="Level 41"
						highlightWords={['Level 41']}
					/> */}

					{/* {userUploadsVideo && (
						<UserUploadsPost
							cover={video_cover as string}
							progress={uploadProgress}
							videoTitle={JSON.parse(video_data as string).title}
						/>
					)} */}

					<PostTypeFilterModal
						FilterPosts={FilterPosts}
						FilterIsVisible={filterIsVisible}
						setFilterVisibility={setFilterIsVisbile}
					/>
				</View>
			}
			ListEmptyComponent={
				<NoDataPlaceholder
					retryFunction={handleRefresh}
					containerStyle={styles.PlaceholderContentContainer}
					firstTextValue="No posts here yet..."
					subTextValue="Start creating and sharing!"
					onSubTextClickPathname="/(auth)/(tabs)/createPages/createVideo"
					arrowStyle={{ display: 'none' }}
				/>
			}
		/>
	);
};

const styles = StyleSheet.create({
	flatListContainer: {
		flexGrow: 1,
	},
	ContentFilterContainer: {
		alignItems: 'flex-end',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	PlaceholderContentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.5,
	},
});

export default Page;
