import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	Dimensions,
	SectionList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import ThemedText from '@/components/general/ThemedText';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';

import FriendRequestColumn from '@/components/rows/FriendRequestRow';
import UpdateInformationColumn from '@/components/rows/UpdateInformationRow';

// dummy data. replace with database data
import UpdateInformation from '@/JSON/update_information_modal_content.json';
import RankColumn from '@/components/rows/InboxRankRow';
import {
	helpPageParameter,
	InboxNotification,
	InboxNotificationType,
	Rank,
} from '@/types';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import FriendRequestRow from '@/components/rows/FriendRequestRow';
import UpdateInformationRow from '@/components/rows/UpdateInformationRow';
import RankRow from '@/components/rows/InboxRankRow';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import { useInboxNotifications } from '@/hooks/InboxNotifications';
import Row from '@/components/general/Row';

interface sectionizedNotification {
	title: string;
	data: InboxNotification[];
}

const Page = () => {
	const theme = useSystemTheme();

	const { notifications, count, error, loading } = useInboxNotifications();

	const [sectionizedNotifications, setSectionizedNotifications] = useState<
		sectionizedNotification[]
	>([]);

	// Friend Requests
	const handleAccept = () => {
		Alert.alert('Friend Request Accepted', 'You are now friends!');
	};

	const handleDecline = () => {
		Alert.alert('Friend Request Declined', 'You declined the request.');
	};

	// Update Information Modal
	const HandleUpdateInformationPress = () => {
		router.push({
			pathname: '/modals/help_modal',
			params: { first: 'Inbox' },
		});
	};

	useEffect(() => {
		if (!notifications) return;

		const formatNotifications = (notifications: InboxNotification[]) => {
			const grouped = notifications.reduce((acc, curr) => {
				const type: string = curr.Type;

				if (!acc[type]) acc[type] = [];

				acc[type].push(curr);

				return acc;
			}, {} as Record<string, InboxNotification[]>);

			const sections = Object.keys(grouped).map((val) => ({
				title: val,
				data: grouped[val],
			}));

			setSectionizedNotifications(sections);
		};

		formatNotifications(notifications);
	}, [notifications]);

	const getSectionTitle = (title: InboxNotificationType): string => {
		switch (title) {
			case 'friend_request':
				return 'Friend Requests';

			case 'new_follower':
				return 'New Follower';

			case 'post_like':
				return 'Post Like';

			case 'rank_up':
				return 'Rank Ups';

			case 'system_update':
				return 'System Update';
		}
	};

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'row',
								gap: 6,
							}}>
							<TouchableOpacity onPress={router.back}>
								<Ionicons
									name="chevron-back-outline"
									size={defaultHeaderBtnSize - 4}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<HeaderLeftLogo />
						</View>
					}
					headerRight={
						<Link
							asChild
							href={{
								params: { first: helpPageParameter.inbox },
								pathname: '/modals/help_modal',
							}}>
							<TouchableOpacity>
								<Ionicons
									name="help-circle-outline"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</Link>
					}
				/>
			}
			scrollEnabled={true}
			scrollChildren={
				<ThemedView theme={theme} flex={1} style={styles.container}>
					<View style={styles.content_container}>
						{notifications && sectionizedNotifications ? (
							<View>
								<SectionList
									scrollEnabled={false}
									sections={sectionizedNotifications}
									keyExtractor={(item) => item.Id.toString()}
									renderItem={({ item }) => {
										switch (item.Type) {
											case 'friend_request':
												return (
													<FriendRequestRow
														name={item.SenderId}
														avatar="https://randomuser.me/api/portraits/men/32.jpg"
														onAccept={handleAccept}
														onDecline={handleDecline}
														id={1}
													/>
												);

											case 'rank_up':
												return (
													<View>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
														<RankRow
															currentRank={Rank.Gold}
															previousRank={Rank.Silver}
															onPress={() =>
																console.log('Rank details clicked')
															}
														/>
													</View>
												);

											case 'new_follower':
												return <Row title={'new follower'} />;

											case 'post_like':
												return <Row title={'post like'} />;

											case 'system_update':
												return (
													<UpdateInformationRow
														updateNumber={1.15}
														title="The Update 1.15 is here!"
														subtitle="Click for new features and improvements."
														onPress={() => HandleUpdateInformationPress()}
													/>
												);
										}
									}}
									renderSectionHeader={({ section: { title } }) => (
										<ThemedView
											style={[
												styles.sectionHeader,
												{
													paddingHorizontal: 8,
												},
											]}
											theme={theme}>
											<ThemedText
												theme={theme}
												style={[
													styles.sectionHeaderText,
													{
														paddingVertical: 12,
														borderBottomWidth: 3,
														borderBottomColor: Colors.dark.surface,
													},
												]}
												value={getSectionTitle(title as InboxNotificationType)}
											/>
										</ThemedView>
									)}
								/>
							</View>
						) : (
							<View
								style={{
									flex: 1,
									bottom: 128,
								}}>
								<NoDataPlaceholder
									containerStyle={{ flex: 1 }}
									firstTextValue="You have no inbox messages currently"
									arrowStyle={{ display: 'none' }}
								/>
							</View>
						)}
					</View>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {},
	header_container: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 14,
	},
	content_container: {
		flex: 1,
	},
	sectionHeader: {
		padding: 10,
	},
	sectionHeaderText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default Page;
