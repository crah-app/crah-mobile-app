import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Animated,
} from 'react-native';
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
import SearchBar from '@/components/general/SearchBar';
import * as Haptics from 'expo-haptics';

interface Chat {
	Id: string;
	isGroup: number;
	Name: string;
	LastMessageContent: string;
	LastMessageSenderId: string;
	LastMessageDate: Date;
}

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [messagesFilterSelected, setMessagesFilter] = useState<ChatFilterTypes>(
		ChatFilterTypes.all,
	);
	const [messagesDateFilter, setMessagesDateFilter] = useState<
		'latest' | 'oldest'
	>('latest');

	const [chats, setChats] = useState<Chat[]>([]);
	const [chatsLoaded, setChatsLoaded] = useState<boolean>();
	const [errLoadingChats, setErrLoadingChats] = useState<boolean>();
	const [userWantsToGoBack, setUserWantsToGoBack] = useState<boolean>(false);
	const [showLeftActionSpace, setShowLeftActionSpace] = useState(false);

	const [searchQuery, setSearchQuery] = useState<string>('');

	const fetchChats = async () => {
		setErrLoadingChats(false);
		setChatsLoaded(false);

		fetch(`http://192.168.0.136:4000/api/chats/byUserId/${user?.id}`, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setChats(res);
				// console.log('chats', res);
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

	// handle navigation logic
	const handleGoBack = () => {
		if (router.canGoBack()) {
			setUserWantsToGoBack(true);
			setChats([]);
		}
	};

	useLayoutEffect(() => {
		if (chats.length === 0 && userWantsToGoBack) {
			const frame = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					router.back();
				});
			});

			return () => cancelAnimationFrame(frame);
		}
	}, [chats, userWantsToGoBack]);

	// gestures
	const handleOnDelete = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setChats((prevChats) => prevChats.filter((chat) => chat.Id !== id));
	};

	const handleOnArchive = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setChats((prevChats) => prevChats.filter((chat) => chat.Id !== id));
	};

	const [selectedChats, setSelectedChats] = useState<string[]>([]);

	const toggleChatSelection = (checked: boolean, id: string) => {
		setSelectedChats((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
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
							<TouchableOpacity onPress={handleGoBack}>
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
							<TouchableOpacity
								onPress={() => setShowLeftActionSpace(!showLeftActionSpace)}>
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
					<View
						style={{
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
						}}>
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

						<View
							style={{
								width: Dimensions.get('window').width,
								height: 100,
								justifyContent: 'center',
								alignItems: 'flex-start',
								gap: 0,
							}}>
							<View
								style={{
									width: '100%',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<SearchBar
									flex={0}
									placeholder="Search a chat"
									query={searchQuery}
									setQuery={setSearchQuery}
								/>
							</View>

							{/* small filter options */}
							<View
								style={{
									paddingHorizontal: 12,
								}}>
								<TouchableOpacity
									onPress={() => HandleMessagesDateFilter()}
									style={{
										flexDirection: 'row',
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
						</View>
						{/*  */}
					</View>

					{/* render chat row */}
					<View
						style={[
							styles.messages_container,
							{
								borderTopColor: Colors[theme].gray,
								borderTopWidth: 1,
							},
						]}>
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
										{ borderColor: 'gray', marginTop: 0 },
									]}
									renderItem={(listItem) => (
										<MessageRow
											onCheckboxToggle={toggleChatSelection}
											slideRight={showLeftActionSpace}
											handleOnArchive={() => handleOnArchive(listItem.item.Id)}
											handleOnDelete={() => handleOnDelete(listItem.item.Id)}
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
