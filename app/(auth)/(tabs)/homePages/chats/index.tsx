import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import ThemedText from '@/components/general/ThemedText';
import MessageRow from '@/components/rows/MessageRow';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { ChatFilterTypes, UserStatus } from '@/types';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import { useUser } from '@clerk/clerk-expo';
import RenderFetchedData from '@/components/RenderFetchedData';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [messagesFilterSelected, setMessagesFilter] = useState<ChatFilterTypes>(
		ChatFilterTypes.all,
	);
	const [messagesDateFilter, setMessagesDateFilter] = useState<
		'latest' | 'oldest'
	>('latest');

	const [chats, setChats] = useState<any>();
	const [chatsLoaded, setChatsLoaded] = useState<boolean>();
	const [errLoadingChats, setErrLoadingChats] = useState<boolean>();

	const fetchChats = async () => {
		setErrLoadingChats(false);
		setChatsLoaded(false);

		fetch(`http://192.168.0.136:4000/api/chats/byUserId/${user?.id}`, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setChats(res);
				console.log('chats', res);
			})
			.catch((err) => setErrLoadingChats(true))
			.finally(() => setChatsLoaded(true));
	};

	useEffect(() => {
		fetchChats();

		return () => {};
	}, []);

	const HandleFilterMessagesType = (value: ChatFilterTypes) => {
		setMessagesFilter(value);
	};

	const HandleMessagesDateFilter = () => {
		setMessagesDateFilter((prev) => {
			return prev === 'oldest' ? 'latest' : 'oldest';
		});
	};

	return (
		<HeaderScrollView
			scrollEffect={false}
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={
						<ThemedView
							theme={theme}
							flex={1}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-start',
								gap: 12,
							}}>
							<TouchableOpacity onPress={router.back}>
								<Ionicons
									name="chevron-back"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<HeaderLeftLogo position="relative" />
						</ThemedView>
					}
					headerRight={
						<View style={{ flexDirection: 'row', gap: 14 }}>
							<TouchableOpacity>
								<Ionicons
									name="ellipsis-horizontal-outline"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<TouchableOpacity>
								<Ionicons
									name="create-outline"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					{/* big filter buttons */}
					<View style={{ gap: 0, marginTop: 0 }}>
						<View style={[styles.ContentFilterContainer]}>
							{Object.values(ChatFilterTypes).map((value, index) => {
								return (
									<HomePageFilterButton
										key={value}
										text={value as string}
										onPress={() =>
											HandleFilterMessagesType(value as ChatFilterTypes)
										}
										style={[
											{
												borderColor:
													messagesFilterSelected === value
														? Colors[theme].primary
														: Colors[theme].textPrimary,
											},
										]}
									/>
								);
							})}
						</View>
						{/*  */}

						{/* small filter options */}
						<View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
							<TouchableOpacity
								onPress={() => HandleMessagesDateFilter()}
								style={{
									flexDirection: 'row',
									flex: 1,
									alignItems: 'center',
								}}>
								<Ionicons
									name="chevron-forward"
									size={16}
									color={Colors[theme].textPrimary}
								/>
								<ThemedText theme={theme} value={messagesDateFilter} />
							</TouchableOpacity>
						</View>
						{/*  */}
					</View>

					{/* render chat row */}
					<View style={[styles.messages_container]}>
						<RenderFetchedData
							errState={errLoadingChats}
							loadedState={chatsLoaded}
							renderComponent={
								<FlatList
									scrollEnabled={false}
									data={chats}
									keyExtractor={(item) => item.Id}
									contentContainerStyle={[
										styles.message_list_container,
										{ borderColor: 'gray' },
									]}
									renderItem={(listItem) => (
										<MessageRow
											id={listItem.item.Id}
											name={listItem.item.Name}
											avatar={'https://randomuser.me/api/portraits/men/32.jpg'}
											lastActive={new Date(listItem.item.LastMessageDate)}
											status={UserStatus.OFFLINE}
										/>
									)}
								/>
							}
							activityIndicatorSize={24}
							activityIndicatorColor={Colors[theme].primary}
							clientErrorTitle={'Something went wrong...'}
							clientErrorSubTitle={'May try again?'}
						/>
					</View>
					{/*  */}
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	messages_container: {
		flexDirection: 'column',
		flex: 1,
	},
	message_list_container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	ContentFilterContainer: {
		flexDirection: 'row',
	},
});

export default Page;
