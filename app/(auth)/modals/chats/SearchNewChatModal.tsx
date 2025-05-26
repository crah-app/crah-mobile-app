import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';
import Row from '@/components/general/Row';
import SearchBar from '@/components/general/SearchBar';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { selectedRiderInterface } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Dimensions,
	FlatList,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';

const ChatInfoModal = () => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [newChatSearchQuery, setNewChatSearchQuery] = useState<string>('');
	const [selectedRiders, setSelectedRiders] = useState<
		selectedRiderInterface[]
	>([]);

	const [groupchatName, setGroupchatName] = useState<string>('');
	const [groupchatNameModalVisible, setGroupchatNameModalVisible] =
		useState<boolean>(false);

	const handleUserPress = async (userData: selectedRiderInterface) => {
		setSelectedRiders((prev) => [...prev, userData]);
	};

	const removeUser = (userId: string) => {
		setSelectedRiders((prev) => prev.filter((rider) => rider._id !== userId));
	};

	const createChat = async (
		userData: selectedRiderInterface = selectedRiders[0],
	) => {
		const userId: string = userData._id as string;
		const members = [...selectedRiders.map((rider) => rider._id), user?.id];
		const isGroup = members.length > 2 ? true : false;

		if (userId === user?.id) return;

		// creat initial group name
		setGroupchatName((prev) => {
			let name: string;

			name = selectedRiders
				.slice(0, 2)
				.map((rider) => rider.name)
				.concat(user?.username as string)
				.join(', ');

			return name;
		});

		console.log(members);

		try {
			const response = await fetch('http://192.168.0.136:4000/api/chats/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					// for one-to-one chats
					senderId: user?.id,
					receiverId: userId,
					// for group chat
					creatorId: user?.id,
					memberIds: members,
					name: isGroup ? groupchatName : null,
					isGroup,
				}),
			});

			const data = await response.json();

			if (data.chatId) {
				router.push({
					pathname: '/(auth)/(tabs)/homePages/chats/[id]',
					params: { id: data.chatId },
				});
			}
		} catch (err) {
			console.warn('Chat start failed:', err);
		}
	};

	const onContinuePress = () => {
		createChat();
	};

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<View></View>}
					headerCenter={
						<ThemedText
							style={[defaultStyles.biggerText]}
							theme={theme}
							value={'New chat'}
						/>
					}
					headerRight={
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="close-outline"
								size={26}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					}
				/>
			}
			scrollChildren={
				<ThemedView
					theme={theme}
					flex={1}
					style={{ justifyContent: 'center', alignItems: 'center' }}>
					<SearchBar
						flex={0}
						placeholder="Type in a username..."
						query={newChatSearchQuery}
						setQuery={setNewChatSearchQuery}
					/>

					<AllUserRowContainer
						contentContainerStyle={{ flex: 0, height: '55%' }}
						excludeIds={[user?.id]}
						contentTitle="Riders"
						bottomSheet={false}
						costumHandleUserPress={handleUserPress}
					/>

					{/* selected users */}
					{selectedRiders.length > 0 ? (
						<View
							style={[
								styles.selectedUsersContainer,
								{
									borderTopColor: Colors[theme].gray,
								},
							]}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingRight: 6,
								}}>
								<ThemedText
									style={[defaultStyles.biggerText, { paddingHorizontal: 12 }]}
									theme={theme}
									value={'Selected riders'}
								/>
								<TouchableOpacity onPress={onContinuePress}>
									<Ionicons
										size={24}
										color={Colors[theme].textPrimary}
										name="chevron-forward"
									/>
								</TouchableOpacity>
							</View>

							<FlatList
								data={selectedRiders}
								renderItem={({ item, index }) => (
									<Row
										// @ts-ignore
										showAvatar={true}
										avatarUrl={item.avatar as string}
										title={item.name ?? 'no name user'}
										subtitle={'Rank Gold #1'}
										customRightComponent={
											<View>
												<TouchableOpacity
													onPress={() => removeUser(item._id as string)}>
													<Ionicons
														size={24}
														color={Colors[theme].textPrimary}
														name="close"
													/>
												</TouchableOpacity>
											</View>
										}
									/>
								)}
							/>
						</View>
					) : (
						<View style={styles.selectedUsersContainer}></View>
					)}
				</ThemedView>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({
	selectedUsersContainer: {
		flex: 1,
		height: '75%',
		borderTopWidth: 1,
		paddingTop: 12,
	},
});

export default ChatInfoModal;
