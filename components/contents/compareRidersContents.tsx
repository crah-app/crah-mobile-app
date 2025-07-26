import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import ThemedView from '../general/ThemedView';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
	CrahUserDetailedStats,
	CrahUserWithBestTrick,
	fetchAdresses,
	RankColors,
	selectedRiderInterface,
	selectedTrickInterface,
	TrickSpot,
	UserTrickProfileData,
} from '@/types';
import HeaderScrollView from '../header/HeaderScrollView';
import CostumHeader from '../header/CostumHeader';
import PostTypeButton from '../PostTypeButton';
import BottomSheetModalComponent from './compareRidersBottomSheetModal';
import useCrahUser from '@/hooks/useCrahUser';
import { router } from 'expo-router';
import Row from '../general/Row';
import HeaderLeftLogo from '../header/headerLeftLogo';
import { useNotifications } from 'react-native-notificated';
import { formatErrorMessage } from '@/utils/globalFuncs';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import TrickRow from '../rows/TrickRow';

interface CompareRidersContentsProps {
	rider1Id: string;
	rider2Id: string;
}

const CompareRidersContents: React.FC<CompareRidersContentsProps> = ({
	rider1Id,
	rider2Id,
}) => {
	const { getToken } = useAuth();
	const { user: clerkUser } = useUser();
	const { user } = useCrahUser(clerkUser);
	const theme = useSystemTheme();

	const [rider1, setRider1] = useState<selectedRiderInterface | null>(null);
	const [rider2, setRider2] = useState<selectedRiderInterface | null>(null);
	const [rider1Data, setRider1Data] = useState<UserTrickProfileData | null>(
		null,
	);
	const [rider2Data, setRider2Data] = useState<UserTrickProfileData | null>(
		null,
	);

	const { notify } = useNotifications();

	// if user did not already selected himself he shouldn`t be displayed in the search suggestions
	const [displaySelfInSuggestions, setDisplaySelfInSuggestions] =
		useState<boolean>(true);
	const [selected_riderInput, setSelected_riderInput] = useState<
		number | undefined
	>();

	const [loading, setLoading] = useState<boolean>(false);
	const [processState, setProcessState] = useState<'choosing' | 'comparing'>(
		'choosing',
	);
	const [comparisonLevel, setComparisonLevel] = useState<TrickSpot | 'Rank'>(
		'Rank',
	);

	const ref = useRef<BottomSheetModal>(null);

	const headerY = useSharedValue(0);
	const inputsY = useSharedValue(0);
	const buttonY = useSharedValue(0);

	// Styles
	const headerAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: headerY.value }],
	}));

	const inputsAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: inputsY.value }],
	}));

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: buttonY.value }],
	}));

	const handleSearchUserBottomSheet = (index: number) => {
		console.log(
			rider1?._id,
			rider2?._id,
			user?.Id,
			index,
			rider2?._id == user?.Id || rider1?._id == user?.Id ? false : true,
		);
		setSelected_riderInput(index);
		setDisplaySelfInSuggestions(
			rider2?._id == user?.Id || rider1?._id == user?.Id ? false : true,
		);
		handlePresentModalPress();
	};

	const fetchRiderData = async (riderId: string) => {
		try {
			if (!riderId) {
				throw new Error('Precondition failed: riderId is not of type string.');
			}

			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/users/${riderId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}

			const data = JSON.parse(text);
			return data;
		} catch (error: any) {
			notify('error', {
				params: {
					title: 'Error',
					description: formatErrorMessage(error),
				},
			});
			console.error(
				`Error [fetchRiderData] in Component CompareRidersComponent ${riderId}`,
				error,
			);
			return [];
		}
	};

	const handleCompareRider = async () => {
		if (loading) return;

		if (processState === 'comparing') {
			setProcessState('choosing');
			headerY.value = withTiming(0);
			inputsY.value = withTiming(0);
			buttonY.value = withTiming(0);
			return;
		}

		setLoading(true);
		setProcessState('comparing');

		if (!rider1?._id || !rider2?._id) {
			notify('error', {
				params: {
					title: 'Error',
					description: 'Rider is missing',
				},
			});
			return;
		}

		const rider1Data = await fetchRiderData(rider1?._id);
		const rider2Data = await fetchRiderData(rider2._id);

		if (!rider1Data || !rider2Data) {
			console.warn(
				'Error [handleCompareRider] rider1Data or rider2Data is Falsy',
			);
			notify('error', {
				params: {
					title: 'Error',
					description: 'Something went wrong',
				},
			});
			return;
		}

		setRider1Data(rider1Data);
		setRider2Data(rider2Data);

		headerY.value = withTiming(-200, {
			duration: 600,
			easing: Easing.inOut(Easing.ease),
		});
		inputsY.value = withTiming(-200, {
			duration: 600,
			easing: Easing.inOut(Easing.ease),
		});
		buttonY.value = withTiming(-130, {
			duration: 600,
			easing: Easing.inOut(Easing.ease),
		});

		setLoading(false);
	};

	const handlePresentModalPress = useCallback(() => {
		ref?.current?.present();
	}, []);

	const handleCloseModalPress = useCallback(() => {
		ref?.current?.close();
	}, []);

	const handleUserPress = useCallback(
		(user: selectedRiderInterface) => {
			if (!user) return;
			handleCloseModalPress();

			// update rider1 or rider2 accordingly
			switch (selected_riderInput) {
				case 0:
					setRider1(user);

					break;

				case 1:
					setRider2(user);
					break;
			}

			setSelected_riderInput(undefined);
		},
		[handleCloseModalPress, selected_riderInput],
	);

	useEffect(() => {
		if (!rider1 || !rider2) {
			setProcessState('choosing');
			headerY.value = withTiming(0);
			inputsY.value = withTiming(0);
			buttonY.value = withTiming(0);
		}
	}, [rider1, rider2]);

	const onTrickPress = (trickName: string) => {
		// navigate to trick page
	};

	const displayBottomText = (): string => {
		if (!rider1Data || !rider2Data) return 'Comparison data is incomplete.';

		const rider1 = rider1Data?.[0]?.[0];
		const rider2 = rider2Data?.[0]?.[0];
		const tricks1 = rider1Data?.[1]?.[0];
		const tricks2 = rider2Data?.[1]?.[0];

		if (!rider1 || !rider2) return 'Rider info missing.';

		switch (comparisonLevel) {
			case 'Rank': {
				const subtraction = (rider1.rankPoints ?? 0) - (rider2.rankPoints ?? 0);

				if (subtraction === 0) {
					return 'Both riders have the same number of rank points.';
				}

				const leader = subtraction > 0 ? rider1.Name : rider2.Name;
				return `${leader} is ${Math.abs(subtraction)} points ahead in rank.`;
			}

			case 'Flat': {
				const trick1 = tricks1?.Flat?.[0];
				const trick2 = tricks2?.Flat?.[0];

				if (!trick1 && !trick2) return 'Neither rider has a flat trick.';
				if (!trick1) return `${rider1.Name} has no flat trick.`;
				if (!trick2) return `${rider2.Name} has no flat trick.`;

				const diff = trick1.Points - trick2.Points;
				if (diff === 0)
					return 'Both riders share a flat trick of the same difficulty.';

				const leader = diff > 0 ? rider1.Name : rider2.Name;
				return `${leader} is ${Math.abs(diff)} points ahead on flatground.`;
			}

			case 'Park': {
				const trick1 = tricks1?.Park?.[0];
				const trick2 = tricks2?.Park?.[0];

				if (!trick1 && !trick2) return 'Neither rider has a park trick.';
				if (!trick1) return `${rider1.Name} has no park trick.`;
				if (!trick2) return `${rider2.Name} has no park trick.`;

				const diff = trick1.Points - trick2.Points;
				if (diff === 0)
					return 'Both riders share a park trick of the same difficulty.';

				const leader = diff > 0 ? rider1.Name : rider2.Name;
				return `${leader} is ${Math.abs(
					diff,
				)} points ahead in the park discipline.`;
			}

			case 'Street': {
				const trick1 = tricks1?.Street?.[0];
				const trick2 = tricks2?.Street?.[0];

				if (!trick1 && !trick2) return 'Neither rider has a street trick.';
				if (!trick1) return `${rider1.Name} has no street trick.`;
				if (!trick2) return `${rider2.Name} has no street trick.`;

				const diff = trick1.Points - trick2.Points;
				if (diff === 0)
					return 'Both riders share a street trick of the same difficulty.';

				const leader = diff > 0 ? rider1.Name : rider2.Name;
				return `${leader} is ${Math.abs(diff)} points ahead in street.`;
			}

			default:
				return 'No comparison available.';
		}
	};

	const onComparisonLevelPress = () => {
		setComparisonLevel((prev) => {
			switch (prev) {
				case 'Flat':
					return 'Rank';

				case 'Park':
					return 'Street';

				case 'Rank':
					return 'Park';

				case 'Street':
					return 'Flat';
			}
		});
	};

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={
						<View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
							<TouchableOpacity onPress={router.back}>
								<Ionicons
									name="chevron-back"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<HeaderLeftLogo />
						</View>
					}
					headerRight={<View style={{ flex: 1 }}></View>}
				/>
			}
			scrollChildren={
				<ThemedView
					flex={1}
					style={[{ padding: 12, top: Dimensions.get('window').height / 5 }]}
					theme={theme}>
					{/* header */}
					<Animated.View style={[headerAnimatedStyle]}>
						<ThemedText
							theme={theme}
							value={'Compare Two Riders'}
							style={[defaultStyles.bigText, { fontWeight: 600 }]}
						/>
					</Animated.View>
					{/* rider input area */}
					<Animated.View
						style={[{ gap: 12, marginTop: 24 }, inputsAnimatedStyle]}>
						<RiderInputField
							theme={theme}
							onPress={() => handleSearchUserBottomSheet(0)}
							text="Search for Rider 1"
							index={0}
							setSelected_riderInput={setSelected_riderInput}
							rider1={rider1}
							setRider1={setRider1}
						/>
						<RiderInputField
							theme={theme}
							onPress={() => handleSearchUserBottomSheet(1)}
							text="Search for Rider 2"
							index={1}
							setSelected_riderInput={setSelected_riderInput}
							rider2={rider2}
							setRider2={setRider2}
						/>
					</Animated.View>

					{/* spcae between the two containers after animation */}
					{processState === 'comparing' &&
						!loading &&
						rider1Data &&
						rider2Data && (
							<Animated.View style={[inputsAnimatedStyle, { gap: 24 }]}>
								<View
									style={{
										borderBottomWidth: 2,
										borderBottomColor: Colors[theme].primary,
										paddingVertical: 12,
										gap: 4,
									}}>
									<ThemedText
										value={`Comparison`}
										theme={theme}
										style={[defaultStyles.bigText, { fontWeight: '500' }]}
									/>

									<TouchableOpacity onPress={onComparisonLevelPress}>
										<ThemedText
											value={`${comparisonLevel} >`}
											theme={theme}
											style={[{ color: Colors[theme].primary }]}
										/>
									</TouchableOpacity>
								</View>

								<View style={{ gap: 12 }}>
									<ThemedText
										value={`Best Trick from ${rider1?.name}`}
										theme={theme}
										style={[defaultStyles.biggerText]}
									/>
									<TrickRow
										name={`${rider1Data[2][0].Name}`}
										onPress={() => onTrickPress(rider1Data[2][0].Name)}
										difficulty={rider1Data[2][0].Difficulty}
										points={rider1Data[2][0].Points}
									/>
								</View>

								<View style={{ gap: 12 }}>
									<ThemedText
										value={`Best Trick from ${rider2?.name}`}
										theme={theme}
										style={[defaultStyles.biggerText]}
									/>
									<TrickRow
										name={`${rider2Data[2][0].Name}`}
										onPress={() => onTrickPress(rider2Data[2][0].Name)}
										difficulty={rider2Data[2][0].Difficulty}
										points={rider2Data[2][0].Points}
									/>
								</View>

								<View style={{ height: 50 }}>
									<ThemedText
										value={displayBottomText()}
										theme={theme}
										style={[{ fontSize: 18, textAlign: 'center', top: 16 }]}
									/>
								</View>
							</Animated.View>
						)}

					{/* Button */}
					<Animated.View style={[{ marginTop: 24 }, buttonAnimatedStyle]}>
						<PostTypeButton
							val={
								processState === 'choosing'
									? 'Compare'
									: `${rider1?.name} VS ${rider2?.name}`
							}
							click_action={handleCompareRider}
							style={{ width: '100%' }}
						/>
					</Animated.View>

					{/* bottom sheet */}
					<BottomSheetModalComponent
						handleUserPress={handleUserPress}
						theme={theme}
						displaySelfInSuggestions={displaySelfInSuggestions}
						rider1={rider1}
						rider2={rider2}
						ref={ref}
						selected_riderInput={selected_riderInput}
						user={user}
					/>
				</ThemedView>
			}
		/>
	);
};

