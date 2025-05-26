import Row from '@/components/general/Row';
import SearchBar from '@/components/general/SearchBar';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { helpPageParameter, helpPageTopcis } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

interface ContentInterface {
	[title: string]: {
		title: helpPageParameter;
		index: number;
		content: string;
	};
}

const content: ContentInterface = {
	[helpPageParameter.createVideo]: {
		title: helpPageParameter.createVideo,
		index: 0,
		content: 'this is the create video page',
	},
	[helpPageParameter.createTextPost]: {
		title: helpPageParameter.createTextPost,
		index: 1,
		content: 'this is the create text post page',
	},
	[helpPageParameter.createArticle]: {
		title: helpPageParameter.createArticle,
		index: 2,
		content: 'this is the create article page',
	},
	[helpPageParameter.statsPages]: {
		title: helpPageParameter.statsPages,
		index: 3,
		content: 'this is the stats page',
	},
	[helpPageParameter.inbox]: {
		title: helpPageParameter.inbox,
		index: 4,
		content: 'this is the inbox page',
	},
};

const relativeContent = {
	[helpPageTopcis.create]: [
		content[helpPageParameter.createVideo],
		content[helpPageParameter.createTextPost],
		content[helpPageParameter.createArticle],
	],
	[helpPageTopcis.ranks]: [content[helpPageParameter.statsPages]],
	[helpPageTopcis.profile]: [content[helpPageParameter.inbox]],
};

const HelpModal = () => {
	const { first } = useLocalSearchParams<{ first: helpPageParameter }>();
	const theme = useSystemTheme();
	const [query, setQuery] = useState<string>('');
	const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

	const toggleItem = (key: string) => {
		setOpenItems((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	useEffect(() => {
		if (!first) return;

		setQuery(first);
		setOpenItems((prev) => ({
			...prev,
			[first]: true,
		}));
	}, [first]);

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerCenter={
						<ThemedText
							style={[defaultStyles.biggerText]}
							theme={theme}
							value={'FAQ'}
						/>
					}
					headerRight={<View />}
					headerLeft={
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="chevron-back"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					}
				/>
			}
			scrollChildren={
				<ThemedView flex={1} theme={theme} style={{ flex: 1 }} gradient>
					<View style={{ paddingHorizontal: 12, height: 62 }}>
						<SearchBar
							displayLeftSearchIcon
							query={query}
							setQuery={setQuery}
							placeholder={'Search Keyword'}
						/>
					</View>

					{Object.entries(relativeContent).map(([sectionTitle, items]) => {
						const filteredItems = items.filter((item) =>
							item.title.toLowerCase().includes(query.toLowerCase().trim()),
						);

						if (filteredItems.length === 0) return null;

						return (
							<View key={sectionTitle}>
								<Row
									containerStyle={{
										paddingHorizontal: 4,
										backgroundColor: 'transparent',
									}}
									titleStyle={[defaultStyles.biggerText, { fontSize: 28 }]}
									title={sectionTitle}
								/>

								<View style={{ paddingHorizontal: 12 }}>
									{filteredItems.map((item, i) => {
										const key = item.title;
										const isOpen = openItems[key];

										return (
											<View key={key} style={{ marginVertical: 4 }}>
												<Row
													containerStyle={{
														backgroundColor: 'transparent',
														width: Dimensions.get('window').width - 24,
														borderRadius: 12,
														borderWidth: 2,
														borderColor: Colors[theme].gray,
													}}
													titleStyle={[{ fontSize: 20, fontWeight: '400' }]}
													title={item.title}
													customRightComponent={
														<View style={{ flex: 1 }}>
															<TouchableOpacity onPress={() => toggleItem(key)}>
																<Ionicons
																	name={isOpen ? 'chevron-up' : 'chevron-down'}
																	size={20}
																	color={Colors[theme].textPrimary}
																/>
															</TouchableOpacity>
														</View>
													}>
													{isOpen && (
														<ThemedText
															value={item.content}
															theme={theme}
															style={{
																fontSize: 16,
																color: Colors[theme].lightGray,
															}}
														/>
													)}
												</Row>
											</View>
										);
									})}
								</View>
							</View>
						);
					})}
				</ThemedView>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({});

export default HelpModal;
