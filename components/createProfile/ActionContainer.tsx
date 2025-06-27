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
import {
	Rank,
	RiderType,
	SelectedTrick,
	TextInputMaxCharacters,
	Trick,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, {
	Dispatch,
	memo,
	SetStateAction,
	useEffect,
	useRef,
} from 'react';
import {
	KeyboardAvoidingView,
	View,
	StyleSheet,
	FlatList,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import stringSimilarity from 'string-similarity';
import { evaluateTextBasedOnRankNumber } from '@/utils/globalFuncs';
import { TextInput } from 'react-native-gesture-handler';

interface ActionContainerProps {
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
	selectedTricks: SelectedTrick[];
	handleSelectTrick: (trick: SelectedTrick) => void;
	setSelectedBestTricks: Dispatch<SetStateAction<SelectedTrick[]>>;
	triggerTrickSpotSelection: (trick: SelectedTrick) => void;
	averageTrickPointsOfBestTricks: number;
	userRank: number;
	setMustSelectOneTrick: Dispatch<SetStateAction<boolean>>;
	mustSelectOneTrick: boolean;
	mustSelectRiderType: boolean;
	setRiderType: Dispatch<SetStateAction<RiderType>>;
	riderType: RiderType;
	setMustSelectRiderType: Dispatch<SetStateAction<boolean>>;
}

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
		selectedTricks,
		handleSelectTrick,
		setSelectedBestTricks,
		triggerTrickSpotSelection,
		averageTrickPointsOfBestTricks,
		userRank,
		setMustSelectOneTrick,
		mustSelectOneTrick,
		setRiderType,
		riderType,
		setMustSelectRiderType,
	}: ActionContainerProps) => {
		const nameInputRef = useRef<TextInput>(null);

		const RiderTypes: RiderType[] = [
			'Park Rider',
			'Street Rider',
			'Flat Rider',
		];

		useEffect(() => {
			console.log('object', currentStep);
			if (currentStep === 1) {
				nameInputRef.current?.focus();
			}
			return () => {};
		}, [currentStep]);

		const handleNameInputPress = () => {
			setShowWarningToWriteName(false);
		};

		useEffect(() => {
			console.log('from memo', selectedTricks.length);
			return () => {};
		}, [selectedTricks]);

		interface SelectedTrickBlockProps {
			selected_trick: SelectedTrick;
		}

		const SelectedTrickBlock: React.FC<SelectedTrickBlockProps> = ({
			selected_trick,
		}) => {
			return (
				<View
					style={[
						{
							marginVertical: 5,
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'space-between',
						},
					]}>
					<Tag
						tag={selected_trick.Name}
						theme={theme}
						style={{ borderColor: Colors[theme].primary }}
					/>

					{/* spot container */}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						{typeof selected_trick.Spot !== 'string' ? (
							<ThemedText
								theme={theme}
								value="Select"
								style={[{ fontSize: 17, color: Colors[theme].gray }]}
							/>
						) : (
							<ThemedText
								theme={theme}
								value={`${selected_trick.Spot}`}
								style={[{ fontSize: 17 }]}
							/>
						)}
						<TouchableOpacity
							onPress={() => triggerTrickSpotSelection(selected_trick)}>
							<Ionicons
								style={{ padding: 3 }}
								size={16}
								color={Colors[theme].textPrimary}
								name="chevron-forward"
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={() =>
							setSelectedBestTricks((prev) =>
								prev.filter((trick) => trick.Name !== selected_trick.Name),
							)
						}>
						<Ionicons
							style={{ padding: 3 }}
							size={18}
							color={Colors[theme].textPrimary}
							name="close-outline"
						/>
					</TouchableOpacity>
				</View>
			);
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
									value="Your Rider Name"
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
									allowSpace={false}
									ref={nameInputRef}
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
						<View style={{ gap: 20, width: '100%' }}>
							<ThemedText
								style={[
									defaultStyles.bigText,
									{ fontWeight: '700', textAlign: 'center', fontSize: 32 },
								]}
								theme={theme}
								value="Your Rider Type"
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
								value="What type of rider you call yourself?"
							/>
						</View>

						<View style={{ gap: 4, flex: 1, justifyContent: 'center', bottom }}>
							{RiderTypes.map((val) => (
								<TouchableOpacity
									key={val}
									style={{ marginBottom: 24 }}
									onPress={() => setRiderType(val)}>
									<ThemedText
										style={[
											defaultStyles.bigText,
											{
												fontWeight: '700',
												textAlign: 'center',
												fontSize: 36,
												color:
													riderType === val
														? Colors[theme].primary
														: Colors[theme].textPrimary,
											},
										]}
										theme={theme}
										value={val as string}
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				);

			case 3:
				return (
					<View style={styles.pageContainer}>
						{/* header */}
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
									displayLeftSearchIcon
									query={trickSearchQuery}
									setQuery={setTrickSearchQuery}
									placeholder="e.g. Tailwhip"
									flex={0}
									containerStyle={{ height: 100, width: 100 }}
								/>
							</View>
							joseg
							{mustSelectOneTrick && (
								<ThemedText
									style={[
										styles.smallText,
										{ color: Colors[theme].primary, textAlign: 'center' },
									]}
									theme={theme}
									value="Select atleast one trick"
								/>
							)}
						</View>

						{/* selected trick container */}
						{selectedTricks.length > 0 && (
							<View style={{ width: '100%', paddingHorizontal: 6 }}>
								<ThemedText
									style={[
										defaultStyles.bigText,
										{
											fontWeight: '700',
											fontSize: 24,
											textAlign: 'left',
										},
									]}
									theme={theme}
									value="Selected tricks"
								/>

								{/* selected trick list */}
								<View
									style={{
										minHeight: 100,
										borderBottomWidth: StyleSheet.hairlineWidth,
										borderBottomColor: Colors[theme].gray,
										width: '100%',
										paddingVertical: 12,
									}}>
									{/* trick block */}
									{selectedTricks.map((selected_trick) => (
										<SelectedTrickBlock
											key={selected_trick.Name}
											selected_trick={selected_trick}
										/>
									))}
								</View>
							</View>
						)}

						{/* trick list */}
						<View
							style={{
								width: '100%',
								height: 530,
								gap: 12,
								paddingTop: 15,
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
														) > 0.29 ||
														stringSimilarity.compareTwoStrings(
															trick.SecondName?.toLowerCase() ?? '',
															trickSearchQuery.toLowerCase(),
														) > 0.29
													) {
														return trick;
													}
											  })
									}
									keyExtractor={(item) => item.Name}
									renderItem={({ item }) => (
										<View style={{ padding: 4 }}>
											<Tag
												style={{}}
												handleTagPress={() => {
													setMustSelectOneTrick(false);
													handleSelectTrick({ ...item, Spot: 'Park' });
												}}
												tag={item.Name}
												theme={theme}
											/>
										</View>
									)}
									estimatedItemSize={100}
								/>
							)}
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
								value={evaluateTextBasedOnRankNumber(userRank)}
							/>
							<ThemedText
								style={{
									color: Colors[theme].lightGray,
									textAlign: 'center',
								}}
								theme={theme}
								value={`Your points are ${averageTrickPointsOfBestTricks}`}
							/>

							<ThemedText
								style={{
									color: Colors[theme].lightGray,
									textAlign: 'center',
								}}
								theme={theme}
								// @ts-ignore
								value={`Your are ${Object.values(Rank)[userRank]}`}
							/>
						</View>
					</View>
				);
			case 5:
				return <></>;

			// atm it renders a WebView in the root component
			case 6:
				return <></>;
			// return (
			// 	<View style={styles.pageContainer}>
			// 		{/* <BuildCharacterUI visible={currentStep === 5} /> */}
			// 	</View>
			// );

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
