import ClerkUser from '@/types/clerk';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
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
	CrahUser,
	fetchAdresses,
	RankColors,
	RankColorsDark,
	selectedRiderInterface,
} from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import NoDataPlaceholder from '../general/NoDataPlaceholder';

interface AllUserRowContainerProps {
	contentTitle?: string;
	bottomSheet?: boolean;
	contentContainerStyle?: ViewStyle | ViewStyle[];
	rowStyle?: ViewStyle | ViewStyle[];
	excludeIds?: Array<ClerkUser['id'] | undefined>;
	costumHandleUserPress?: (
		user: selectedRiderInterface,
	) => void | Promise<void>;
	CostumRow?: React.ComponentType<any>;
	users?: CrahUser[] | null;
	listEmpyComponentStyle?: ViewStyle | ViewStyle[];
	provideExternUserDataArray?: boolean;
	limitOffsetScroll?: boolean;
	loadMore?: () => void;
	loadingMore?: boolean;
	retryFunction?: () => void;
	displayRetryBtn?: boolean;
	user: CrahUser | ClerkUser | null;
}

const AllUserRowContainer: React.FC<AllUserRowContainerProps> = ({
	contentTitle,
	bottomSheet,
	contentContainerStyle,
	rowStyle,
	excludeIds,
	costumHandleUserPress,
	CostumRow,
	users = [],
	listEmpyComponentStyle,
	provideExternUserDataArray = false,
	limitOffsetScroll = false,
	loadMore = () => {},
	loadingMore = false,
	retryFunction,
	displayRetryBtn = true,
	user,
}) => {
	const theme = useSystemTheme();

	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
	const [allUsers, setAllUsers] = useState<CrahUser[]>();
	const [noUsersFound, setNoUsersFound] = useState<boolean>(false);

	// fetch all users
	const fetchUsers = () => {
		setUsersLoaded(false);
		setNoUsersFound(false);

		fetch(fetchAdresses.allUsers, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				if (excludeIds) {
					res = res.filter((user: CrahUser) => !excludeIds.includes(user.Id));
				}
				if (res.length === 0) {
					console.warn('No users found');
					setUsersLoaded(true);
					setNoUsersFound(true);
					setAllUsers([]);
					return;
				}
				setAllUsers(res);
				// console.log(res);
			})
			.catch((err) =>
				console.warn('An error loading all users occurred: ', err),
			)
			.finally(() => setUsersLoaded(true));
	};

	useEffect(() => {
		if (users && Array.isArray(users) && users.length > 0) {
			setAllUsers(users);
			setUsersLoaded(true);
			return;
		}
		if (!provideExternUserDataArray) {
			fetchUsers();
		}
	}, []);

	useEffect(() => {
		if (!usersLoaded || !allUsers) return;
	}, [usersLoaded, allUsers]);

	const handleUserPress = (selectedUserData: selectedRiderInterface) => {
		if (costumHandleUserPress) {
			costumHandleUserPress(selectedUserData);
			return;
		}

		router.push({
			pathname: '/(auth)/sharedPages/userProfile',
			params: {
				userId: selectedUserData._id,
				self: selectedUserData._id !== user?.id ? 'false' : 'true',
				linking: 'true',
			},
		});
	};

	useEffect(() => {
		console.log(excludeIds);
		return () => {};
	}, [excludeIds]);

	return (
		<ThemedView
			theme={theme}
			// @ts-ignore
			style={[styles.container, contentContainerStyle]}
			flex={0}>
			{!usersLoaded || !allUsers ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						top: 100,
					}}>
					<CrahActivityIndicator
						color={Colors[theme].primary}
						size={defaultHeaderBtnSize}
					/>
				</View>
			) : (
				<View style={{ flex: 0, gap: 12 }}>
					{bottomSheet ? (
						<View>
							{contentTitle && allUsers.length > 0 && !noUsersFound ? (
								<ThemedText
									theme={theme}
									value={contentTitle ?? 'Riders'}
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
								/>
							) : (
								<View></View>
							)}

							<FlatList
								ListEmptyComponent={() => (
									<NoDataPlaceholder
										containerStyle={{
											height: Dimensions.get('window').height * 0.4,
										}}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No users found"
										retryFunction={retryFunction}
										displayRetryBtn={displayRetryBtn}
									/>
								)}
								scrollEnabled={false}
								contentContainerStyle={{ flex: 1 }}
								data={allUsers}
								keyExtractor={(item) => item.id}
								renderItem={({ item: user }) => (
									<View>
										{!CostumRow ? (
											<Row
												// @ts-ignore
												containerStyle={[rowStyle]}
												onPress={() =>
													handleUserPress({
														name: user.Name,
														_id: user.Id,
														avatar: user.avatar,
														rank: user.rank,
														rankPosition: user.rankPoints,
													})
												}
												showAvatar={true}
												avatarUrl={user.avatar}
												title={user.Name ?? 'no name user'}
												subtitle={`${user?.rank}`}
												subtitleStyle={{ color: RankColors[user?.rank][0] }}
											/>
										) : (
											<CostumRow user={user} />
										)}
									</View>
								)}
								onEndReached={() => {
									if (loadingMore || !limitOffsetScroll) return;
									loadMore();
								}}
								onEndReachedThreshold={limitOffsetScroll ? 0.5 : 0}
							/>
						</View>
					) : (
						<View>
							{contentTitle && allUsers.length > 0 && !noUsersFound ? (
								<ThemedText
									theme={theme}
									value={contentTitle ?? 'Riders'}
									style={[
										defaultStyles.biggerText,
										{ paddingHorizontal: 12, marginBottom: 12 },
									]}
								/>
							) : (
								<View></View>
							)}

							<FlatList
								scrollEnabled={true}
								contentContainerStyle={{
									flex: 0,
									justifyContent: 'center',
									alignItems: 'center',
									gap: 10,
								}}
								data={allUsers}
								keyExtractor={(item) => item.id}
								renderItem={({ item: FetchedUser }) => (
									<View>
										{!CostumRow ? (
											<Row
												// @ts-ignore
												containerStyle={[rowStyle]}
												onPress={() =>
													handleUserPress({
														name: FetchedUser.Name,
														_id: FetchedUser.Id,
														avatar: FetchedUser.avatar,
														rank: FetchedUser.rank,
														rankPosition: FetchedUser.rankPoints,
													})
												}
												showAvatar={true}
												avatarUrl={FetchedUser.avatar}
												title={
													(FetchedUser.Name === user?.username
														? 'You'
														: FetchedUser.Name) ?? 'no name user'
												}
												subtitle={`Rank ${FetchedUser.rank}`}
												highlightWords={[FetchedUser.rank]}
												highlightColor={RankColors[FetchedUser.rank][0]}
											/>
										) : (
											<CostumRow user={FetchedUser} />
										)}
									</View>
								)}
								ListEmptyComponent={() => (
									<NoDataPlaceholder
										containerStyle={[
											{ marginBottom: 100 },
											// @ts-ignore
											listEmpyComponentStyle,
										]}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No users found"
										retryFunction={retryFunction}
									/>
								)}
								onEndReached={() => {
									if (loadingMore || !limitOffsetScroll) return;
									loadMore();
								}}
								onEndReachedThreshold={limitOffsetScroll ? 0.5 : 0}
							/>
						</View>
					)}
				</View>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {},
	userContainer: {},
});

export default AllUserRowContainer;
