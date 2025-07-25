import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	Dimensions,
	Falsy,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { router } from 'expo-router';
import TrickRow from '../rows/TrickRow';

import {
	selectedTrickInterface,
	Trick,
	TrickDifficulty,
	TrickListFilterOptions,
	TrickListGeneralFilterParameterEnum,
	TrickListOrderTypes,
	TrickType,
	TrickTypeUI,
} from '@/types';

import { getCachedData, setCachedData } from '@/hooks/cache';
import Colors from '@/constants/Colors';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import SearchBar from '../general/SearchBar';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import OrderTricksByBottomSheetModal from './OrderTricksByBottomSheetModal';
import FilterTricksByBottomSheetModal from './FilterTricksByBottomSheetModal';
import filterTrickList, {
	filterTrickListByParameters,
	orderTrickList,
} from '@/hooks/filterTrickList';
import stringSimilarity from 'string-similarity';

interface TricksProps {}

const CACHE_KEY = 'commonTricks';

const Tricks: React.FC<TricksProps> = ({}) => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { getToken } = useAuth();

	const [commonTricks, setCommonTricks] = useState<Trick[] | undefined>();
	const [modifiedTrickList, setModifiedTrickList] = useState<
		Trick[] | undefined
	>();

	const [commonTricksLoaded, setCommonTricksLoaded] = useState(false);
	const [errWhileLoadingCommonTricks, setErrWhileLoadingCommonTricks] =
		useState<Falsy | Error>(false);

	const [selectedCategory, setSelectedCategory] =
		useState<TrickListGeneralFilterParameterEnum>(
			TrickListGeneralFilterParameterEnum.ALL,
		);
	const [orderType, setOrderType] = useState<TrickListOrderTypes>(
		TrickListOrderTypes.DEFAULT,
	);
	const [filterOption, setFilterOption] =
		useState<TrickListFilterOptions>('ALL');

	const fetchCommonTricks = async (
		selectedCategory: TrickListGeneralFilterParameterEnum,
	) => {
		setCommonTricksLoaded(false);
		setErrWhileLoadingCommonTricks(null);

		const cached = await getCachedData<Trick[]>(
			`commonTricks_category:${selectedCategory}_filter:${filterOption}_order:${orderType}`,
		);

		if (cached) {
			setCommonTricks(cached);
			setCommonTricksLoaded(true);
			console.log('loaded common tricks from cache');
			return;
		}

		const token = await getToken();

		console.log('fetch common tricks');

		fetch(
			`http://192.168.0.136:4000/api/tricks/all/${user?.id}/${selectedCategory}`,
			{
				headers: {
					'Cache-Control': 'no-cache',
					Authorization: `Bearer ${token}`,
				},
			},
		)
			.then((res) => res.json())
			.then(async (res) => {
				setCommonTricks(res);
				setModifiedTrickList(res);
				await setCachedData(CACHE_KEY, res);
			})
			.catch((err) => setErrWhileLoadingCommonTricks(err))
			.finally(() => setCommonTricksLoaded(true));
	};

	useEffect(() => {
		fetchCommonTricks(selectedCategory);
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
				<TrickList
					setTrickList={setCommonTricks}
					theme={theme}
					setSelectedCategory={setSelectedCategory}
					selectedCategory={selectedCategory}
					error={errWhileLoadingCommonTricks}
					commonTricks={commonTricks!}
					fetchCommonTricks={fetchCommonTricks}
					orderType={orderType}
					setOrderType={setOrderType}
					filterOption={filterOption}
					setFilterOption={setFilterOption}
					trickList={commonTricks}
					modifiedTrickList={modifiedTrickList}
					setModifiedTrickList={setModifiedTrickList}
				/>
			)}
		</View>
	);
};

