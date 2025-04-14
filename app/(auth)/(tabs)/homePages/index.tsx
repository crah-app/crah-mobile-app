import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Easing,
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
import { ContentFilterTypes } from '@/types';
import UserUploadsPost from '@/components/home/UserUploadsPost';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';

// dummy-data
import posts from '../../../../JSON/posts.json';
import { SvgXml } from 'react-native-svg';
import MessagesButton from '@/components/home/MessagesButton';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

import ScooterWheel from '../../../../assets/images/vectors/wheel.svg';

const Page = () => {
	const theme = useSystemTheme();

	// content logic
	const [showFilter, setShowFilter] = useState(true);
	const [filterIsVisible, setFilterIsVisbile] = useState(false);

	const [ContentFilterSelected, setSelectedContentFilter] =
		useState<ContentFilterTypes>(ContentFilterTypes.explore);

	const HandleFilterContentType = (type: ContentFilterTypes) => {
		setSelectedContentFilter(type);
	};

	const [UserPosts, SetUserPosts] = useState(posts);

	const FilterPosts = (type: string) => {
		let filteredPosts = filterPosts(posts, type);

		SetUserPosts(filteredPosts);
		setFilterIsVisbile(false);
	};

	const rotation = useRef(new Animated.Value(0)).current;

	const handleClickWheel = () => {
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

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={
						<View style={{ flexDirection: 'row', gap: 15 }}>
							<TouchableOpacity onPress={handleClickWheel}>
								<Animated.View
									style={[
										{
											transform: [{ rotate: rotateInterpolate }],
										},
									]}>
									<SvgXml
										width="25"
										height="25"
										xml={ScooterWheel}
										fill={Colors[theme].textPrimary}
										style={[
											{
												//@ts-ignore
												color: Colors[theme].textPrimary,
											},
										]}
									/>
								</Animated.View>
							</TouchableOpacity>

							<MessagesButton />
						</View>
					}
					theme={theme}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					{/* on top filter buttons */}
					<View style={[styles.ContentFilterContainer]}>
						{Object.values(ContentFilterTypes).map((value) => (
							<HomePageFilterButton
								key={value}
								text={value as string}
								onPress={() => HandleFilterContentType(value)}
								style={[
									{
										borderBottomColor:
											ContentFilterSelected === value
												? Colors[theme].primary
												: Colors[theme].surface,
									},
								]}
							/>
						))}
					</View>

					{userUploadsVideo && (
						<UserUploadsPost
							cover={video_cover as string}
							progress={uploadProgress}
							videoTitle={JSON.parse(video_data as string).title}
						/>
					)}

					{UserPosts.length > 0 ? (
						<FlatList
							data={UserPosts}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <UserPost post={item} />}
							contentContainerStyle={[styles.flatListContainer]}
							scrollEnabled={false}
						/>
					) : (
						<NoDataPlaceholder onSubTextClickPathname="/(auth)/createPages/createVideo" />
					)}

					{/* modal */}
					<PostTypeFilterModal
						FilterIsVisible={filterIsVisible}
						FilterPosts={FilterPosts}
						setFilterVisibility={setFilterIsVisbile}
					/>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	flatListContainer: {},
	ContentFilterContainer: {
		alignItems: 'flex-end',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
});

export default Page;
