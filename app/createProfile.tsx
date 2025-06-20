import BuildCharacterUI from '@/components/Character/BuildCharacterUI';

import ActionContainer from '@/components/createProfile/ActionContainer';

import ThemedText from '@/components/general/ThemedText';

import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import ProgressionBar from '@/components/ProgressionBar';
import Tag from '@/components/tag';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useCommonTricks } from '@/hooks/getCommonTricks';
import {
	SelectedTrick,
	TextInputMaxCharacters,
	Trick,
	TrickSpot,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Alert,
	Dimensions,
	KeyboardAvoidingView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/*
Initial Page
*/

const CreateProfile = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();
	const { user } = useUser();

	const { getToken } = useAuth();

	const totalSteps = 5;

	const [stepsComplete, setStepsComplete] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);

	// page data
	const [username, setUsername] = useState<string>('');
	const [selectedBestTricks, setSelectedBestTricks] = useState<SelectedTrick[]>(
		[],
	);

	const [averageTrickPointsOfBestTricks, setAverageTrickPointsOfBestTricks] =
		useState<number>(0);

	const [usernameIsTaken, setUsernameIsTaken] = useState<boolean>(false);

	const [trickSearchQuery, setTrickSearchQuery] = useState<string>('');
	const [showWarningToWriteName, setShowWarningToWriteName] =
		useState<boolean>(false);

	const [trickSelectedForSpotSelection, setTrickSelectedForSpotSelection] =
		useState<SelectedTrick | null>(null);

	const { commonTricks, loading, error } = useCommonTricks();

	const updateUsername = async () => {
		try {
			await user?.update({
				username,
			});
			console.log('username updated!');
		} catch (err: any) {
			if (
				err?.errors &&
				err?.errors[0]?.code === 'form_identifier_exists' &&
				err?.errors[0]?.meta?.param_name === 'username'
			) {
				setUsernameIsTaken(true);
				console.error('error updating username:', error);
			}
		}
	};

	const handleUsernameIsDuplicate = async (username: string) => {
		const result = await fetch(
			`http://192.168.0.136:4000/api/users/${username}/nameIsDuplicate`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			},
		);

		if (result.status !== 200) {
			return true;
		}

		const parsed_json = result.json;
		const isDuplicate = parsed_json.length > 0;

		return isDuplicate;
	};

	const handlePostBestTricks = async () => {
		const usertoken = await getToken();

		console.log(selectedBestTricks);

		const response = await fetch(
			`http://192.168.0.136:4000/api/tricks/${user?.id}/setTricks`,
			{
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${usertoken}`,
				},
				body: JSON.stringify({ tricks: selectedBestTricks }),
			},
		);

		const result = await response.json();

		console.log(result);
		if (!response.ok) {
			const errorText = await response.text();
			console.warn('Error posting tricks:', response.status, errorText);
			return false;
		}

		setAverageTrickPointsOfBestTricks(result.user_points);

		return true;
	};

	const allowedToContinueHandler = async () => {
		switch (currentStep) {
			case 0:
				setShowWarningToWriteName(false);
				setUsernameIsTaken(false);

				break;
			case 1: // second page
				if (username.length <= 0) {
					setShowWarningToWriteName(true);
					setUsernameIsTaken(false);
					return false;
				}

				setShowWarningToWriteName(false);

				// about username is duplicate
				const isDuplicate = await handleUsernameIsDuplicate(username);

				if (isDuplicate) {
					setUsernameIsTaken(true);
					return false;
				} else {
					if (user?.username !== username) {
						await updateUsername();
					}
				}

				break;

			case 2: // third page
				console.log(selectedBestTricks.length);
				if (selectedBestTricks.length <= 0) return false;

				const result = await handlePostBestTricks();
				return result;
		}

		return true;
	};

	const handleContinue = async () => {
		const result = await allowedToContinueHandler();

		if (!result) return false;

		setStepsComplete((prev) => {
			if (prev < 5) {
				setCurrentStep(prev + 1);
				return prev + 1;
			}

			return prev;
		});
	};

	const handleGoBack = () => {
		setStepsComplete((prev) => {
			if (prev > 0) {
				setCurrentStep(prev - 1);
				return prev - 1;
			}

			return prev;
		});
	};

	const handleSelectTrick = useCallback(
		(Trick: SelectedTrick) => {
			setSelectedBestTricks((prev) => {
				if (prev.length < 5) {
					return [...prev, Trick];
				}
				return prev;
			});
		},
		[selectedBestTricks],
	);

	const triggerTrickSpotSelection = useCallback(
		(Trick: SelectedTrick) => {
			// trigger bottom menu and set trick
			setTrickSelectedForSpotSelection(Trick);
			handlePresentModalPress();
		},
		[selectedBestTricks],
	);

	const handleSpotSelected = (trick: SelectedTrick | null, spot: TrickSpot) => {
		console.log(trickSelectedForSpotSelection, trick);
		if (!trickSelectedForSpotSelection || !trick) return;

		setSelectedBestTricks((tricks) => {
			return tricks.map((best_trick) => {
				console.log(best_trick.Name, trickSelectedForSpotSelection);
				if (best_trick.Name === trickSelectedForSpotSelection.Name) {
					best_trick.Spot = spot;
				}

				return best_trick;
			});
		});
		handleCloseModalPress();
	};

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['25%'], []);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetRef.current?.present();
	}, []);

	const handleCloseModalPress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo />}
					headerRight={
						<TouchableOpacity>
							<Ionicons
								name="help-circle-outline"
								size={32}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					}
					headerBottom={
						<View
							style={[
								{
									paddingTop: 38,
									width: 300,
									gap: 8,
									alignItems: 'center',
								},
							]}>
							<ProgressionBar
								theme={theme}
								progress={stepsComplete}
								totalProgress={5}
							/>
						</View>
					}
				/>
			}
			scrollChildren={
				<View style={{ flex: 1, bottom: bottom * 3.5 }}>
					<BottomSheetModal
						snapPoints={snapPoints}
						handleIndicatorStyle={{ backgroundColor: 'gray' }}
						backgroundStyle={{
							backgroundColor: Colors[theme].container_surface,
							flex: 1,
						}}
						containerStyle={{ flex: 1 }}
						ref={bottomSheetRef}>
						<BottomSheetView style={{ flex: 1 }}>
							<View
								style={{
									flexDirection: 'column',
									gap: 12,
									paddingHorizontal: 18,
									paddingVertical: 18,
									flex: 1,
								}}>
								<ThemedText
									value={'Select a spot'}
									theme={theme}
									style={[
										defaultStyles.biggerText,
										{ textAlign: 'center', fontSize: 28 },
									]}
								/>

								<View
									style={{
										flexDirection: 'row',
										gap: 40,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: 24,
										marginBottom: 24,
									}}>
									<TouchableOpacity
										onPress={() =>
											handleSpotSelected(trickSelectedForSpotSelection, 'Park')
										}>
										<ThemedText
											value={'Park'}
											theme={theme}
											style={[defaultStyles.biggerText]}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() =>
											handleSpotSelected(
												trickSelectedForSpotSelection,
												'Street',
											)
										}>
										<ThemedText
											value={'Street'}
											theme={theme}
											style={[defaultStyles.biggerText]}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() =>
											handleSpotSelected(trickSelectedForSpotSelection, 'Flat')
										}>
										<ThemedText
											value={'Flat'}
											theme={theme}
											style={[defaultStyles.biggerText]}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</BottomSheetView>
					</BottomSheetModal>

					<StatusBar barStyle={'default'} />

					{/* main action text container */}
					<View
						style={{
							flex: 1,
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							top: bottom * 3.5 + 45,
						}}>
						{currentStep < 5 && (
							<ActionContainer
								currentStep={currentStep}
								commonTricks={commonTricks}
								error={error}
								loading={loading}
								theme={theme}
								username={username}
								setUsername={setUsername}
								showWarningToWriteName={showWarningToWriteName}
								setShowWarningToWriteName={setShowWarningToWriteName}
								trickSearchQuery={trickSearchQuery}
								setTrickSearchQuery={setTrickSearchQuery}
								bottom={bottom}
								usernameIsDuplicate={usernameIsTaken}
								selectedTricks={selectedBestTricks}
								handleSelectTrick={handleSelectTrick}
								setSelectedBestTricks={setSelectedBestTricks}
								triggerTrickSpotSelection={triggerTrickSpotSelection}
								averageTrickPointsOfBestTricks={averageTrickPointsOfBestTricks}
							/>
						)}

						<BuildCharacterUI visible={currentStep === 5} />
					</View>

					{/* bottom action container */}

					<View
						style={{
							bottom: -bottom * 3.5,
							paddingBottom: bottom * 3.5,
							alignItems: 'center',
							gap: 10,
							backgroundColor: Colors[theme].background,
							padding: 12,
						}}>
						{currentStep < 5 && (
							<TouchableOpacity
								onPress={async () => await handleContinue()}
								style={[
									{
										width: 250,
										padding: 8,
										backgroundColor: Colors[theme].primary,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 24,
									},
								]}>
								<ThemedText
									theme={theme}
									value={'Continue'}
									style={[{ fontSize: 18, fontWeight: '700' }]}
								/>
							</TouchableOpacity>
						)}

						{currentStep > 0 && (
							<TouchableOpacity onPress={handleGoBack}>
								<ThemedText
									theme={theme}
									value={'Go Back'}
									style={[{ fontSize: 14 }]}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
			}
			theme={theme}
		/>
	);
};

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

export default CreateProfile;
