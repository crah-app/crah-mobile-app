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
import { fetchAdresses } from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import { router } from 'expo-router';
import UserProfile from '@/app/(auth)/(tabs)/sharedPages/userProfile';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface AllUserRowContainerProps {
	contentTitle?: string;
	bottomSheet?: boolean;
	contentContainerStyle?: ViewStyle | ViewStyle[];
	rowStyle?: ViewStyle | ViewStyle[];
	excludeIds?: Array<ClerkUser['id'] | undefined>;
}

const AllUserRowContainer: React.FC<AllUserRowContainerProps> = ({
	contentTitle,
	bottomSheet,
	contentContainerStyle,
	rowStyle,
	excludeIds,
}) => {
	const theme = useSystemTheme();

	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
	const [allUsers, setAllUsers] = useState<ClerkUser[]>();

	// fetch all users
	const fetchUsers = () => {
		setUsersLoaded(false);

		fetch(fetchAdresses.allUsers, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				if (excludeIds) {
					res = res.filter((user: ClerkUser) => !excludeIds.includes(user.id));
				}
				// if (res.length === 0) {
				// 	console.warn('No users found');
				// 	return;
				// }
				setAllUsers(res);
				console.log(res);
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
		if (!usersLoaded || !allUsers) return;
	}, [usersLoaded, allUsers]);

	const handleUserPress = (userId: string) => {
		router.push({
			pathname: '/(auth)/(tabs)/sharedPages/userProfile',
			params: { userId, self: 'false' },
		});
	};

	return (
		<ThemedView
			theme={theme}
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
							{contentTitle && (
								<ThemedText
									theme={theme}
									value={contentTitle ?? 'Riders'}
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
								/>
							)}

							<FlatList
								scrollEnabled={false}
								contentContainerStyle={{ flex: 1 }}
								data={allUsers}
								keyExtractor={(item) => item.id}
								renderItem={({ item: user }) => (
									<Row
										containerStyle={[rowStyle]}
										onPress={() => handleUserPress(user.id)}
										showAvatar={true}
										avatarUrl={user.imageUrl}
										title={user.username ?? 'no name user'}
										subtitle={'Rank Silver #51' + ' ' + user.id}
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
									value={contentTitle ?? 'Riders'}
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
								/>
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
								renderItem={({ item: user }) => (
									<Row
										containerStyle={[rowStyle]}
										onPress={() => handleUserPress(user.id)}
										showAvatar={true}
										avatarUrl={user.imageUrl}
										title={user.username ?? 'no name user'}
										subtitle={'Rank Silver #51' + ' ' + user.id}
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
