import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	StyleSheet,
	ActivityIndicator,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	TextInput,
	FlatList,
} from 'react-native';
import ThemedView from '../general/ThemedView';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ClerkUser from '@/types/clerk';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import { BottomSheetModalRef } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types';
import { useUser } from '@clerk/clerk-expo';
import SearchBar from '../general/SearchBar';
import Row from '../general/Row';
import NoDataPlaceholder from '../general/NoDataPlaceholder';
import AllUserRowContainer from '../displayFetchedData/AllUserRowContainer';
import { useSharedValue } from 'react-native-reanimated';
import { fetchAdresses } from '@/types';

interface CompareRidersContentsProps {
	rider1Id: string;
	rider2Id: string;
}

const CompareRidersContents: React.FC<CompareRidersContentsProps> = ({
	rider1Id,
	rider2Id,
}) => {
	const theme = useSystemTheme();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [rider1, setRider1] = useState<ClerkUser | null>(null);
	const [rider2, setRider2] = useState<ClerkUser | null>(null);

	const fetchRiderData = async (riderId: string, setRider: Function) => {
		try {
			const response = await fetch(
				`http://192.168.0.136:4000/api/users/${riderId}`,
			);
			const data = await response.json();
			setRider(data);
		} catch (err) {
			console.error(`Fehler beim Laden der Daten für Rider ${riderId}`, err);
			setError(true);
		}
	};

	useEffect(() => {
		if (!rider1Id || !rider2Id) {
			setError(true);
			return;
		}

		setLoading(true);
		Promise.all([
			fetchRiderData(rider1Id, setRider1),
			fetchRiderData(rider2Id, setRider2),
		]).finally(() => setLoading(false));
	}, [rider1Id, rider2Id]);

	if (error) {
		return (
			<ThemedView style={styles.errorContainer} theme={theme}>
				<ThemedText
					value="Something went wrong"
					theme={theme}
					style={styles.errorText}
				/>
			</ThemedView>
		);
	}

	if (loading) {
		return (
			<ThemedView style={styles.loader} theme={theme}>
				<CrahActivityIndicator size="large" color={Colors[theme].textPrimary} />
			</ThemedView>
		);
	}

	// Berechnung der Gewinner
	const parkWinner = rider1?.username;
	// rider1.parkPoints > rider2.parkPoints ? rider1.username : rider2.username;
	const flatWinner = rider2?.username;
	// rider1.flatPoints > rider2.flatPoints ? rider1.username : rider2.username;

	return (
		<ThemedView
			style={[styles.container, { width: Dimensions.get('window').width }]}
			theme={theme}>
			{/* Header */}
			<ThemedView style={styles.header} theme={theme}>
				<ThemedText
					value="Compare"
					theme={theme}
					style={[defaultStyles.biggerText, styles.headerTitle]}
				/>
				<ThemedText
					value="yourself and other"
					theme={theme}
					style={[defaultStyles.biggerText, styles.headerTitle]}
				/>
				<ThemedText
					value="riders"
					theme={theme}
					style={[
						defaultStyles.biggerText,
						styles.headerTitle,
						{ color: Colors[theme].primary },
					]}
				/>
			</ThemedView>

			{/* comparsion cool box */}
			<ThemedView
				style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					flexDirection: 'column',
					gap: 0,
				}}
				theme={theme}>
				<View
					style={[
						styles.comparisonContainer,
						{
							width: Dimensions.get('window').width,
							// backgroundColor: Colors[theme].primary,
						},
					]}>
					{/* Rider 1 */}
					<RiderCard theme={theme} rider={rider1!} />

					<ThemedText value="VS" theme={theme} style={styles.vsText} />

					{/* Rider 2 */}
					<RiderCard theme={theme} rider={rider2!} />
				</View>
				{/* <View style={[{ flex: 1 }]}> */}
				<ThemedText
					theme={theme}
					value={'Result'}
					style={[defaultStyles.biggerText]}
				/>
				{/* </View> */}
			</ThemedView>
		</ThemedView>
	);
};

let selfIsSelected: boolean = false;
let g_riderId: string = '';

