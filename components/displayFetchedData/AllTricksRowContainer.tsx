import ClerkUser from '@/types/clerk';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import ThemedView from '../general/ThemedView';
import Row from '../general/Row';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import Colors from '@/constants/Colors';
import {
	fetchAdresses,
	selectedRiderInterface,
	selectedTrickInterface,
	TrickDifficulty,
} from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import UserProfile from '@/app/(auth)/sharedPages/userProfile';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import NoDataPlaceholder from '../general/NoDataPlaceholder';

import Scooter from '../../assets/images/vectors/scooter.svg';
import { getTrickTitle } from '@/utils/globalFuncs';

interface AllUserRowContainerProps {
	contentTitle?: string;
	bottomSheet?: boolean;
	contentContainerStyle?: ViewStyle | ViewStyle[];
	rowStyle?: ViewStyle | ViewStyle[];
	excludeIds?: number[];
	costumHandleTrickPress?: (user: selectedTrickInterface) => void;
}

interface Trick {
	id: number;
	name: string;
	costum?: boolean;
}

// temporary function for tricks object
const transformCommonTricks = (data: {
	commonTricks: { words: string[] }[];
}): Trick[] => {
	return data.commonTricks.map((trickObj, index) => ({
		id: index,
		name: trickObj.words.join(' '),
	}));
};

const AllUserRowContainer: React.FC<AllUserRowContainerProps> = ({
	contentTitle,
	bottomSheet,
	contentContainerStyle,
	rowStyle,
	excludeIds,
	costumHandleTrickPress,
}) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
	const [allTricks, setAllTricks] = useState<Trick[]>();

	// fetch all users
	const fetchUsers = () => {
		setUsersLoaded(false);

		fetch(fetchAdresses.allTricks, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.length === 0) {
					console.warn('No tricks found');
					return;
				}

				console.log(res);

				setAllTricks(transformCommonTricks(res));
			})
			.catch((err) =>
				console.warn('An error loading all users occurred: ', err),
			)
			.finally(() => setUsersLoaded(true));
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		if (!usersLoaded || !allTricks) return;
	}, [usersLoaded, allTricks]);

	const handleTrickPress = (selectedTrickData: selectedTrickInterface) => {
		if (costumHandleTrickPress) {
			costumHandleTrickPress(selectedTrickData);
			return;
		}

		router.push({
			pathname: '/modals/TrickModal',
			params: {
				data: JSON.stringify({
					trickName: selectedTrickData.name,
					trickDescription: 'lel',
				}),
			},
		});
	};

	return (
		<ThemedView
			theme={theme}
			// @ts-ignore
			style={[styles.container, contentContainerStyle]}
			flex={1}>
			{!usersLoaded || !allTricks ? (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<CrahActivityIndicator color={Colors[theme].surface} size={24} />
				</View>
			) : (
				<View style={{ flex: 1 }}>
					{bottomSheet ? (
						<BottomSheetScrollView
							contentContainerStyle={{
								flex: 1,
							}}>
							{contentTitle && (
								<ThemedText
									theme={theme}
									value={contentTitle ?? 'Tricks'}
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
								/>
							)}

							<FlatList
								ListEmptyComponent={() => (
									<NoDataPlaceholder
										containerStyle={{ marginBottom: 100 }}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No tricks found"
									/>
								)}
								scrollEnabled={false}
								contentContainerStyle={{ flex: 1 }}
								data={allTricks}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item: trick }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleTrickPress({
												id: trick.id,
												name: trick.name,
												difficulty: TrickDifficulty.GOATED,
												costum: false,
											})
										}
										avatarIsSVG
										showAvatar={true}
										avatarUrl={Scooter}
										title={trick.name ?? 'no name trick'}
										subtitle={'Rank Gold #1' + ' ' + trick.id}
									/>
								)}
							/>
						</BottomSheetScrollView>
					) : (
						<ScrollView
							contentContainerStyle={{
								flex: 1,
							}}>
							{contentTitle && (
								<ThemedText
									theme={theme}
									value={contentTitle ?? 'Tricks'}
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
								/>
							)}

							<FlatList
								ListEmptyComponent={() => (
									<NoDataPlaceholder
										containerStyle={{ marginBottom: 100 }}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No tricks found"
									/>
								)}
								scrollEnabled={false}
								contentContainerStyle={{
									flex: 1,
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
								}}
								data={allTricks}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item: FetchedTrick }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleTrickPress({
												id: FetchedTrick.id,
												name: FetchedTrick.name,
												difficulty: TrickDifficulty.GOATED,
												costum: false,
											})
										}
										showAvatar={true}
										avatarIsSVG
										avatarUrl={Scooter}
										title={FetchedTrick.name ?? 'no name trick'}
										subtitle={TrickDifficulty.INTERMEDIATE}
									/>
								)}
							/>
						</ScrollView>
					)}
				</View>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	userContainer: {
		flex: 1,
	},
});

export default AllUserRowContainer;
