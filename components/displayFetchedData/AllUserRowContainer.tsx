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
import { fetchAdresses, selectedRiderInterface } from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import UserProfile from '@/app/(auth)/sharedPages/userProfile';
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
}

const AllUserRowContainer: React.FC<AllUserRowContainerProps> = ({
	contentTitle,
	bottomSheet,
	contentContainerStyle,
	rowStyle,
	excludeIds,
	costumHandleUserPress,
}) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
	const [allUsers, setAllUsers] = useState<ClerkUser[]>();
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
					res = res.filter((user: ClerkUser) => !excludeIds.includes(user.id));
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
		console.log(usersLoaded);
	}, [usersLoaded]);

	useEffect(() => {
		fetchUsers();
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
			params: { userId: selectedUserData._id, self: 'false' },
		});
	};

	return (
		<ThemedView
			theme={theme}
			// @ts-ignore
			style={[styles.container, contentContainerStyle]}
			flex={1}>
			{!usersLoaded || !allUsers ? (
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
										containerStyle={{ marginBottom: 100 }}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No users found"
									/>
								)}
								scrollEnabled={false}
								contentContainerStyle={{ flex: 1 }}
								data={allUsers}
								keyExtractor={(item) => item.id}
								renderItem={({ item: user }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleUserPress({
												name: user.username,
												_id: user.id,
												avatar: user.imageUrl,
												// @ts-ignore
												rank: user.rank ?? 'Diamond',
												// @ts-ignore
												rankPosition: user.rankPosition ?? 3,
											})
										}
										showAvatar={true}
										avatarUrl={user.imageUrl}
										title={user.username ?? 'no name user'}
										subtitle={'Rank Gold #1'}
									/>
								)}
							/>
						</BottomSheetScrollView>
					) : (
						<ScrollView
							contentContainerStyle={{
								flex: 1,
							}}>
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
								scrollEnabled={false}
								contentContainerStyle={{
									flex: 1,
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
								}}
								data={allUsers}
								keyExtractor={(item) => item.id}
								renderItem={({ item: FetchedUser }) => (
									<Row
										// @ts-ignore
										containerStyle={[rowStyle]}
										onPress={() =>
											handleUserPress({
												name: FetchedUser.username,
												_id: FetchedUser.id,
												avatar: FetchedUser.imageUrl,
												// @ts-ignore
												rank: FetchedUser.rank ?? 'Diamond',
												// @ts-ignore
												rankPosition: FetchedUser.rankPosition ?? 3,
											})
										}
										showAvatar={true}
										avatarUrl={FetchedUser.imageUrl}
										title={
											(FetchedUser.username === user?.username
												? 'You'
												: FetchedUser.username) ?? 'no name user'
										}
										subtitle={'Rank Silver #51' + ' ' + FetchedUser.id}
									/>
								)}
								ListEmptyComponent={() => (
									<NoDataPlaceholder
										containerStyle={{ marginBottom: 100 }}
										arrowStyle={{ display: 'none' }}
										subTextValue=""
										firstTextValue="No users found"
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
