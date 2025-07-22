import { PAGE_SIZE, RawPost } from '@/types';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ThemedText from '../general/ThemedText';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import UserPost from '../home/UserPost';
import { FlashList } from '@shopify/flash-list';

const VideosRowContainer = () => {
	const { getToken } = useAuth();
	const { user } = useUser();
	const theme = useSystemTheme();

	const [videos, setVideos] = useState<RawPost[]>([]);

	const [limit, setLimit] = useState<number>(50);
	const [page, setPage] = useState(0);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const fetchVideoPosts = async (pageNumber: number) => {
		try {
			const token = await getToken();
			const offset = pageNumber * PAGE_SIZE;

			const response = await fetch(
				`http://192.168.0.136:4000/api/posts/${'Article'}/${offset}/${limit}/${
					user?.id
				}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}

			const result = JSON.parse(text);

			if (result.length < PAGE_SIZE) {
				setHasMore(false);
			}

			if (pageNumber === 0) {
				setVideos(result);
			} else {
				setVideos((prev) => [...prev, ...result]);
			}
		} catch (error) {
			console.warn('Error fetchVideoPosts', error);
		}
	};

	useEffect(() => {
		fetchVideoPosts(0);
	}, []);

	const handleLoadMore = async () => {
		if (isFetchingMore || !hasMore) return;

		setIsFetchingMore(true);
		const nextPage = page + 1;
		await fetchVideoPosts(nextPage);
		setPage(nextPage);
		setIsFetchingMore(false);
	};

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<ThemedText
				theme={theme}
				value={'Top Article Posts'}
				style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
			/>

			<FlashList
				keyExtractor={(item) => item.Id.toString()}
				data={videos}
				renderItem={({ item }) => <UserPost post={item} />}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.3}
				ListFooterComponent={
					isFetchingMore ? (
						<CrahActivityIndicator
							style={{ marginVertical: 20 }}
							color={Colors[theme].primary}
							size={defaultHeaderBtnSize}
						/>
					) : null
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default VideosRowContainer;
