import { PAGE_SIZE, RawPost } from '@/types';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import UserPost from '../home/UserPost';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';

const AllPostsRowContainer = () => {
	const { getToken } = useAuth();
	const { user } = useUser();

	const theme = useSystemTheme();

	const [posts, setPosts] = useState<RawPost[]>([]);

	const [limit, setLimit] = useState<number>(50);
	const [page, setPage] = useState(0);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const fetchPosts = async (pageNumber: number) => {
		try {
			const token = await getToken();
			const offset = pageNumber * PAGE_SIZE;

			const response = await fetch(
				`http://192.168.0.136:4000/api/posts/popular/${offset}/${limit}/${user?.id}`,
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
				setPosts(result);
			} else {
				setPosts((prev) => [...prev, ...result]);
			}
		} catch (error) {
			console.warn('Error [fetchMostPopularPosts]', error);
		}
	};

	useEffect(() => {
		fetchPosts(0);
	}, []);

	const handleLoadMore = async () => {
		if (isFetchingMore || !hasMore) return;

		setIsFetchingMore(true);
		const nextPage = page + 1;
		await fetchPosts(nextPage);
		setPage(nextPage);
		setIsFetchingMore(false);
	};

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<ThemedText
				value={'Top Posts'}
				theme={theme}
				style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
			/>
			<FlashList
				estimatedItemSize={20}
				data={posts}
				renderItem={({ item, index }) => <UserPost post={item} key={index} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default AllPostsRowContainer;