const TrickList: React.FC<{
	commonTricks: Trick[] | undefined | [];
	error: Error | Falsy;
	setSelectedCategory: Dispatch<
		SetStateAction<TrickListGeneralFilterParameterEnum>
	>;
	selectedCategory: TrickListGeneralFilterParameterEnum;
	fetchCommonTricks: (category: TrickListGeneralFilterParameterEnum) => void;
	orderType: TrickListOrderTypes;
	setOrderType: Dispatch<SetStateAction<TrickListOrderTypes>>;
	filterOption: TrickListFilterOptions;
	setFilterOption: Dispatch<SetStateAction<TrickListFilterOptions>>;
	theme: 'light' | 'dark';
	trickList: Trick[] | undefined;
	setTrickList: Dispatch<SetStateAction<Trick[] | undefined>>;
	setModifiedTrickList: Dispatch<SetStateAction<Trick[] | undefined>>;
	modifiedTrickList: Trick[] | undefined;
}> = ({
	commonTricks,
	error,
	setSelectedCategory,
	selectedCategory,
	fetchCommonTricks,
	orderType,
	setOrderType,
	setFilterOption,
	filterOption,
	theme,
	trickList,
	setTrickList,
	setModifiedTrickList,
	modifiedTrickList,
}) => {
	const { bottom } = useSafeAreaInsets();

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
		<View>
			{!error ? (
				<View>
					<TrickListHeader
						setTrickList={setTrickList}
						filterOption={filterOption}
						orderType={orderType}
						setFilterOption={setFilterOption}
						setOrderType={setOrderType}
						fetchCommonTricks={fetchCommonTricks}
						setSelectedCategory={setSelectedCategory}
						selectedCategory={selectedCategory}
						text={searchQuery}
						setText={setSearchQuery}
						trickList={trickList}
						setModifiedTrickList={setModifiedTrickList}
						modifiedTrickList={modifiedTrickList}
					/>
					<FlatList
						ListHeaderComponent={
							<View
								style={{
									marginHorizontal: 12,
									marginVertical: 2,
									marginBottom: 8,
									flexDirection: 'column',
									gap: 12,
								}}>
								<View style={{ flexDirection: 'row', gap: 8 }}>
									<ThemedText
										style={{ color: Colors[theme].gray }}
										theme={theme}
										value={`Order: ${orderType}`}
									/>
									<ThemedText
										style={{ color: Colors[theme].gray }}
										theme={theme}
										value={`Filter: ${TrickTypeUI[filterOption]}`}
									/>
								</View>
								<ThemedText
									style={{ color: Colors[theme].gray }}
									theme={theme}
									value={`${
										(searchQuery.length <= 0
											? modifiedTrickList
											: modifiedTrickList?.filter((trick) => {
													if (
														stringSimilarity.compareTwoStrings(
															trick.Name.toLowerCase(),
															searchQuery.toLowerCase(),
														) > 0.7 ||
														stringSimilarity.compareTwoStrings(
															trick.SecondName?.toLowerCase() ?? '',
															searchQuery.toLowerCase(),
														) > 0.7
													) {
														return trick;
													}
											  })
										)?.length
									} Tricks`}
								/>
							</View>
						}
						initialNumToRender={5}
						maxToRenderPerBatch={5}
						windowSize={10}
						data={
							searchQuery.length <= 0
								? modifiedTrickList
								: modifiedTrickList?.filter((trick) => {
										if (
											stringSimilarity.compareTwoStrings(
												trick.Name.toLowerCase(),
												searchQuery.toLowerCase(),
											) > 0.5 ||
											stringSimilarity.compareTwoStrings(
												trick.SecondName?.toLowerCase() ?? '',
												searchQuery.toLowerCase(),
											) > 0.5
										) {
											return trick;
										}
								  })
						}
						keyExtractor={(item) => item.Name + Math.random()}
						renderItem={({ item }: { item: Trick }) => (
							<TrickRow
								name={item.Name}
								points={100}
								difficulty={item.Difficulty || TrickDifficulty.BEGINNER}
								landed={
									typeof item.UserId === 'string' ? 'landed' : 'not landed'
								}
								onPress={() =>
									handleTrickPress({
										Id: item.Name,
										Name: item.Name,
										DefaultPoints: item.DefaultPoints,
										Difficulty: item.Difficulty || TrickDifficulty.BEGINNER,
										Type: item.Type as TrickType,
									})
								}
							/>
						)}
						contentContainerStyle={{ paddingBottom: 95 + bottom + 150 }}
					/>
				</View>
			) : (
				<View></View>
			)}
		</View>
	);
};