const RiderCard: React.FC<{ rider: ClerkUser; theme: 'light' | 'dark' }> = ({
	rider,
	theme,
}) => {
	const { user } = useUser();

	const username = user?.id === rider.id ? 'You' : rider.username;

	useEffect(() => {
		if (user?.id === rider.id && !selfIsSelected) {
			selfIsSelected = true; // make to false in development if you want to
		} else if (!selfIsSelected) {
			selfIsSelected = false;
		}

		g_riderId = rider.id;

		return () => {};
	}, []);

	// if user didn´t already selected himself he shouldn`t be displayed in the search suggestions
	const [displaySelfInSuggestions, setDisplaySelfInSuggestions] =
		useState<boolean>(true);

	const handleSearchUserBottomSheet = () => {
		if (selfIsSelected) {
			setDisplaySelfInSuggestions(false);
		}

		handlePresentModalPress();
		fetchUsers();
	};

	const ref = useRef<BottomSheetModal>();

	const handlePresentModalPress = useCallback(() => {
		ref?.current?.present();
	}, []);

	const [allUsers, setAllUsers] = useState<ClerkUser[]>([]);
	const [usersLoaded, setUsersLoaded] = useState<boolean>(false);

	const fetchUsers = () => {
		setUsersLoaded(false);

		fetch(fetchAdresses.allUsers, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setAllUsers(res);
			})
			.catch((err) =>
				console.warn('An error loading all users occurred: ', err),
			)
			.finally(() => setUsersLoaded(true));
	};

	return (
		<ThemedView
			style={[
				styles.riderCard,
				{
					flex: 1,
				},
			]}
			theme={theme}>
			<BottomSheetModalComponent
				displaySelfInSuggestions={displaySelfInSuggestions}
				ref={ref}
				theme={theme}
				allUsers={allUsers}
				rider={rider}
			/>

			<View
				style={{
					padding: 8,
					borderBottomColor: Colors[theme].textPrimary,
					borderBottomWidth: 1,
				}}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
					<Image
						source={{ uri: rider?.imageUrl }}
						width={62}
						height={62}
						style={[defaultStyles.outlinedBtn, styles.avatar]}
					/>

					<TouchableOpacity
						style={{ position: 'absolute', right: -25 }}
						onPress={handleSearchUserBottomSheet}>
						<Ionicons
							size={20}
							color={Colors[theme].textPrimary}
							name="chevron-expand-outline"
						/>
					</TouchableOpacity>
				</View>
			</View>
			<ThemedText
				value={username || 'no name'}
				theme={theme}
				style={[styles.riderName, { paddingTop: 8 }]}
			/>
			<ThemedText
				value={`Flat: ${254} points`}
				theme={theme}
				style={styles.riderStats}
			/>
			<ThemedText
				value={`Park: ${444} points`}
				theme={theme}
				style={styles.riderStats}
			/>

			<View style={{ height: 320, top: 30 }}>
				<ThemedText
					value={`Top 5 best Tricks`}
					theme={theme}
					style={[{ fontSize: 18, fontWeight: 500 }]}
				/>

				<View style={{ width: '100%', top: 10, gap: 4 }}>
					<TrickTextContainer
						name={'Whip whip umbrella'}
						points={255}
						id={'12'}
						theme={theme}
					/>
					<TrickTextContainer
						name={'Buttercup'}
						points={255}
						id={'12'}
						theme={theme}
					/>
					<TrickTextContainer
						name={'Quad whip'}
						points={255}
						id={'12'}
						theme={theme}
					/>
					<TrickTextContainer
						name={'Fingerblast twist'}
						points={255}
						id={'12'}
						theme={theme}
					/>
				</View>
			</View>
		</ThemedView>
	);
};

interface BottomSheetModalProps {
	theme: 'light' | 'dark';
	displaySelfInSuggestions: boolean;
	allUsers?: ClerkUser[];
	rider: ClerkUser;
}

const BottomSheetModalComponent = forwardRef<
	BottomSheetModal,
	BottomSheetModalProps
