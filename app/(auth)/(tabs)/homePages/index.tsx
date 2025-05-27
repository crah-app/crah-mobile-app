import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Easing,
	Dimensions,
	RefreshControl,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import UserPost from '@/components/home/UserPost';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';

import { useLocalSearchParams } from 'expo-router';

import { filterPosts } from '@/utils/globalFuncs';
import PostTypeFilterModal from '@/components/home/PostTypeFilterModal';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { ContentFilterTypes, fetchAdresses, GeneralPostTypes } from '@/types';
import UserUploadsPost from '@/components/home/UserUploadsPost';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';

// dummy-data
import { SvgXml } from 'react-native-svg';
import MessagesButton from '@/components/home/MessagesButton';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

import ScooterWheel from '../../../../assets/images/vectors/wheel.svg';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import Row from '@/components/general/Row';
import { useUser } from '@clerk/clerk-expo';
import ThemedText from '@/components/general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import HeaderFlatList from '@/components/header/HeaderFlatList';

const POST_CACHE_KEY = 'allPosts';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

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

	// video upload logic
	const [userUploadsVideo, setUserUploadsVideo] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const [uploadFinished, setUploadFinished] = useState<boolean>(false);
	const [videoData, setVideoData] = useState<string | null>(null);

	const { video_upload, video_cover, video_data } = useLocalSearchParams();

	useEffect(() => {
		// console.log(video_upload, video_cover);
		if (video_upload && video_cover && video_data) {
			setVideoData(video_data as string);
			setUserUploadsVideo(true);
			handleUploadVideoProgress();
		}
	}, [video_upload, video_cover, video_data]);

	const handleUploadVideoProgress = () => {
		if (uploadFinished) return;
		setUploadProgress((prev) => prev + 1);
	};

	useEffect(() => {
		if (uploadProgress === 100) {
			setUploadFinished(true);

			setTimeout(() => {
				setUserUploadsVideo(false);
			}, 1000);
			return;
		}
		setTimeout(() => {
			handleUploadVideoProgress();
		}, 1000);
	}, [uploadProgress]);
	// ----------------

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
		setErrLoadingUserPosts(false);
		SetUserPostsLoaded(false);

		let address = 'http://192.168.0.136:4000/api/posts/all';

		switch (category) {
			case ContentFilterTypes.friends:
				address =
					'http://192.168.0.136:4000/api/posts/user/:userId/friends/all';
				break;

			case ContentFilterTypes.rank:
				address = 'http://192.168.0.136:4000/api/posts/rank/:rank/all';
				break;

			default:
				address = 'http://192.168.0.136:4000/api/posts/all';
				break;
		}

		fetch(address, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setUserPosts(res);
				console.log(res, 'ghrieodfjssdfgiojiosdfgj,iosdfgjk,sdfgiojioj');
			})
			.catch((err) => setErrLoadingUserPosts(err))
			.finally(() => SetUserPostsLoaded(true));
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
			errWhileLoading={errLoadingUserPosts}
			dataLoaded={UserPostsLoaded}
			setRefreshing={setRefreshing}
			theme={theme}
			headerHeight={60}
			data={userPosts}
			keyExtractor={(item: any) => item.id}
			renderItem={({ item }) => <UserPost post={item} />}
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
									<SvgXml
										width="25"
										height="25"
										xml={ScooterWheel}
										fill={Colors[theme].textPrimary}
										style={{
											// @ts-ignore
											color: Colors[theme].textPrimary,
										}}
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
