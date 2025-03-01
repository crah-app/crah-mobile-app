import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import ThemedText from '@/components/general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';

import helpModalContent from '@/JSON/non_dummy_data/inbox_help_modal_content.json';
import FriendRequestColumn from '@/components/rows/FriendRequestRow';
import UpdateInformationColumn from '@/components/rows/UpdateInformationRow';

// dummy data. replace with database data
import UpdateInformation from '@/JSON/update_information_modal_content.json';
import RankColumn from '@/components/rows/InboxRankRow';

const Page = () => {
	const theme = useSystemTheme();
	const [messages, setMessages] = useState<boolean>(true); // change it later with the incoming data from the database

	// Friend Requests
	const handleAccept = () => {
		Alert.alert('Friend Request Accepted', 'You are now friends!');
	};

	const handleDecline = () => {
		Alert.alert('Friend Request Declined', 'You declined the request.');
	};

	// Update Information
	const HandleUpdateInformationPress = () => {
		router.push({
			pathname: '/modals/help_modal',
			params: { contents: JSON.stringify(UpdateInformation) },
		});
	};

	if (!messages) {
		return (
			<ThemedView theme={theme} flex={1} style={styles.container}>
				<SafeAreaView>
					<Header />

					<View style={[styles.content_container, { alignItems: 'center' }]}>
						<ThemedText
							value={'There are no inbox messages for you currently'}
							theme={theme}
							style={{ color: 'gray' }}
						/>
					</View>
				</SafeAreaView>
			</ThemedView>
		);
	}

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			<SafeAreaView>
				<Header />
				<View style={styles.content_container}>
					<ThemedText
						value={'You have got 3 messages'}
						theme={theme}
						style={{ color: 'gray', marginBottom: 8, marginLeft: 8 }}
					/>

					<FriendRequestColumn
						name="John Doe"
						avatar="https://randomuser.me/api/portraits/men/32.jpg"
						onAccept={handleAccept}
						onDecline={handleDecline}
						id={1}
					/>

					<UpdateInformationColumn
						updateNumber={1.15}
						title="The Update 1.15 is here!"
						subtitle="Click for new features and improvements."
						onPress={() => HandleUpdateInformationPress()}
					/>

					<RankColumn
						currentRank="Gold"
						previousRank="Silver"
						onPress={() => console.log('Rank details clicked')}
					/>
				</View>
			</SafeAreaView>
		</ThemedView>
	);
};

const Header = () => {
	const theme = useSystemTheme();

	return (
		<View style={styles.header_container}>
			<TouchableOpacity onPress={router.back}>
				<Ionicons
					name="chevron-back-outline"
					size={24}
					color={Colors[theme].textPrimary}
				/>
			</TouchableOpacity>
			<ThemedText
				value={'Inbox'}
				theme={theme}
				style={defaultStyles.biggerText}
			/>
			<Link
				asChild
				href={{
					params: { contents: JSON.stringify(helpModalContent) },
					pathname: '/modals/help_modal',
				}}>
				<TouchableOpacity>
					<Ionicons
						name="help-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</TouchableOpacity>
			</Link>
		</View>
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
	content_container: {},
});

export default Page;