>((props, ref) => {
	const snapPoints = useMemo(() => ['60%', '90%'], []);
	const { user } = useUser();

	const { theme, displaySelfInSuggestions, allUsers, rider } = props;

	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchResultLoaded, setSearchResultLoaded] = useState<boolean>(false);
	const [searchResult, setSearchResult] = useState<ClerkUser[]>([]);
	const [errorWhileLoading, setErrorWhileLoading] = useState<boolean>(false);

	const handleCloseModalPress = useCallback(() => {
		ref?.current?.close();
	}, []);

	// const renderBackdrop = useCallback((props: any) => {
	// 	const animatedIndex = useSharedValue(0);
	// 	const animatedPosition = useSharedValue(1);

	// 	return (
	// 		<BottomSheetBackdrop
	// 			animatedIndex={animatedIndex}
	// 			animatedPosition={animatedPosition}
	// 			disappearsOnIndex={-1}
	// 			appearsOnIndex={0}
	// 		/>
	// 	);
	// }, []);

	const handleRiderRowPress = (userId: string | undefined) => {
		if (!userId) return;
	};

	const handleUserPress = (userId: string | undefined) => {
		if (!userId) return;
		handleCloseModalPress();
	};

	return (
		<BottomSheetModal
			index={0}
			// backgroundComponent={renderBackdrop}
			handleIndicatorStyle={{ backgroundColor: 'gray' }}
			backgroundStyle={{ backgroundColor: Colors[theme].surface }}
			containerStyle={{}}
			snapPoints={snapPoints}
			ref={ref}
			onDismiss={handleCloseModalPress}>
			<BottomSheetView
				style={{
					flex: 1,
					padding: 12,
				}}>
				<View
					style={{
						width: '100%',
						gap: 12,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<ThemedText
						style={[defaultStyles.biggerText]}
						value="Select new rider"
						theme={theme}
					/>
					<SearchBar
						placeholder="Type in a username..."
						query={searchQuery}
						setQuery={setSearchQuery}
					/>
				</View>

				{displaySelfInSuggestions && (
					<View style={{ paddingHorizontal: 0, gap: 8 }}>
						<ThemedText
							style={[defaultStyles.biggerText]}
							value={'Yourself'}
							theme={theme}
						/>

						<View>
							{/* display user (you) */}
							<Row
								onPress={() => handleRiderRowPress(user?.id)}
								showAvatar={true}
								avatarUrl={user?.imageUrl}
								title={'You'}
								subtitle={'Rank Silver #51'}
								containerStyle={{
									backgroundColor: Colors[theme].surface,
									paddingHorizontal: -12,
								}}
							/>
						</View>
					</View>
				)}

				{/* display searched riders here */}
				<View style={{ paddingHorizontal: 0, gap: 8 }}>
					<ThemedText
						style={[defaultStyles.biggerText]}
						value={searchQuery ? `Results for "${searchQuery}"` : 'Suggestions'}
						theme={theme}
					/>
				</View>

				<View style={{ flex: 1 }}>
					{/* display search result data */}

					{searchQuery ? (
						searchResultLoaded ? (
							errorWhileLoading ? (
								<NoDataPlaceholder
									arrowStyle={{ display: 'none' }}
									subTextValue="Couldn't find any user :("
									firstTextValue=""
								/>
							) : (
								<View>{/* Hier kommen die Suchergebnisse */}</View>
							)
						) : (
							<CrahActivityIndicator color={Colors[theme].primary} size={24} />
						)
					) : (
						<View
							style={{
								flex: 1,
							}}>
							<AllUserRowContainer
								excludeIds={[g_riderId, user?.id]}
								contentTitle=""
								bottomSheet={true}
								rowStyle={{
									backgroundColor: Colors[theme].surface,
									paddingHorizontal: 0,
								}}
								contentContainerStyle={{
									backgroundColor: Colors[theme].surface,
								}}
							/>
						</View>
					)}
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
});

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
			}}>
			<ThemedText value={`${name}`} theme={theme} style={[styles.trickText]} />
			<ThemedText
				value={`${points}`}
				theme={theme}
				style={[{ color: 'gray' }]}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 36,
		fontWeight: 'bold',
	},
	comparisonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'flex-start',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	riderCard: {
		alignItems: 'center',
		width: '50%',
		paddingHorizontal: 12,
	},
	avatar: {
		borderRadius: 100,
		marginBottom: 10,
	},
	riderName: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	riderStats: {
		fontSize: 14,
		color: '#555',
	},
	vsText: {
		fontSize: 20,
		fontWeight: 'bold',
		top: 28,
	},
	resultsContainer: {
		marginTop: 20,
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	resultsText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#ff4444',
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: 18,
		color: 'red',
	},
	trickText: {
		fontSize: 16,
		fontWeight: 500,
		// backgroundColor: 'rgba(255, 0, 0, 0.23)',
	},
});

export default CompareRidersContents;
