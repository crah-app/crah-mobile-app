import BuildCharacterUI from '@/components/Character/BuildCharacterUI';
import RenderCharacter from '@/components/Character/RenderCharacter';
import SearchBar from '@/components/general/SearchBar';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import GetSVG from '@/components/GetSVG';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import ProgressionBar from '@/components/ProgressionBar';
import Tag from '@/components/tag';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useCommonTricks } from '@/hooks/getCommonTricks';
import { TextInputMaxCharacters, Trick } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { Dispatch, memo, SetStateAction, useEffect } from 'react';
import {
	KeyboardAvoidingView,
	View,
	StyleSheet,
	FlatList,
	ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import stringSimilarity from 'string-similarity';

const ActionContainer = memo(
	({
		currentStep,
		commonTricks,
		error,
		loading,
		theme,
		username,
		setUsername,
		showWarningToWriteName,
		setShowWarningToWriteName,
		trickSearchQuery,
		setTrickSearchQuery,
		bottom,
		usernameIsDuplicate,
	}: {
		currentStep: number;
		commonTricks: Trick[];
		error: Error | null;
		loading: boolean;
		theme: 'light' | 'dark';
		username: string;
		setUsername: Dispatch<SetStateAction<string>>;
		showWarningToWriteName: boolean;
		setShowWarningToWriteName: Dispatch<SetStateAction<boolean>>;
		trickSearchQuery: string;
		setTrickSearchQuery: Dispatch<SetStateAction<string>>;
		bottom: number;
		usernameIsDuplicate: boolean;
	}) => {
		const handleNameInputPress = () => {
			setShowWarningToWriteName(false);
		};

		switch (currentStep) {
			case 0:
				return (
					<View style={styles.pageContainer}>
						<GetSVG name="flying_henke" props={{ width: 350, height: 350 }} />

						<View style={{ gap: 8 }}>
							<ThemedText
								style={[
									defaultStyles.bigText,
									{ fontWeight: '700', textAlign: 'center', fontSize: 32 },
								]}
								theme={theme}
								value="Crah is your place in the Scootering Community"
							/>

							<ThemedText
								style={[
									styles.smallText,
									{ color: Colors[theme].gray, fontWeight: '400' },
								]}
								theme={theme}
								value={`Feel free to ride, post clips, create tricks, 
compare yourself to others and become the best scooter rider in the world `}
							/>
						</View>
					</View>
				);

			case 1:
				return (
					<View style={styles.pageContainer}>
						<KeyboardAvoidingView
							style={[styles.pageContainer, { paddingHorizontal: 4 }]}>
							<View style={{ gap: 20, width: '100%' }}>
								<ThemedText
									style={[
										defaultStyles.bigText,
										{ fontWeight: '700', textAlign: 'center', fontSize: 32 },
									]}
									theme={theme}
									value="What is your name?"
								/>
								<ThemedText
									style={[
										styles.smallText,
										{
											color: Colors[theme].gray,
											fontWeight: '400',
											textAlign: 'center',
										},
									]}
									theme={theme}
									value="How would you like others to name you?"
								/>
							</View>

							<View style={{ top: 45, gap: 4 }}>
								<ThemedTextInput
									theme={theme}
									value={username}
									setValue={setUsername}
									placeholder="john_smith"
									style={{ fontSize: 20, width: '100%', textAlign: 'center' }}
									containerStyle={{ width: '100%' }}
									maxLength={30}
								/>

								{showWarningToWriteName && (
									<ThemedText
										style={[
											styles.smallText,
											{ color: Colors[theme].primary, textAlign: 'center' },
										]}
										theme={theme}
										value="please write a name down"
									/>
								)}

								{usernameIsDuplicate && (
									<ThemedText
										style={[
											styles.smallText,
											{ color: Colors[theme].primary, textAlign: 'center' },
										]}
										theme={theme}
										value="username is already taken"
									/>
								)}
							</View>
						</KeyboardAvoidingView>
					</View>
				);

			case 2:
				return (
					<View style={styles.pageContainer}>
						<View style={{ gap: 18, width: '100%' }}>
							<ThemedText
								style={[
									defaultStyles.bigText,
									{ fontWeight: '700', textAlign: 'center', fontSize: 32 },
								]}
								theme={theme}
								value="Select your 5 best Tricks!"
							/>

							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<SearchBar
									query={trickSearchQuery}
									setQuery={setTrickSearchQuery}
									placeholder="e.g. Tailwhip"
									flex={0}
									containerStyle={{ height: 100, width: 100 }}
								/>
							</View>
						</View>

						<View
							style={{
								width: '100%',
								height: 530,
								gap: 12,
							}}>
							{commonTricks && !error && !loading && (
								<FlashList
									numColumns={3}
									contentContainerStyle={{
										padding: 16,
									}}
									data={
										trickSearchQuery.length <= 0
											? commonTricks
											: commonTricks.filter((trick) => {
													if (
														stringSimilarity.compareTwoStrings(
															trick.Name.toLowerCase(),
															trickSearchQuery.toLowerCase(),
														) > 0.19 ||
														stringSimilarity.compareTwoStrings(
															trick.SecondName?.toLowerCase() ?? '',
															trickSearchQuery.toLowerCase(),
														) > 0.19
													) {
														return trick;
													}
											  })
									}
									keyExtractor={(item) => item.Name}
									renderItem={({ item }) => (
										<View style={{ padding: 4 }}>
											<Tag tag={item.Name} theme={theme} />
										</View>
									)}
									estimatedItemSize={100}
								/>
							)}
						</View>
					</View>
				);

			case 3:
				return (
					<View style={styles.pageContainer}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: '500' }]}
								theme={theme}
								value={`Page ${currentStep}`}
							/>
							<ThemedText
								style={{
									color: Colors[theme].lightGray,
									textAlign: 'center',
								}}
								theme={theme}
								value="This is the Next Page"
							/>
						</View>
					</View>
				);
			case 4:
				return (
					<View style={styles.pageContainer}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: '500' }]}
								theme={theme}
								value={`Page ${currentStep}`}
							/>
							<ThemedText
								style={{ color: Colors[theme].lightGray, textAlign: 'center' }}
								theme={theme}
								value="This is the Next Page"
							/>
						</View>
					</View>
				);

			case 5:
				return (
					<View style={styles.pageContainer}>
						{/* <BuildCharacterUI visible={currentStep === 5} /> */}
					</View>
				);

			default:
				return null;
		}
	},
);

const styles = StyleSheet.create({
	pageContainer: {
		paddingHorizontal: 8,
		flex: 1,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	smallText: {
		textAlign: 'center',
		fontSize: 17,
	},
	webview: {
		flex: 1,
	},
});

export default ActionContainer;
