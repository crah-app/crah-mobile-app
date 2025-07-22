import { PAGE_SIZE, Trick } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ThemedText from '../general/ThemedText';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import Colors from '@/constants/Colors';
import TrickRow from '../rows/TrickRow';

const TricksRowContainer = () => {
	const { user } = useUser();
	const { getToken } = useAuth();

	const theme = useSystemTheme();

	const [tricks, setTricks] = useState<Trick[]>([]);
	const [limit, setLimit] = useState<number>(50);

	const [page, setPage] = useState(0);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	// fetch popular tricks
	// tricks that are associated with the most users
	const fetchTricks = async (pageNumber: number) => {
		try {
			const token = await getToken();
			const offset = pageNumber * PAGE_SIZE;

			const response = await fetch(
				`http://192.168.0.136:4000/api/tricks/lately/${offset}/${limit}/${user?.id}`,
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
				setTricks(result);
			} else {
				setTricks((prev) => [...prev, ...result]);
			}
		} catch (error) {
			console.warn('Error [fetchTricks]', error);
		}
	};

	useEffect(() => {
		fetchTricks(0);
	}, []);

	const handleLoadMore = async () => {
		if (isFetchingMore || !hasMore) return;

		setIsFetchingMore(true);
		const nextPage = page + 1;
		await fetchTricks(nextPage);
		setPage(nextPage);
		setIsFetchingMore(false);
	};

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<ThemedText
				theme={theme}
				value={'Lately Landed Tricks'}
				style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
			/>

			<FlatList
				keyExtractor={(item) => item.Name}
				data={tricks}
				renderItem={({ item }) => (
					<TrickRow
						name={item.Name}
						onPress={() => {}}
						landed={item.UserId ? 'landed' : 'not landed'}
					/>
				)}
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

export default TricksRowContainer;
