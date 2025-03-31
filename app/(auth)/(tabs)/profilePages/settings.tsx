import React from 'react';
import {
	View,
	SectionList,
	StyleSheet,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import SettingsColumn from '@/components/rows/SettingsRow';
import settingsData from '@/JSON/settings.json';
import { router, Stack } from 'expo-router';
import ThemedText from '@/components/general/ThemedText';

const Page = () => {
	const theme = useSystemTheme();

	return (
		<ThemedView theme={theme} flex={1}>
			<SafeAreaView style={{ flex: 1 }}>
				<SectionList
					sections={settingsData}
					keyExtractor={(item, index) => item.text + index}
					renderItem={({ item }) => <SettingsColumn {...item} />}
					renderSectionHeader={({ section: { title } }) => (
						<ThemedView style={styles.header} theme={theme}>
							<ThemedText
								theme={theme}
								style={[styles.headerText]}
								value={title}
							/>
						</ThemedView>
					)}
				/>
			</SafeAreaView>
		</ThemedView>
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
