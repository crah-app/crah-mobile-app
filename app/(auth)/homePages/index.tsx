import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Animated,
	Platform,
	Easing,
	Modal,
	useWindowDimensions,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import ThemedText from '@/components/general/ThemedText';
import Colors from '@/constants/Colors';
import UserPost from '@/components/home/UserPost';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';

// dummy data
import posts from '../../../JSON/posts.json';
import { Filter, SvgXml } from 'react-native-svg';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

import ScooterBar from '../../../assets/images/vectors/bar.svg';
import ScooterWheel from '../../../assets/images/vectors/wheel.svg';
import ScooterWheelReflexes from '../../../assets/images/vectors/wheel_reflexes.svg';
import { Ionicons } from '@expo/vector-icons';
import PostTypeButton from '@/components/PostTypeButton';
import { filterPosts } from '@/utils/globalFuncs';
import PostTypeFilterModal from '@/components/home/PostTypeFilterModal';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { ContentFilterTypes } from '@/types';
import MessagesButton from '@/components/home/MessagesButton';
import UserUploadsPost from '@/components/home/UserUploadsPost';
import { set } from 'date-fns';

const Page = () => {
	const theme = useSystemTheme();
	const [FilterIsVisible, setFilterVisibility] = useState(false);
	const [UserPosts, SetUserPosts] = useState(posts);
	const [ContentFilterSelected, setSelectedContentFilter] =
		useState<ContentFilterTypes>(ContentFilterTypes.explore);

	const rotation = useRef(new Animated.Value(0)).current;

	const handleClickWheel = () => {
		setFilterVisibility(!FilterIsVisible);

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

	const FilterPosts = (type: string) => {
		let filteredPosts = filterPosts(posts, type);

		SetUserPosts(filteredPosts);
		setFilterVisibility(false);
	};

	const HandleFilterContentType = (type: ContentFilterTypes) => {
		setSelectedContentFilter(type);
	};

	// video upload stuff
	const [userUploadsVideo, setUserUploadsVideo] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const [uploadFinished, setUploadFinished] = useState<boolean>(false);
	const [videoData, setVideoData] = useState<string | null>(null);

	const { video_upload, video_cover, video_data } = useLocalSearchParams();

	useEffect(() => {
		console.log(video_upload, video_cover);
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
		<ThemedView theme={theme} flex={1}>
			<Stack.Screen
				options={{
					headerTitle: () => <View></View>,
					headerRight: () => (
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
										xml={ScooterWheelReflexes}
										fill={Colors[theme].textPrimary}
										style={[
											{
												color: Colors[theme].textPrimary,
											},
										]}
									/>
								</Animated.View>
							</TouchableOpacity>

							<MessagesButton />
						</View>
					),
				}}
			/>

			<ScrollView>
				<View style={[styles.ContentFilterContainer]}>
					{Object.values(ContentFilterTypes).map((value) => (
						<HomePageFilterButton
							key={value}
							text={value as string}
							onPress={() =>
								HandleFilterContentType(value as ContentFilterTypes)
							}
							style={[
								{
									backgroundColor:
										ContentFilterSelected === value
											? Colors[theme].primary + 'rgba(255,0,0,0.3)'
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
					<NoDataPlaceholder />
				)}
			</ScrollView>

			<PostTypeFilterModal
				FilterIsVisible={FilterIsVisible}
				FilterPosts={FilterPosts}
				setFilterVisibility={setFilterVisibility}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	flatListContainer: {
		// paddingHorizontal: 15,
		// paddingTop: 10,
		paddingBottom: 100,
	},
	ContentFilterContainer: {
		padding: 10,
		flexDirection: 'row',
		gap: 10,
	},
});

export default Page;
