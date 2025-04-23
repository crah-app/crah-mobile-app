import AllUserRowContainer from '@/components/displayFetchedData/AllUserRowContainer';
import SearchBar from '@/components/general/SearchBar';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ChatInfoModal = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const [newChatSearchQuery, setNewChatSearchQuery] = useState<string>('');

	const handleUserPress = async (userId: string) => {
		if (userId === user?.id) return;

		try {
			const response = await fetch('http://192.168.0.136:4000/api/chats/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					senderId: user?.id,
					receiverId: userId,
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
						excludeIds={[user?.id]}
						contentTitle=""
						bottomSheet={false}
						costumHandleUserPress={handleUserPress}
					/>
				</ThemedView>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({});

export default ChatInfoModal;
