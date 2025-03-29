import ClerkUser from '@/types/clerk';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import ThemedView from '../general/ThemedView';
import Row from '../general/Row';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import Colors from '@/constants/Colors';
import { fetchAdresses } from '@/types';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';

interface AllUserRowContainerProps {
	contentTitle?: string;
}

const AllUserRowContainer: React.FC<AllUserRowContainerProps> = ({
	contentTitle,
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
				setAllUsers(res);
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

	return (
		<ThemedView theme={theme} style={[styles.container]} flex={1}>
			{!usersLoaded || !allUsers ? (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<CrahActivityIndicator color={Colors[theme].surface} size={24} />
				</View>
			) : (
				<ScrollView contentContainerStyle={{ flex: 1 }}>
					<ThemedText
						theme={theme}
						value={contentTitle ?? 'Riders'}
						style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
					/>

					<FlatList
						scrollEnabled={false}
						contentContainerStyle={{ flex: 1 }}
						data={allUsers}
						keyExtractor={(item) => item.id}
						renderItem={({ item: user }) => (
							<Row
								showAvatar={true}
								avatarUrl={user.imageUrl}
								title={
									user.username ??
									user.firstName + user.lastName ??
									'no name user'
								}
								subtitle={'Rank Silver #51'}
							/>
						)}
					/>
				</ScrollView>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {},
	userContainer: {
		flex: 1,
	},
});

export default AllUserRowContainer;
