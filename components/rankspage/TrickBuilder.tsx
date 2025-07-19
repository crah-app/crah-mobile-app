import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import {
	Alert,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ThemedTextInput from '../general/ThemedTextInput';
import {
	BestTrickType,
	Rank,
	SelectedTrick,
	SpotInterface,
	TextInputMaxCharacters,
	TrickDifficulty,
	TrickListGeneralSpotCategory,
	TrickSpot,
	UserRank,
} from '@/types';
import { defaultStyles } from '@/constants/Styles';
import { format } from 'date-fns';
import TrickPreviewCard from './TrickPreviewCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import PostTypeButton from '../PostTypeButton';
import TransparentLoadingScreen from '../TransparentLoadingScreen';
import Tag from '../tag';
import TrickLandedModal from '@/app/(auth)/modals/ranks/TrickLandedModal';
import NewRankModal from '@/app/(auth)/modals/ranks/NewRankModal';

interface TrickBuilderProps {}

interface SpotRowProps {
	spotData: SpotInterface;
	addSpot: boolean;
	theme: 'light' | 'dark';
	key: number;
	index: number;
}

interface TrickDetailsProps {
	theme: 'light' | 'dark';
	trickCreated: boolean;
	spots: SpotInterface[];
	value: string;
	user: any;
}

interface TableHeaderProps {
	isDisabled: boolean;
	theme: 'light' | 'dark';
}

interface TitleProps {
	trickCreated: boolean;
	addedSpot: boolean;
	theme: 'light' | 'dark';
}

interface TrickBuilderBodyProps {
	theme: 'light' | 'dark';
	trickCreated: boolean;
	addedSpot: boolean;
	value: string;
	setValue: (v: string) => void;
	handleCreateTrick: () => void;
	spots: SpotInterface[];
	user: any;
	setSpots: Dispatch<SetStateAction<SpotInterface[]>>;
}

interface InputFieldProps {
	theme: 'light' | 'dark';
	value: string;
	setValue: (v: string) => void;
	handleCreateTrick: () => void;
	trickCreated: boolean;
}

interface AddSpotInputField {
	theme: 'light' | 'dark';
	value: string;
	setValue: (v: string) => void;
	handleCreateTrick: () => void;
	trickCreated: boolean;
	addedSpot: boolean;
	spots: SpotInterface[];
	setSpots: Dispatch<SetStateAction<SpotInterface[]>>;
}

enum GeneralSpot {
	Flat = 'Flat',
	Street = 'Street',
	Park = 'Park',
}

interface TrickLandedServerResult {
	user_points: number | string;
	user_total_points: number;
	trick_total_points: number;
	best_trick_difficulty: TrickDifficulty;
	best_trick_name: string;
	best_trick_spots: {
		spot: GeneralSpot;
		date?: Date;
	}[];
	old_rank: number; // old rank
	new_rank: number; // new rank
	unrecognized_word?: string;
}

const TrickBuilder: React.FC<TrickBuilderProps> = ({}) => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { getToken } = useAuth();

	// information states
	const [trickCreated, setTrickCreated] = useState<boolean>(false);
	const [addedSpot, setAddedSpot] = useState<boolean>(false);

	const [value, setValue] = useState<string>('');
	const [spots, setSpots] = useState<SpotInterface[]>([]);

	const [tricks, setTricks] = useState<SelectedTrick[]>([]);

	// logic states
	const [loading, setLoading] = useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	const [trickLandedModalVisible, setTrickLandedModalVisible] =
		useState<boolean>(false);
	const [rankModalVisible, setRankModalVisible] = useState<boolean>(false);

	const [serverResult, setServerResult] = useState<TrickLandedServerResult>({
		best_trick_difficulty: TrickDifficulty.ADVANCED,
		best_trick_name: '',
		best_trick_spots: [{ spot: GeneralSpot.Park }],
		new_rank: -1,
		old_rank: -1,
		trick_total_points: -1,
		user_points: -1,
		user_total_points: -1,
	});

	const [trickTotalPoints, setTrickTotalPoints] = useState<number>(0);
	const [bestTrickName, setBestTrickName] = useState<string>('');
	const [bestTrickSpots, setBestTrickSpots] = useState<
		{ spot: GeneralSpot; date?: Date }[]
	>([]);

	const [rankSet, setRankSet] = useState<{
		old_rank: number;
		new_rank: number;
	}>({ old_rank: -2, new_rank: -2 });

	const createTrickObject = (): SelectedTrick[] => {
		const spotList: SelectedTrick[] = spots.map((obj) => ({
			Spot: obj.spot,
			Name: value,
			DefaultPoints: 0,
			Costum: false,
			Type: '',
			SecondName: '',
			Date: obj.landing_date,
		}));

		// "Park" is a placeholder because it does not manipulate trick points
		const createdTrick: SelectedTrick[] =
			spotList.length <= 0
				? [
						{
							Spot: 'Park', // spots currentuser landed the trick
							Name: value, // trick name
							DefaultPoints: 0, // default points get calculated in the backend
							Costum: false, // gets evaluated in the backend
							Type: '', // gets evaluated in the backend
							SecondName: '', // leave it blank
						},
				  ]
				: spotList;

		setTricks(createdTrick);
		return createdTrick;
	};

	const handleCreateTrick = async () => {
		try {
			if (value.length <= 0) return;

			setLoading(true);
			setModalVisible(true);

			const createdTrick = createTrickObject();
			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/tricks/${user?.id}/setTricks`,
				{
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ tricks: createdTrick }),
				},
			);

			const text = await response.text();

			if (!response.ok) {
				setTrickCreated(false);
				setLoading(false);
				setModalVisible(false);
				setAddedSpot(false);

				let errorObj: any = {};
				try {
					errorObj = JSON.parse(text);
				} catch (e) {
					console.warn('Failed to parse error JSON:', e);
				}

				if (errorObj.unrecognized_word) {
					console.log(`Word ${errorObj.unrecognized_word} is unknown`);
					// Spezieller Case:
					Alert.alert(`Word not recognized: ${errorObj.unrecognized_word}`);
				} else {
					Alert.alert('Error adding trick');
				}
				return;
			}

			const result: TrickLandedServerResult = JSON.parse(text);

			// first step finished: trick name
			if (!trickCreated && !addedSpot) {
				setTrickCreated(true);
				setRankSet({ old_rank: result.old_rank, new_rank: result.new_rank });

				setTrickTotalPoints(result.trick_total_points);
				setBestTrickName(result.best_trick_name);
				setBestTrickSpots(result.best_trick_spots);
			}

			// second step finished: spots
			if (trickCreated && !addedSpot) {
				setAddedSpot(true);

				setTrickTotalPoints(result.trick_total_points);
				setBestTrickName(result.best_trick_name);
				setBestTrickSpots(result.best_trick_spots);

				setTrickLandedModalVisible(true);
				setRankSet((prev) => ({ ...prev, new_rank: result.new_rank }));
			}
		} catch (error) {
			if (error) Alert.alert('Error adding trick');
			console.warn(error);
		} finally {
			setLoading(false);
			setModalVisible(false);
		}
	};

	useEffect(() => {
		console.log(serverResult);
		return () => {};
	}, [serverResult]);

	return (
		<View>
			<TrickLandedModal
				theme={theme}
				additionalPoints={trickTotalPoints ?? -1}
				trickName={bestTrickName}
				trickSpot={bestTrickSpots[0]?.spot as TrickSpot}
				visible={trickLandedModalVisible}
				setVisible={setTrickLandedModalVisible}
				setAddedSpot={setAddedSpot}
				setTrickCreated={setTrickCreated}
				setValue={setValue}
				setSpots={setSpots}
				oldRank={rankSet.old_rank}
				newRank={rankSet.new_rank}
				setRankModalVisible={setRankModalVisible}
			/>

			<NewRankModal
				theme={theme}
				oldRank={rankSet.old_rank}
				newRank={rankSet.new_rank}
				totalUserRankPoints={serverResult?.user_total_points ?? 0}
				visible={rankModalVisible}
				setVisible={setRankModalVisible}
			/>

			<TransparentLoadingScreen
				visible={modalVisible}
				progress={0}
				showProgress={false}
			/>
			<TrickBuilderBody
				theme={theme}
				trickCreated={trickCreated}
				addedSpot={addedSpot}
				value={value}
				setValue={setValue}
				handleCreateTrick={async () => handleCreateTrick()}
				spots={spots}
				user={user}
				setSpots={setSpots}
			/>
		</View>
	);
};

const TrickBuilderBody = React.memo(
	({
		theme,
		trickCreated,
		addedSpot,
		value,
		setValue,
		handleCreateTrick,
		spots,
		user,
		setSpots,
	}: TrickBuilderBodyProps) => (
		<View
			style={{
				gap: 18,
				paddingVertical: 24,
				paddingHorizontal: 24,
				width: Dimensions.get('window').width,
				minHeight: 550,
				justifyContent: 'center',
			}}>
			<Title theme={theme} trickCreated={trickCreated} addedSpot={addedSpot} />
			<InputField
				theme={theme}
				value={value}
				setValue={setValue}
				handleCreateTrick={async () => handleCreateTrick()}
				trickCreated={trickCreated}
			/>
			<AddSpotInputField
				theme={theme}
				value={value}
				setValue={setValue}
				handleCreateTrick={async () => handleCreateTrick()}
				trickCreated={trickCreated}
				spots={spots}
				addedSpot={addedSpot}
				setSpots={setSpots}
			/>
			{/* {trickCreated && addedSpot ? (
				<TrickDetails
					theme={theme}
					trickCreated={trickCreated}
					spots={spots}
					value={value}
					user={user}
				/>
			) : null} */}
		</View>
	),
);

// spot row
const SpotRow = React.memo(
	({ spotData, addSpot, theme, index }: SpotRowProps) => {
		useEffect(() => {
			console.log('adsg', index, spotData.spot);
			return () => {};
		}, []);

		return (
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					height: 35,
					borderBottomColor: Colors[theme].gray,
					borderBottomWidth:
						!addSpot && index <= 1 ? StyleSheet.hairlineWidth : 0,
					paddingLeft: 12,
					paddingBottom: addSpot ? 0 : 8,
				}}>
				{/* left side */}
				<View style={styles.innerRowContainer}>
					{addSpot ? (
						<TouchableOpacity>
							<Ionicons
								size={24}
								color={Colors[theme].textPrimary}
								name={'add-circle-outline'}
							/>
						</TouchableOpacity>
					) : (
						<ThemedText theme={theme} value={spotData.spot} />
					)}
				</View>

				{/* right side */}
				<View style={styles.innerRowContainer}>
					{addSpot ? (
						<ThemedText
							style={{ color: Colors[theme].gray }}
							theme={theme}
							value={'YYYY-MM-DD'}
						/>
					) : (
						<ThemedText
							theme={theme}
							value={format(spotData.landing_date || new Date(), 'yyyy-MM-dd')}
						/>
					)}
				</View>
			</View>
		);
	},
);

const TableHeader = React.memo(({ isDisabled, theme }: TableHeaderProps) => {
	if (isDisabled) {
		return <></>;
	}

	return (
		<View
			style={{
				flexDirection: 'row',
				width: '100%',
				paddingVertical: 8,
				marginLeft: 12,
			}}>
			<View
				style={{
					flex: 1,
					alignItems: 'flex-start',
					justifyContent: 'center',
				}}>
				<ThemedText theme={theme} value={'Spot'} />
			</View>

			<View style={styles.innerRowContainer}>
				<ThemedText theme={theme} value={'Landed on'} />
			</View>
		</View>
	);
});

const Title = React.memo(({ trickCreated, addedSpot, theme }: TitleProps) => (
	<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 12 }}>
		{!trickCreated && (
			<ThemedText
				style={[
					defaultStyles.bigText,
					{ fontWeight: 700, textAlign: 'center' },
				]}
				theme={theme}
				value={'You landed a new trick?'}
			/>
		)}
		{!addedSpot && trickCreated && (
			<ThemedText
				style={[
					defaultStyles.bigText,
					{ fontWeight: 700, textAlign: 'center' },
				]}
				theme={theme}
				value={'Where did you land it?'}
			/>
		)}
	</View>
));

const InputField = React.memo(
	({
		theme,
		value,
		setValue,
		handleCreateTrick,
		trickCreated,
	}: InputFieldProps) => {
		if (trickCreated) return null;
		return (
			<View style={{ gap: 14, flex: 1 }}>
				<ThemedTextInput
					containerStyle={{ width: '100%' }}
					makeWordToBubble
					theme={theme}
					value={value}
					setValue={setValue}
					lines={1}
					maxLength={TextInputMaxCharacters.Simple}
					placeholder="Your landed trick"
				/>
				<PostTypeButton
					val="Add it!"
					click_action={async () => handleCreateTrick()}
					style={{ width: '100%' }}
				/>
			</View>
		);
	},
);

const AddSpotInputField = React.memo(
	({
		theme,
		handleCreateTrick,
		trickCreated,
		addedSpot,
		spots,
		setSpots,
	}: AddSpotInputField) => {
		// add/remove spot from spot array state
		const handleSpotPress = (spot: TrickSpot) => {
			// remove
			if (spots.some((obj) => obj.spot === spot)) {
				setSpots((prev) => spots.filter((obj) => obj.spot !== spot));
				return;
			}

			// add
			setSpots((prev) => [...prev, { spot, landing_date: new Date() }]);
		};

		return (
			<>
				{!addedSpot && trickCreated && (
					<View
						style={{
							gap: 14,
							flex: 1,
						}}>
						<View
							style={{
								flexDirection: 'row',
								width: '100%',
								justifyContent: 'space-between',
							}}>
							{Object.entries(BestTrickType).map(([key, value]) => (
								<Tag
									key={key}
									tag={`${value}`}
									theme={theme}
									style={{
										backgroundColor: spots.some((obj) => obj.spot === value)
											? Colors[theme].bgPrimary
											: 'transparent',
									}}
									textStyle={{
										textAlign: 'center',
										fontSize: 18,
									}}
									handleTagPress={() => handleSpotPress(value as TrickSpot)}
								/>
							))}
						</View>

						<PostTypeButton
							val={spots.length > 1 ? 'Add Spots!' : 'Add Spot!'}
							click_action={async () => await handleCreateTrick()}
							style={{ width: '100%' }}
						/>
					</View>
				)}
			</>
		);
	},
);

const TrickDetails = React.memo(
	({ theme, trickCreated, spots, value, user }: TrickDetailsProps) => {
		return (
			<View style={{ gap: 18 }}>
				<View>
					<View style={{ width: '100%' }}>
						{/* table header */}
						{!trickCreated ? (
							<TableHeader theme={theme} isDisabled={false} />
						) : (
							<TableHeader theme={theme} isDisabled={true} />
						)}
					</View>

					<View
						style={{
							backgroundColor: Colors[theme].container_surface,
							padding: 8,
							gap: 12,
							borderRadius: 8,
						}}>
						{spots.map((spotData, index) => (
							<SpotRow
								addSpot={false}
								spotData={spotData}
								key={index}
								index={index}
								theme={theme}
							/>
						))}
						{spots.length < 3 && (
							<SpotRow
								addSpot
								spotData={{ spot: 'Flat', landing_date: new Date() }}
								key={4}
								index={4}
								theme={theme}
							/>
						)}
					</View>
				</View>

				{/* trick card */}
				<TrickPreviewCard
					theme={theme}
					trickName={value}
					userId={user?.id}
					spots={spots}
				/>
			</View>
		);
	},
);

const styles = StyleSheet.create({
	innerRowContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
});

export default TrickBuilder;