const TrickListHeader: React.FC<{
	text: string;
	setText: (text: string) => void;
	setSelectedCategory: Dispatch<
		SetStateAction<TrickListGeneralFilterParameterEnum>
	>;
	selectedCategory: TrickListGeneralFilterParameterEnum;
	fetchCommonTricks: (category: TrickListGeneralFilterParameterEnum) => void;
	orderType: TrickListOrderTypes;
	setOrderType: Dispatch<SetStateAction<TrickListOrderTypes>>;
	filterOption: TrickListFilterOptions;
	trickList: Trick[] | undefined;
	setTrickList: Dispatch<SetStateAction<Trick[] | undefined>>;
	setFilterOption: Dispatch<SetStateAction<TrickListFilterOptions>>;
	setModifiedTrickList: Dispatch<SetStateAction<Trick[] | undefined>>;
	modifiedTrickList: Trick[] | undefined;
}> = ({
	text,
	setText,
	setSelectedCategory,
	selectedCategory,
	fetchCommonTricks,
	orderType,
	setOrderType,
	setFilterOption,
	filterOption,
	trickList,
	setTrickList,
	modifiedTrickList,
	setModifiedTrickList,
}) => {
	const theme = useSystemTheme();

	const handleOrderBtnEvent = (order: TrickListOrderTypes) => {
		setOrderType(order);

		const newList = orderTrickList(trickList, order);
		const modifiedList = filterTrickList(newList, filterOption);
		const filteredList = filterTrickListByParameters(
			modifiedList,
			selectedCategory,
		);

		setModifiedTrickList(filteredList);

		handleCloseOrderModalPress();
	};

	const handleFilterBtnEvent = (filter: TrickListFilterOptions) => {
		setFilterOption(filter);

		const newList = filterTrickList(trickList, filter);
		const modifiedList = orderTrickList(newList, orderType);
		const filteredList = filterTrickListByParameters(
			modifiedList,
			selectedCategory,
		);

		setModifiedTrickList(filteredList);

		handleCloseFilterModalPress();
	};

	const handleOnSpotBtnPress = (
		parameter: TrickListGeneralFilterParameterEnum,
	) => {
		setSelectedCategory(parameter);
		const newList = filterTrickListByParameters(trickList, parameter);
		const orderedList = orderTrickList(newList, orderType);
		const modifiedList = filterTrickList(orderedList, filterOption);

		setModifiedTrickList(modifiedList);
	};

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const bottomSheetFilterOptionsRef = useRef<BottomSheetModal>(null);

	const handlePresentOrderModalPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const handleCloseOrderModalPress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const handlePresentFilterModalPress = useCallback(() => {
		bottomSheetFilterOptionsRef.current?.present();
	}, []);

	const handleCloseFilterModalPress = useCallback(() => {
		bottomSheetFilterOptionsRef.current?.close();
	}, []);

	return (
		<View style={{ flex: 0 }}>
			<OrderTricksByBottomSheetModal
				handleOrderBtnEvent={handleOrderBtnEvent}
				theme={theme}
				ref={bottomSheetRef}
			/>
			<FilterTricksByBottomSheetModal
				ref={bottomSheetFilterOptionsRef}
				theme={theme}
				handleFilterBtnEvent={handleFilterBtnEvent}
			/>

			<View
				style={{
					width: '100%',
					height: 85,
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					marginBottom: 10,
					gap: 12,
				}}>
				<SearchBar
					displayLeftSearchIcon
					placeholder={'Search for a trick'}
					query={text}
					setQuery={setText}
				/>

				<View
					style={[
						styles.HeaderBottomWrapper,
						{ borderBottomColor: Colors[theme].textPrimary },
					]}>
					{/* buttons triggering modal */}
					<View style={styles.headerContainerWrapper}>
						<TouchableOpacity onPress={handlePresentOrderModalPress}>
							<View style={styles.optionsButtonWrapper}>
								<ThemedText theme={theme} value={'Order'} />
								<Ionicons
									name="chevron-expand"
									color={Colors[theme].textPrimary}
									size={16}
								/>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={handlePresentFilterModalPress}>
							<View style={styles.optionsButtonWrapper}>
								<ThemedText theme={theme} value={'Filter'} />
								<Ionicons
									name="chevron-expand"
									color={Colors[theme].textPrimary}
									size={16}
								/>
							</View>
						</TouchableOpacity>
					</View>

					{/* spot category buttons */}
					<View style={styles.headerContainerWrapper}>
						{Object.values(TrickListGeneralFilterParameterEnum).map(
							(val, key) => (
								<TouchableOpacity
									key={key}
									onPress={() => handleOnSpotBtnPress(val)}>
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
							),
						)}
					</View>
					{/*  */}
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
	optionsButtonWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});

export default Tricks;
