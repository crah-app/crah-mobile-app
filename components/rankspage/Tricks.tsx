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
import { Link } from 'expo-router';
import TrickColumn from '../rows/TrickRow';

import {
	commonTricksDataStructure,
	dropDownMenuInputData,
	fetchAdresses,
	TrickDifficulty,
	TrickListFilterOptions,
	TrickListGeneralSpotCategory,
	TrickListOrderTypes,
} from '@/types';

import { getCachedData, setCachedData } from '@/hooks/cache';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import modalDummyContents from '@/JSON/non_dummy_data/inbox_help_modal_content.json';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import DropDownMenu from '../general/DropDownMenu';

interface TricksProps {}

const CACHE_KEY = 'commonTricks';

const Tricks: React.FC<TricksProps> = ({}) => {
	const insets = useSafeAreaInsets();
	const theme = useSystemTheme();

	const [commonTricks, setCommonTricks] = useState<
		commonTricksDataStructure[] | undefined
	>();

	const [commonTricksLoaded, setCommonTricksLoaded] = useState(false);
	const [errWhileLoadingCommonTricks, setErrWhileLoadingCommonTricks] =
		useState<Falsy | Error>(false);

	const fetchCommonTricks = async () => {
		setCommonTricksLoaded(false);
		setErrWhileLoadingCommonTricks(null);

		const cached = await getCachedData<commonTricksDataStructure[]>(CACHE_KEY);

		if (cached) {
			setCommonTricks(cached);
			setCommonTricksLoaded(true);
			console.log('loaded common tricks from cache');
			return;
		}

		console.log('fetch common tricks');

		fetch('http://192.168.0.136:4000/public/tricks/commonTricks.json', {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then(async (res) => {
				setCommonTricks(res.commonTricks);
				await setCachedData(CACHE_KEY, res.commonTricks);
			})
			.catch((err) => setErrWhileLoadingCommonTricks(err))
			.finally(() => setCommonTricksLoaded(true));
	};

	useEffect(() => {
		fetchCommonTricks();
	}, []);

	useEffect(() => {
		console.log(commonTricks);
	}, [commonTricks]);

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
	commonTricks: commonTricksDataStructure[] | undefined | [];
}> = ({ commonTricks }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const HandleTrickPress = () => {};

	useEffect(() => {
		console.log(commonTricks);
	}, [commonTricks]);

	return (
		<ScrollView
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
				keyExtractor={(item) => `${item.words[0]} ${item.words[1]}`}
				renderItem={({ item }) => (
					<Link
						asChild
						href={{
							pathname: '/modals/TrickModal',
							params: {
								data: JSON.stringify({
									trickName: `${item.words[0]} ${item.words[1]}`,
									trickDescription: 'trick description',
								}),
							},
						}}>
						<TrickColumn
							name={`${item.words[0]} ${item.words[1]}`}
							points={100}
							difficulty={TrickDifficulty.POTENTIAL_WORLDS_FIRST}
							landed={'landed'}
							onPress={() => HandleTrickPress()}
						/>
					</Link>
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
			<TextInput
				style={[
					styles.search_input,
					{
						color: Colors[theme].textPrimary,
						backgroundColor: Colors[theme].container_surface,
						cursor: Colors[theme].textPrimary,
					},
				]}
				placeholderTextColor={'grey'}
				placeholder="Search a trick..."
				value={text}
				onChangeText={(text) => setText(text)}
				clearButtonMode="always"
				cursorColor={Colors[theme].primary}
			/>

			<View
				style={[
					styles.HeaderBottomWrapper,
					{ borderBottomColor: Colors[theme].textPrimary },
				]}>
				<View style={styles.headerContainerWrapper}>
					<DropDownMenu
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
					/>

					<DropDownMenu
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
					/>
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
	search_input: {
		padding: 12,
		width: Dimensions.get('window').width * 0.95,
		borderRadius: 10,
		marginBottom: 10,
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
