import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
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

	const [rider1Data, setRider1Data] = useState<CrahUserWithBestTrick | null>(
		null,
	);
	const [rider2Data, setRider2Data] = useState<CrahUserWithBestTrick | null>(
		null,
	);

	const [error, setError] = useState<Error | null>(null);

	const { notify } = useNotifications();

	// if user did not already selected himself he shouldn`t be displayed in the search suggestions
	const [displaySelfInSuggestions, setDisplaySelfInSuggestions] =
		useState<boolean>(true);

	const [selected_riderInput, setSelected_riderInput] = useState<
		number | undefined
	>();

	const ref = useRef<BottomSheetModal>(null);

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

	const fetchRiderData = async (riderId: string, setRider: Function) => {
		try {
			if (!riderId) {
				setError(
					new Error('Precondition failed: riderId is not of type string.'),
				);
				return;
			}

			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/users/ranked/allStats`,
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
			setRider(data);
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
			setError(new Error(String(error)));
			return [];
		}
	};

	const handleCompareRider = async () => {
		if (!rider1?._id || !rider2?._id) {
			notify('error', {
				params: {
					title: 'Error',
					description: 'Rider is missing',
				},
			});
			return;
		}

		const rider1Data = await fetchRiderData(rider1?._id, setRider1Data);
		const rider2Data = await fetchRiderData(rider2._id, setRider2Data);

		console.log(rider1Data);
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
				<ThemedView flex={1} style={[{ padding: 12 }]} theme={theme}>
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<ThemedText
							theme={theme}
							value={'Compare Two Riders'}
							style={[defaultStyles.bigText, { fontWeight: 600 }]}
						/>
					</View>
					{/* rider input area */}
					<View
						style={{
							gap: 12,
							flex: 2,
							justifyContent: 'flex-start',
						}}>
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

						<PostTypeButton
							val="Compare"
							click_action={handleCompareRider}
							style={{ width: '100%' }}
						/>
					</View>

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

interface TrickTextContainerProps {
	name: string;
	points: number;
	id: string;
	theme: 'light' | 'dark';
}

const TrickTextContainer: React.FC<TrickTextContainerProps> = ({
	name,
	points,
	id,
	theme,
}) => {
	return (
		<View
			key={id}
			style={{
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				paddingVertical: 8,
			}}></View>
	);
};

const styles = StyleSheet.create({});

export default CompareRidersContents;
