import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import ThemedView from '../general/ThemedView';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import { CrahUserDetailedStats, fetchAdresses } from '@/types';
import HeaderScrollView from '../header/HeaderScrollView';
import CostumHeader from '../header/CostumHeader';
import PostTypeButton from '../PostTypeButton';
import BottomSheetModalComponent from './compareRidersBottomSheetModal';
import useCrahUser from '@/hooks/useCrahUser';

interface CompareRidersContentsProps {
	rider1Id: string;
	rider2Id: string;
}

const CompareRidersContents: React.FC<CompareRidersContentsProps> = ({
	rider1Id,
	rider2Id,
}) => {
	const { user: clerkUser } = useUser();
	const { user } = useCrahUser(clerkUser);
	const theme = useSystemTheme();

	const [loading, setLoading] = useState(true);
	const [rider1, setRider1] = useState<CrahUserDetailedStats | null>(null);
	const [rider2, setRider2] = useState<CrahUserDetailedStats | null>(null);

	const [allUsers, setAllUsers] = useState<CrahUserDetailedStats[]>([]);
	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	// if user did not already selected himself he shouldn`t be displayed in the search suggestions
	const [selfIsSelected, setSelfIsSelected] = useState<boolean>();

	const [selected_riderId, setSelected_riderId] = useState<string | undefined>(
		'',
	);

	const ref = useRef<BottomSheetModal>(null);

	const handleSearchUserBottomSheet = () => {
		handlePresentModalPress();
	};

	const fetchRiderData = async (riderId: string, setRider: Function) => {
		try {
			const response = await fetch(
				`http://192.168.0.136:4000/api/users/${riderId}`,
			);
			const data = await response.json();
			setRider(data);
		} catch (error) {
			console.error(
				`Error [fetchRiderData] in Component CompareRidersComponent ${riderId}`,
				error,
			);
			setError(new Error(String(error)));
		}
	};

	useEffect(() => {
		if (!rider1Id || !rider2Id) {
			setError(
				new Error('Precondition failed: rider1Id or rider2Id is missing.'),
			);
			return;
		}

		setLoading(true);
		Promise.all([
			fetchRiderData(rider1Id, setRider1),
			fetchRiderData(rider2Id, setRider2),
		]).finally(() => setLoading(false));
	}, [rider1Id, rider2Id]);

	const handleCompareRider = () => {};

	const handlePresentModalPress = useCallback(() => {
		ref?.current?.present();
	}, []);

	const handleCloseModalPress = useCallback(() => {
		ref?.current?.close();
	}, []);

	const handleUserPress = useCallback(
		(userId: string | undefined) => {
			if (!userId) return;
			handleCloseModalPress();
			// likely you also want to update rider1Id or rider2Id here!
		},
		[handleCloseModalPress],
	);

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={
						<View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
							<TouchableOpacity>
								<Ionicons
									name="chevron-back"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</View>
					}
					headerRight={<View style={{ flex: 1 }}></View>}
					headerBottom={
						<View style={{ height: 100 }}>
							<ThemedText
								theme={theme}
								value={'Compare Two Riders'}
								style={[
									defaultStyles.bigText,
									{ flex: 1, top: 100, fontWeight: 600 },
								]}
							/>
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView flex={1} style={[{ padding: 12 }]} theme={theme}>
					{/* rider input area */}
					<View
						style={{ gap: 12, flex: 1, justifyContent: 'center', bottom: 92 }}>
						<RiderInputField
							theme={theme}
							onPress={handleSearchUserBottomSheet}
						/>
						<RiderInputField
							theme={theme}
							onPress={handleSearchUserBottomSheet}
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
						displaySelfInSuggestions={false}
						rider={null}
						ref={ref}
						selected_riderId={selected_riderId}
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
}

const RiderInputField: React.FC<Props> = ({ theme, onPress }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				backgroundColor: Colors[theme].background2,
				padding: 16,
				borderRadius: 10,
			}}>
			<ThemedText
				value={'Rider 1'}
				theme={theme}
				style={[{ color: Colors[theme].gray, fontSize: 18 }]}
			/>
		</TouchableOpacity>
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
