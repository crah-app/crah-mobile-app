import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Animated,
	Pressable,
	Alert,
	ListRenderItem,
	LayoutAnimation,
	Platform,
	UIManager,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import ThemedText from '@/components/general/ThemedText';
import MessageRow from '@/components/rows/MessageRow';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { Chat, chatCostumMsgType, ChatFilterTypes, UserStatus } from '@/types';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import { useUser } from '@clerk/clerk-expo';
import RenderFetchedData from '@/components/RenderFetchedData';
import SearchBar from '@/components/general/SearchBar';
import * as Haptics from 'expo-haptics';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { defaultStyles } from '@/constants/Styles';
import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const OpacityBtn = useRef(new Animated.Value(0)).current;

	const [messagesFilterSelected, setMessagesFilter] = useState<ChatFilterTypes>(
		ChatFilterTypes.all,
	);
	const [messagesDateFilter, setMessagesDateFilter] = useState<
		'latest' | 'oldest'
	>('latest');

	const [fetchedChats, setFetchedChats] = useState<Chat[]>([]);
	const [chats, setChats] = useState<Chat[]>([]);
	const [chatsLoaded, setChatsLoaded] = useState<boolean>();
	const [errLoadingChats, setErrLoadingChats] = useState<boolean>();
	const [userWantsToGoBack, setUserWantsToGoBack] = useState<boolean>(false);

	const [showLeftActionSpace, setShowLeftActionSpace] = useState(false);
	const [selectedChats, setSelectedChats] = useState<string[]>([]);

	const [searchQuery, setSearchQuery] = useState<string>('');

	const fetchChats = async () => {
		setErrLoadingChats(false);
		setChatsLoaded(false);

		fetch(`http://192.168.0.136:4000/api/chats/byUserId/${user?.id}`, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setFetchedChats(res);
				setChats(res);
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

	useEffect(() => {
		let filteredChats = fetchedChats;

		switch (messagesFilterSelected) {
			case ChatFilterTypes.groups:
				filteredChats = fetchedChats.filter((chat) => chat.IsGroup);
				break;
			case ChatFilterTypes.unread:
				filteredChats = fetchedChats.filter((chat) => chat.UnreadCount > 0);
				break;
			// case all → no filter
		}

		setChats(sortChatsByDate(filteredChats));
	}, [messagesFilterSelected]);

	// latest, oldest logic
	const HandleMessagesDateFilter = () => {
		setMessagesDateFilter((prev) => {
			return prev === 'oldest' ? 'latest' : 'oldest';
		});
	};

	const sortChatsByDate = useCallback(
		(chats: Chat[]) => {
			return [...chats].sort((a, b) => {
				const dateA = new Date(a.LastMessageDate).getTime();
				const dateB = new Date(b.LastMessageDate).getTime();
				return messagesDateFilter === 'latest' ? dateB - dateA : dateA - dateB;
			});
		},
		[messagesDateFilter],
	);

	useEffect(() => {
		setChats(sortChatsByDate(chats));
	}, [messagesDateFilter]);

	// handle navigation logic
	const handleGoBack = () => {
		if (router.canGoBack()) {
			// setUserWantsToGoBack(true);
			// setChats([]);
			router.back();
		}
	};

	// useLayoutEffect(() => {
	// 	if (chats.length === 0 && userWantsToGoBack) {
	// 		const frame = requestAnimationFrame(() => {
	// 			requestAnimationFrame(() => {
	// 				router.back();
	// 			});
	// 		});

	// 		return () => cancelAnimationFrame(frame);
	// 	}
	// }, [chats, userWantsToGoBack]);

	// gestures
	const handleOnDelete = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setChats((prevChats) => prevChats.filter((chat) => chat.Id !== id));
	};

	const handleOnArchive = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setChats((prevChats) => prevChats.filter((chat) => chat.Id !== id));
	};

	const toggleChatSelection = (checked: boolean, id: string) => {
		setSelectedChats((prev) =>
			checked ? [...prev, id] : prev.filter((item) => item !== id),
		);
	};

	const leaveSelectedChats = () => {
		if (selectedChats.length <= 0) return;

		const selectedGroups = selectedChats
			.map((id) => chats.find((chat) => chat.Id === id))
			.filter((chat) => chat?.IsGroup === 1);

		console.log('selectedGroups:', selectedGroups);

		let alertingText =
			selectedGroups.length > 0
				? `Are you sure you want to leave ${selectedGroups.length} group${
						selectedGroups.length <= 1 ? '' : 's'
				  }${
						selectedChats.length - selectedGroups.length > 0
							? ' ' +
							  'and' +
							  ' ' +
							  (selectedChats.length - selectedGroups.length) +
							  ' ' +
							  'private chat' +
							  (selectedChats.length - selectedGroups.length === 1
									? ''
									: 's') +
							  '?'
							: '?'
				  }`
				: `Are you sure you want to leave ${selectedChats.length} chat${
						selectedChats.length > 1 ? 's' : ''
				  }?`;

		Alert.alert(
			'Leave chats?',
			alertingText,
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Leave',
					style: 'destructive',
					onPress: () => setShowLeftActionSpace(false),
				},
			],
			{ cancelable: true },
		);
	};

	useEffect(() => {
		if (!showLeftActionSpace) {
			setSelectedChats([]);

			Animated.timing(OpacityBtn, {
				toValue: 0,
				duration: 1300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(OpacityBtn, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	}, [showLeftActionSpace]);

	// open new chat modal
	const OpenNewChatModal = () => {
		router.navigate('/(auth)/modals/chats/SearchNewChatModal');
	};

	const Header = () => {
		return (
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
						<TouchableOpacity onPress={OpenNewChatModal}>
							<Ionicons
								name="create-outline"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					</View>
				}
			/>
		);
	};

	const ChatList = () => {
		return (
			<View
				style={[
					styles.messages_container,
					{
						borderTopColor: Colors[theme].gray,
						borderTopWidth: 1,
					},
				]}>
				<RenderFetchedData
					ActivityIndicatorStyle={{ height: '75%' }}
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
							renderItem={({ item }) => (
								<MessageRow
									lastMessageType={item.LastMessageType}
									checked={selectedChats.includes(item.Id)}
									onCheckboxToggle={toggleChatSelection}
									slideRight={showLeftActionSpace}
									handleOnArchive={() => handleOnArchive(item.Id)}
									handleOnDelete={() => handleOnDelete(item.Id)}
									id={item.Id}
									name={item.Name}
									avatar={'https://randomuser.me/api/portraits/men/32.jpg'}
									lastActive={new Date(item.LastMessageDate)}
									status={UserStatus.ONLINE}
									unreadCount={item.UnreadCount}
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
		);
	};

	const SubHeader = () => {
		return (
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
								onPress={() => HandleFilterMessagesType(value)}
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

					<View
						style={{
							paddingHorizontal: 12,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
						}}>
						{/* small filter options */}
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

						{/* display when a chat is selected */}
						{showLeftActionSpace && (
							<Animated.View style={{ opacity: OpacityBtn }}>
								<TouchableOpacity
									onPress={leaveSelectedChats}
									style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}>
									<ThemedText
										theme={theme}
										value={'leave'}
										style={{
											color:
												selectedChats.length <= 0
													? Colors[theme].gray
													: Colors[theme].primary,
										}}
									/>
								</TouchableOpacity>
							</Animated.View>
						)}
					</View>
				</View>
				{/*  */}
			</View>
		);
	};

	return (
		<HeaderScrollView
			scrollEffect={false}
			theme={theme}
			headerChildren={<Header />}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					{/* big filter buttons */}
					<SubHeader />

					{/* render chat row */}
					<ChatList />
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
