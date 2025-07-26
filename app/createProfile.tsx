import BuildCharacterUI from '@/components/Character/BuildCharacterUI';

import ActionContainer from '@/components/createProfile/ActionContainer';

import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';

import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import ProgressionBar from '@/components/ProgressionBar';
import Tag from '@/components/tag';
import TransparentLoadingScreen from '@/components/TransparentLoadingScreen';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useCommonTricks } from '@/hooks/getCommonTricks';
import { mmkv } from '@/hooks/mmkv';
import {
	Rank,
	RiderType,
	SelectedTrick,
	TextInputMaxCharacters,
	Trick,
	TrickSpot,
	UserRank,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
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

	const max_steps = 4;

	const [stepsComplete, setStepsComplete] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

	// page data
	const [username, setUsername] = useState<string>('');
	const [selectedBestTricks, setSelectedBestTricks] = useState<SelectedTrick[]>(
		[],
	);
	const [userRank, setUserRank] = useState<number>(0);
	const [loadingModalVisible, setLoadingModalVisible] =
		useState<boolean>(false);

	const [averageTrickPointsOfBestTricks, setAverageTrickPointsOfBestTricks] =
		useState<number>(0);

	const [usernameIsTaken, setUsernameIsTaken] = useState<boolean>(false);

	const [mustSelectRiderType, setMustSelectRiderType] =
		useState<boolean>(false);
	const [riderType, setRiderType] = useState<RiderType>(null);

	const [trickSearchQuery, setTrickSearchQuery] = useState<string>('');
	const [showWarningToWriteName, setShowWarningToWriteName] =
		useState<boolean>(false);

	const [trickSelectedForSpotSelection, setTrickSelectedForSpotSelection] =
		useState<SelectedTrick | null>(null);

	const [mustSelectOneTrick, setMustSelectOneTrick] = useState<boolean>(false);

	const { commonTricks, loading, error } = useCommonTricks();

	let usertoken: any;

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
		try {
			setLoadingRequest(true);
			setLoadingModalVisible(true);

			usertoken = await getToken();

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

			if (!response.ok) {
				console.warn(
					'Error posting tricks:',
					response.status,
					result?.error || result,
				);
				return false;
			}

			setAverageTrickPointsOfBestTricks(result.user_points);
			setUserRank(result.rank);

			return true;
		} catch (error) {
			console.warn('handlePostBestTricks error:', error);
			return false;
		} finally {
			setLoadingRequest(false);
			setLoadingModalVisible(false);
		}
	};

	const handlePostRiderType = async () => {
		try {
			setLoadingRequest(true);
			setLoadingModalVisible(true);

			usertoken = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/users/${user?.id}/setRiderType`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${usertoken}`,
					},
					body: JSON.stringify({ riderType }),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				console.warn('Error:', result);
				throw new Error(
					result?.error || 'Something went wrong posting rider type',
				);
			}

			return true;
		} catch (error) {
			console.warn('handlePostRiderType error:', error);
			return false;
		} finally {
			setLoadingRequest(false);
			setLoadingModalVisible(false);
		}
	};

	const allowedToContinueHandler = async () => {
		setShowWarningToWriteName(false);
		setUsernameIsTaken(false);
		setMustSelectOneTrick(false);
		setMustSelectRiderType(false);

		switch (currentStep) {
			case 1: // page 2: rider name
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

			case 2: // page 3: rider type
				if (!riderType) {
					setMustSelectRiderType(true);
					return false;
				}

				await handlePostRiderType();
				break;

			case 3: // page 4: tricks
				if (selectedBestTricks.length <= 0) {
					setMustSelectOneTrick(true);
					return false;
				}

				const result = await handlePostBestTricks();
				return result;
		}

		return true;
	};

	const handleContinue = async () => {
		const result = await allowedToContinueHandler();

		if (!result) return false;

		setStepsComplete((prev) => {
			if (prev < max_steps) {
				setCurrentStep(prev + 1);
				return prev + 1;
			}

			mmkv.set('userSignedInOnce', true);
			router.replace('/(auth)/(tabs)/homePages');

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
				const exists = prev.some((t) => t.Name === Trick.Name);

				if (exists) return prev;

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
			scrollEnabled={false}
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
				/>
			}
			scrollChildren={
				<View style={{ flex: 1 }}>
					<StatusBar barStyle={'default'} />

					{/* progress bar */}
					<View
						style={[
							{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								width: Dimensions.get('window').width,
								// backgroundColor: 'yellow',
							},
						]}>
						<ProgressionBar
							theme={theme}
							progress={stepsComplete}
							totalProgress={4}
						/>
					</View>

					{/* main action text container */}
					<View
						style={{
							flex: 12,
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							// backgroundColor: 'blue',
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
								userRank={userRank}
								setMustSelectOneTrick={setMustSelectOneTrick}
								mustSelectOneTrick={mustSelectOneTrick}
								mustSelectRiderType={mustSelectRiderType}
								setRiderType={setRiderType}
								riderType={riderType}
								setMustSelectRiderType={setMustSelectRiderType}
							/>
						)}

						<BuildCharacterUI visible={currentStep === 6} />
					</View>

					{/* bottom action container */}
					<View
						style={{
							alignItems: 'center',
							gap: 10,
							backgroundColor: Colors[theme].background,
							padding: 12,
							flex: 1,
						}}>
						{currentStep < 6 && (
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

					{/* loading screen */}
					{loadingRequest && (
						<TransparentLoadingScreen
							visible={loadingModalVisible}
							progress={0}
							showProgress={false}
						/>
					)}

					<BottomSheetModal
						index={1}
						snapPoints={snapPoints}
						handleIndicatorStyle={{ backgroundColor: 'gray' }}
						backgroundStyle={{
							backgroundColor: Colors[theme].background2,
						}}
						ref={bottomSheetRef}>
						<BottomSheetView>
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