interface Props {
	theme: 'light' | 'dark';
	onPress: () => void;
	text: string;
	index: 0 | 1;
	setSelected_riderInput: Dispatch<SetStateAction<number | undefined>>;
	rider1?: selectedRiderInterface | null;
	rider2?: selectedRiderInterface | null;
	setRider1?: Dispatch<SetStateAction<selectedRiderInterface | null>>;
	setRider2?: Dispatch<SetStateAction<selectedRiderInterface | null>>;
}

const RiderInputField: React.FC<Props> = ({
	theme,
	onPress,
	text,
	index: selected_index,
	setSelected_riderInput,
	rider1,
	rider2,
	setRider1,
	setRider2,
}) => {
	if (rider1) {
		return (
			<Row
				containerStyle={{
					height: 72,
				}}
				showAvatar
				avatarUrl={rider1.avatar}
				title={`${rider1.name}`}
				subtitle={rider1.rank}
				subtitleStyle={{
					color: RankColors[rider1.rank][0],
				}}
				customRightComponent={
					<View style={{ marginHorizontal: 24 }}>
						<TouchableOpacity onPress={() => setRider1!(null)}>
							<Ionicons
								name="close-outline"
								size={defaultHeaderBtnSize - 12}
								color={Colors[theme].gray}
							/>
						</TouchableOpacity>
					</View>
				}
			/>
		);
	}

	if (rider2) {
		return (
			<Row
				containerStyle={{
					height: 72,
				}}
				showAvatar
				avatarUrl={rider2.avatar}
				title={`${rider2.name}`}
				subtitle={rider2.rank}
				subtitleStyle={{
					color: RankColors[rider2.rank][0],
				}}
				customRightComponent={
					<View style={{ marginHorizontal: 24 }}>
						<TouchableOpacity onPress={() => setRider2!(null)}>
							<Ionicons
								name="close-outline"
								size={defaultHeaderBtnSize - 12}
								color={Colors[theme].gray}
							/>
						</TouchableOpacity>
					</View>
				}
			/>
		);
	}

	return (
		<View
			style={
				{
					// height: 72,
				}
			}>
			<TouchableOpacity
				key={selected_index}
				onPress={onPress}
				style={{
					backgroundColor: Colors[theme].background2,
					padding: 16,
					borderRadius: 10,
				}}>
				<ThemedText
					value={text}
					theme={theme}
					style={[{ color: Colors[theme].gray, fontSize: 18 }]}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default CompareRidersContents;
