import React from 'react';
import { View, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import settingsData from '@/JSON/non_dummy_data/settings.json';
import { router } from 'expo-router';
import ThemedText from '@/components/general/ThemedText';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { Ionicons } from '@expo/vector-icons';
import SettingsRow from '@/components/rows/SettingsRow';

const Page = () => {
	const theme = useSystemTheme();

	return (
		<HeaderScrollView
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
									name="chevron-back"
									size={28}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<HeaderLeftLogo />
						</View>
					}
					headerRight={
						<Ionicons
							name="settings-outline"
							size={28}
							color={Colors[theme].textPrimary}
						/>
					}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					<SectionList
						sections={settingsData}
						keyExtractor={(item, index) => item.text + index}
						renderItem={({ item }) => <SettingsRow {...item} />}
						renderSectionHeader={({ section: { title } }) => (
							<ThemedView
								style={[
									styles.header,
									{
										paddingHorizontal: 8,
									},
								]}
								theme={theme}>
								<ThemedText
									theme={theme}
									style={[
										styles.headerText,
										{
											paddingVertical: 12,
											borderBottomWidth: 3,
											borderBottomColor: Colors.dark.surface,
										},
									]}
									value={title}
								/>
							</ThemedView>
						)}
					/>
				</ThemedView>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({
	header: {
		padding: 10,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default Page;
