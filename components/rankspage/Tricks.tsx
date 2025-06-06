import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	Falsy,
	FlatList,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link, router } from 'expo-router';
import TrickRow from '../rows/TrickRow';

import {
	commonTricksDataStructure,
	dropDownMenuInputData,
	fetchAdresses,
	selectedTrickInterface,
	Trick,
	TrickDifficulty,
	TrickListFilterOptions,
	TrickListGeneralSpotCategory,
	TrickListOrderTypes,
	TrickType,
} from '@/types';

import { getCachedData, setCachedData } from '@/hooks/cache';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
// import DropDownMenu from '../general/DropDownMenu';
import SearchBar from '../general/SearchBar';
import { getTrickTitle } from '@/utils/globalFuncs';

interface TricksProps {}

const CACHE_KEY = 'commonTricks';

const Tricks: React.FC<TricksProps> = ({}) => {
	const theme = useSystemTheme();

	const [commonTricks, setCommonTricks] = useState<Trick[] | undefined>();

	const [commonTricksLoaded, setCommonTricksLoaded] = useState(false);
	const [errWhileLoadingCommonTricks, setErrWhileLoadingCommonTricks] =
		useState<Falsy | Error>(false);

	const fetchCommonTricks = async () => {
		setCommonTricksLoaded(false);
		setErrWhileLoadingCommonTricks(null);

		const cached = await getCachedData<Trick[]>(CACHE_KEY);

		if (cached) {
			setCommonTricks(cached);
			setCommonTricksLoaded(true);
			console.log('loaded common tricks from cache');
			return;
		}

		console.log('fetch common tricks');

		fetch(fetchAdresses.allTricks, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then(async (res) => {
				setCommonTricks(res);
				await setCachedData(CACHE_KEY, res);
			})
			.catch((err) => setErrWhileLoadingCommonTricks(err))
			.finally(() => setCommonTricksLoaded(true));
	};

	useEffect(() => {
		fetchCommonTricks();
	}, []);

	useEffect(() => {
		errWhileLoadingCommonTricks &&
			console.warn(
				'An error while loading common tricks occured: ',
				errWhileLoadingCommonTricks,
			);
	}, [errWhileLoadingCommonTricks]);

	return (
		<View style={[styles.container]}>
			{/* load trick list */}
			{!commonTricksLoaded ? (
				<CrahActivityIndicator
					size={'large'}
					color={Colors[theme].primary}
					style={{
						position: 'absolute',
						bottom: Dimensions.get('screen').height * 0.7,
					}}
				/>
			) : (
				<TrickList commonTricks={commonTricks!} />
			)}
		</View>
	);
};

const TrickList: React.FC<{
	commonTricks: Trick[] | undefined | [];
}> = ({ commonTricks }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleTrickPress = (selectedTrickData: selectedTrickInterface) => {
		router.push({
			pathname: '/modals/TrickModal',
			params: {
				trickName: selectedTrickData.Name,
				trickDescription: 'lel',
				trickId: selectedTrickData.Name,
				trickType: selectedTrickData.Type,
				trickDefaultPoints: selectedTrickData.DefaultPoints,
			},
		});
	};

	return (
		<ScrollView
			scrollEnabled={true}
			showsVerticalScrollIndicator={false}
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={{
				justifyContent: 'center',
				alignItems: 'center',
				width: Dimensions.get('window').width,
			}}>
			<TrickListHeader text={searchQuery} setText={setSearchQuery} />
			<FlatList
				scrollEnabled={false}
				data={commonTricks}
				keyExtractor={(item) => item.Name}
				renderItem={({ item }: { item: Trick }) => (
					<TrickRow
						name={item.Name}
						points={100}
						difficulty={TrickDifficulty.POTENTIAL_WORLDS_FIRST}
						landed={'landed'}
						onPress={() =>
							handleTrickPress({
								Id: item.Name,
								Name: item.Name,
								DefaultPoints: item.DefaultPoints,
								Difficulty: TrickDifficulty.NOVICE,
								Type: item.Type as TrickType,
							})
						}
					/>
				)}
				contentContainerStyle={{ height: 'auto', paddingBottom: 270 }}
			/>
		</ScrollView>
	);
};

const TrickListHeader: React.FC<{
	text: string;
	setText: (text: string) => void;
}> = ({ text, setText }) => {
	const theme = useSystemTheme();

	const OrderOptions = [
		{
			key: 0,
			text: TrickListOrderTypes.DIFFICULTY,
		},
		{
			key: 1,
			text: TrickListOrderTypes.LANDEDFIRST,
		},
		{
			key: 2,
			text: TrickListOrderTypes.LANDEDLAST,
		},
	];

	const [FilterOptions, setFilterOptions] = useState<dropDownMenuInputData[]>(
		[],
	);

	const [selectedCategory, setSelectedCategory] =
		useState<TrickListGeneralSpotCategory>(TrickListGeneralSpotCategory.ALL);

	useEffect(() => {
		const options = Object.values(TrickListFilterOptions).map((val, key) => ({
			key,
			text: val,
		}));
		setFilterOptions(options);
	}, []);

	const handleFilterBtnEvent = (key: number) => {};

	return (
		<View
			style={{
				width: '100%',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				marginBottom: 10,
			}}>
			<SearchBar
				placeholder={'Search for a trick'}
				query={text}
				setQuery={setText}
			/>

			<View
				style={[
					styles.HeaderBottomWrapper,
					{ borderBottomColor: Colors[theme].textPrimary },
				]}>
				<View style={styles.headerContainerWrapper}>
					{/* <DropDownMenu
						items={OrderOptions}
						onSelect={handleFilterBtnEvent}
						triggerComponent={
							<TouchableOpacity>
								<View style={{ flexDirection: 'row' }}>
									<ThemedText theme={theme} value={'Order'} />
									<Ionicons
										name="chevron-expand"
										color={Colors[theme].textPrimary}
										size={16}
									/>
								</View>
							</TouchableOpacity>
						}
					/> */}

					{/* <DropDownMenu
						items={FilterOptions}
						onSelect={handleFilterBtnEvent}
						triggerComponent={
							<TouchableOpacity>
								<View style={{ flexDirection: 'row' }}>
									<ThemedText theme={theme} value={'Filter'} />
									<Ionicons
										name="chevron-expand"
										color={Colors[theme].textPrimary}
										size={16}
									/>
								</View>
							</TouchableOpacity>
						}
					/> */}
				</View>

				<View style={styles.headerContainerWrapper}>
					{Object.values(TrickListGeneralSpotCategory).map((val, key) => (
						<TouchableOpacity
							key={key}
							onPress={() => setSelectedCategory(val)}>
							<View style={{ flexDirection: 'row' }}>
								<ThemedText
									theme={theme}
									value={val}
									style={{
										color:
											selectedCategory === val
												? Colors[theme].primary
												: Colors[theme].textPrimary,
									}}
								/>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		justifyContent: 'center',
		alignItems: 'center',
	},
	HeaderBottomWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 8,
		width: Dimensions.get('window').width * 0.94,
		borderBottomWidth: 1,
		paddingBottom: 10,
	},
	headerContainerWrapper: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		flexDirection: 'row',
		gap: 8,
	},
});

export default Tricks;
