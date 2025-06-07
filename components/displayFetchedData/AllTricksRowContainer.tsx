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
	Trick,
	TrickDifficulty,
	TrickType,
} from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import UserProfile from '@/app/(auth)/sharedPages/userProfile';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import NoDataPlaceholder from '../general/NoDataPlaceholder';

import Scooter from '../../assets/images/vectors/scooter.svg';

interface AllUserRowContainerProps {
	contentTitle?: string;
	bottomSheet?: boolean;
	contentContainerStyle?: ViewStyle | ViewStyle[];
	rowStyle?: ViewStyle | ViewStyle[];
	excludeIds?: number[];
	costumHandleTrickPress?: (user: selectedTrickInterface) => void;
}

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

	const [tricksLoaded, setTricksLoaded] = useState<boolean>(false);
	const [allTricks, setAllTricks] = useState<Trick[]>();

	// fetch all users
	const fetchTricks = () => {
		setTricksLoaded(false);

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
				setAllTricks(res);
			})
			.catch((err) =>
				console.warn('An error loading all tricks occurred: ', err),
			)
			.finally(() => setTricksLoaded(true));
	};

	useEffect(() => {
		fetchTricks();
	}, []);

	useEffect(() => {
		if (!tricksLoaded || !allTricks) return;
	}, [tricksLoaded, allTricks]);

	const handleTrickPress = (selectedTrickData: selectedTrickInterface) => {
		if (costumHandleTrickPress) {
			costumHandleTrickPress(selectedTrickData);
			return;
		}

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
		<ThemedView
			theme={theme}
			// @ts-ignore
			style={[styles.container, contentContainerStyle]}
			flex={1}>
			{!tricksLoaded || !allTricks ? (
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
								keyExtractor={(item) => item.Name}
								renderItem={({ item: trick }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleTrickPress({
												Id: trick.Name,
												Name: trick.Name,
												DefaultPoints: trick.DefaultPoints,
												Difficulty: TrickDifficulty.GOATED,
												Costum: false,
												Type: trick.Type as TrickType,
											})
										}
										avatarIsSVG
										showAvatar={true}
										avatarUrl={Scooter}
										title={trick.Name ?? 'no name trick'}
										subtitle={'Rank Gold #1' + ' ' + trick.Name}
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
								keyExtractor={(item) => item.Name}
								renderItem={({ item: FetchedTrick }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleTrickPress({
												Id: FetchedTrick.Name,
												Name: FetchedTrick.Name,
												DefaultPoints: FetchedTrick.DefaultPoints,
												Difficulty: TrickDifficulty.GOATED,
												Costum: false,
												Type: FetchedTrick.Type as TrickType,
											})
										}
										showAvatar={true}
										avatarIsSVG
										avatarUrl={Scooter}
										title={FetchedTrick.Name ?? 'no name trick'}
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
