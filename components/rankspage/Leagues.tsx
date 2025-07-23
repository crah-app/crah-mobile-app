import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import UserRankRow from '../rows/UserRankRow';
import SearchBar from '../general/SearchBar';
import AllUserRowContainer from '../displayFetchedData/AllUserRowContainer';
import { CrahUser, CrahUserWithBestTrick, Rank } from '@/types';
import useCrahUser from '@/hooks/useCrahUser';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import NoDataPlaceholder from '../general/NoDataPlaceholder';
import LeaguesOptionsBottomSheet from './LeaguesOptionsBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';

interface LeaguesProps {
	theme: 'light' | 'dark';
}

type LeaderboardOption = 'Global' | keyof typeof Rank;

const LeaguesPage: React.FC<LeaguesProps> = ({ theme }) => {
	const { user: clerkUser, isLoaded } = useUser();
	const { user, error } = useCrahUser(clerkUser);

	const [pageError, setPageError] = useState<Error | null>(null);

	const [query, setQuery] = useState<string>('');
	const debouncedSearch = useDebouncedValue(query, 400);

	const [riders, setRiders] = useState<CrahUserWithBestTrick[] | null>(null);
	const [searchResults, setSearchResults] = useState<
		CrahUserWithBestTrick[] | null
	>(null);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	const [selectedOption, setSelectedOption] =
		useState<LeaderboardOption>('Global');

	const [offset, setOffset] = useState<number>(0);
	const [limit, setLimit] = useState<number>(40);
	const [loadingMore, setLoadingMore] = useState(false);

	const loadMoreRiders = async () => {
		if (loadingMore) return;
		setLoadingMore(true);

		console.log('loading more');

		try {
			setOffset((prevOffset) => prevOffset + limit);

			const response = await fetchUrl(selectedOption);
			const text = await response.text();

			if (!response.ok) throw new Error(text);

			const newResults: CrahUserWithBestTrick[] = JSON.parse(text);

			setRiders((prev) => (prev ? [...prev, ...newResults] : newResults));
		} catch (err) {
			console.warn('Error loading more users', err);
		} finally {
			setLoadingMore(false);
		}
	};

	const fetchUrl = async (
		selectedOption: LeaderboardOption,
	): Promise<Response> => {
		switch (selectedOption) {
			case 'Global':
				return await fetch(
					`http://192.168.0.136:4000/api/users/ranked/global/${limit}/${offset}`,
				);

			default:
				return await fetch(
					`http://192.168.0.136:4000/api/users/rank/${selectedOption}/${limit}/${offset}`,
				);
		}
	};

	const fetchRiders = async () => {
		try {
			if (error || !clerkUser || !user || !isLoaded || !selectedOption)
				throw new Error(
					`Precondition failed: error, clerkUser, user, selectedOption or isLoaded is missing. Additional error?: ${error}`,
				);

			const response = await fetchUrl(selectedOption);

			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}

			const result = JSON.parse(text);
			setRiders(result);
		} catch (error) {
			console.warn('Error [fetchRiders] in Component LeaguesPage', error);
		}
	};

	useEffect(() => {
		if (error) return;
		fetchRiders();
	}, [clerkUser, user, isLoaded, error]);

	useEffect(() => {
		if (query.length <= 0) {
			setSearchResults(null);
			setPageError(null);
		}
	}, [query]);

	useEffect(() => {
		if (!debouncedSearch) {
			setSearchResults(null);
			return;
		}

		const controller = new AbortController();

		const fetchSearchResult = async () => {
			try {
				const res = await fetch(
					`http://192.168.0.136:4000/api/users/ranked/${limit}/${offset}/search?q=${debouncedSearch}`,
					{ signal: controller.signal },
				);

				if (!res.ok) {
					const text = await res.text();
					throw new Error(`Search failed: ${text}`);
				}

				const result = await res.json();
				setSearchResults(result);
				setPageError(null);
			} catch (err) {
				if ((err as any).name === 'AbortError') return;
				console.warn('Search failed', err);
				setPageError(err as Error);
			}
		};

		fetchSearchResult();

		return () => controller.abort();
	}, [debouncedSearch]);

	const fetchSearchResult = () => {
		const controller = new AbortController();

		fetch(
			`http://192.168.0.136:4000/api/users/ranked/${limit}/${offset}/search?q=${debouncedSearch}`,
			{
				signal: controller.signal,
			},
		)
			.then(async (res) => {
				if (!res.ok) {
					const text = await res.text();
					console.warn(text);
					throw new Error(`Search failed: ${text}`);
				}
				return res.json();
			})
			.then((res: CrahUserWithBestTrick[]) => {
				res[0].TrickSpot = 'BlaBlaBliBlaBle';
				setSearchResults(res);
				setPageError(null);
			})
			.catch((err) => {
				if (err.name === 'AbortError') return;
				console.warn('Search failed', err);
				setPageError(err);
			});

		controller.abort();
	};

	const retryRequest = () => {
		if (query.length > 0) {
			setOffset(0);
			setLimit(40);
			fetchSearchResult();
		} else {
			setPageError(null);
			setOffset(0);
			setLimit(40);
			setRiders(null);
			fetchRiders();
		}
	};

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handlCloseModalPress = useCallback(() => {
		bottomSheetModalRef.current?.close();
	}, []);

	const showGlobalLeaderboard = () => {
		setOffset(0);
		setLimit(40);
		setRiders(null);
		setSelectedOption('Global');
		handlCloseModalPress();
	};
	const showSpecificRankLeaderboard = (rank: Rank) => {
		setOffset(0);
		setLimit(40);
		setRiders(null);
		setSelectedOption(rank);
		handlCloseModalPress();
	};

	useEffect(() => {
		fetchRiders();
	}, [selectedOption]);

	return (
		<View>
			<LeaguesOptionsBottomSheet
				theme={theme}
				ref={bottomSheetModalRef}
				showGlobalLeaderboard={showGlobalLeaderboard}
				showSpecificRankLeaderboard={showSpecificRankLeaderboard}
			/>

			<View style={[styles.leagues_container]}>
				{/* filter and search */}
				<View
					style={{
						height: 100,
						padding: 8,
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
					}}>
					<SearchBar
						query={query}
						setQuery={setQuery}
						placeholder={'Find a Rider to compare'}
						displayLeftSearchIcon
						displayOptionsBtn
						displayCloseRequestBtn
						containerStyle={{ flex: 0 }}
						onOptionsPress={() => {
							Keyboard.dismiss();
							handlePresentModalPress();
						}}
					/>
					<ThemedText
						theme={theme}
						value={
							query.length <= 0
								? `${selectedOption} Leaderboard`
								: `Search results for "${query}"`
						}
						style={[
							defaultStyles.biggerText,
							{ alignSelf: 'flex-start', paddingHorizontal: 4 },
						]}
					/>
				</View>

				{!pageError ? (
					<AllUserRowContainer
						loadingMore={loadingMore}
						limitOffsetScroll={
							(searchResults || riders || [])?.length >= 40 ? true : false
						}
						loadMore={loadMoreRiders}
						provideExternUserDataArray
						listEmpyComponentStyle={{ marginTop: 100 }}
						contentContainerStyle={{ flex: 0 }}
						// @ts-ignore
						CostumRow={UserRankRow}
						users={searchResults ?? riders}
						retryFunction={retryRequest}
					/>
				) : (
					<NoDataPlaceholder
						containerStyle={[styles.PlaceholderContentContainer]}
						firstTextValue="Something went wrong"
						subTextValue=""
						retryFunction={retryRequest}
					/>
				)}
			</View>

			{/* sticky view */}
			<View
				style={{
					padding: 8,
					top: Dimensions.get('window').height - 350,
					zIndex: 2,
					position: 'absolute',
				}}>
				{riders && riders.length > 0 && (
					<UserRankRow
						user={
							(riders || []).filter((rider) => rider.Id === clerkUser?.id)[0]
						}
						isSticky
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	leagues_container: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	TopThreeUsers: {
		alignContent: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	PlaceholderContentContainer: {
		bottom: 250,
	},
});

export default LeaguesPage;
