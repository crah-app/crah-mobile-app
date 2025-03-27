import {
	View,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ScrollView,
	SafeAreaView,
	Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import ThemedText from '@/components/general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import UserPostGridItem from '@/components/UserPostGridItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
	BestTrickType,
	dropDownMenuInputData,
	GeneralPostTypes,
	GeneralPostTypesIonicons,
	PostTypeIonicons,
} from '@/types';

// dummy data
import tricks from '@/JSON/tricks.json';
import posts from '../../../JSON/posts.json';
import UserImageCircle from '@/components/general/UserImageCircle';
import { defaultStyles } from '@/constants/Styles';
import DropDownMenu from '@/components/general/DropDownMenu';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

const Page = () => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom } = useSafeAreaInsets();
	const windowWidth = Dimensions.get('window').width;

	const self = false;

	const [activePostFilterIcon, setActivePostFilterIcon] =
		useState<GeneralPostTypesIonicons>(GeneralPostTypesIonicons.all);

	const handleBestTricksType = (type: { key: number; text: BestTrickType }) => {
		console.log(type, 'sdfjoig');
		setCurrentSelectedBestTrickType(type.text);
	};

	// dropdownmenu categories for best tricks
	const BestTricks: Array<dropDownMenuInputData> = [
		{ key: 0, text: BestTrickType.PARK },
		{ key: 1, text: BestTrickType.FLAT },
		{ key: 2, text: BestTrickType.STREET },
	];

	// best tricks states
	const [bestParkTricks, setBestParkTricks] = useState<trickInterface[]>(
		tricks[0].Park,
	);
	const [bestFlatTricks, setBestFlatTricks] = useState<trickInterface[]>(
		tricks[0].Flat,
	);
	const [bestStreetTricks, setBestStreetTricks] = useState<trickInterface[]>(
		tricks[0].Street,
	);

	const [currentSelectedBestTrickType, setCurrentSelectedBestTrickType] =
		useState<BestTrickType>(BestTrickType.PARK);

	const BestTricksToType = {
		[BestTrickType.PARK]: bestParkTricks,
		[BestTrickType.FLAT]: bestFlatTricks,
		[BestTrickType.STREET]: bestStreetTricks,
	};

	// States for user data
	const [fans, setFans] = useState<number>(81000);
	const [friends, setFriends] = useState<number>(287);
	const [level, setLevel] = useState<number>(23);
	const [rank, setRank] = useState<number>(257);
	const [postsCount, setPostsCount] = useState<number>(50);
	const [riderType, setRiderType] = useState<string>('Flat Rider');
	const [bestTrick, setBestTrick] = useState<string>('Buttercup Flat');

	const HeaderContainer = () => {
		return (
			<View
				style={[
					styles.header,
					defaultStyles.surface_container,
					{
						backgroundColor: Colors[theme].container_surface,
						flexDirection: 'row',
						gap: 12,
					},
				]}>
				{self ? (
					<View
						style={{
							position: 'absolute',
							width: Dimensions.get('window').width - 24,
							padding: 12,
							alignItems: 'flex-end',
							gap: 8,
						}}>
						<Link asChild href={{ pathname: '/profilePages/inbox' }}>
							<TouchableOpacity style={{}}>
								<Ionicons
									size={24}
									color={Colors[theme].textPrimary}
									name="mail-outline"
								/>
							</TouchableOpacity>
						</Link>

						<Link href="/profilePages/settings" asChild>
							<TouchableOpacity style={{}}>
								<Ionicons
									size={24}
									color={Colors[theme].textPrimary}
									name="settings-outline"
								/>
							</TouchableOpacity>
						</Link>
					</View>
				) : (
					<View
						style={{
							position: 'absolute',
							width: Dimensions.get('window').width - 24,
							padding: 12,
							alignItems: 'flex-end',
							gap: 8,
						}}>
						<Link asChild href={{ pathname: '/profilePages/inbox' }}>
							<TouchableOpacity style={{}}>
								<Ionicons
									size={24}
									color={Colors[theme].textPrimary}
									name="person-add-outline"
								/>
							</TouchableOpacity>
						</Link>

						<Link href="/profilePages/settings" asChild>
							<TouchableOpacity style={{}}>
								<Ionicons
									size={24}
									color={Colors[theme].textPrimary}
									name="chatbubbles-outline"
								/>
							</TouchableOpacity>
						</Link>

						<TouchableOpacity style={{}}>
							<Ionicons
								size={24}
								color={Colors[theme].textPrimary}
								name="ellipsis-horizontal-circle-outline"
							/>
						</TouchableOpacity>
					</View>
				)}

				{/* Left container */}
				<View style={{ height: '100%' }}>
					<UserImageCircle
						width={88}
						height={88}
						imageUri={JSON.stringify(user?.imageUrl)}
					/>
				</View>

				{/* Right container */}
				<View
					style={{
						flexDirection: 'column',
					}}>
					<View
						style={{
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
						}}>
						<ThemedText
							theme={theme}
							value={user?.username! == '' ? user?.fullName! : user?.username!}
							style={[styles.UserName]}
						/>
					</View>

					<View
						style={{
							alignItems: 'center',
							flexDirection: 'row',
							gap: 4,
						}}>
						{/* user rank */}
						<ThemedText
							theme={theme}
							value="Rank"
							style={[
								styles.UserDataText,
								{
									color: 'red',
								},
							]}
						/>
						<ThemedText
							theme={theme}
							value={`#${rank}`}
							style={styles.UserDataText}
						/>

						{/* space */}
						<ThemedText
							theme={theme}
							value={'·'}
							style={{ fontWeight: 900, fontSize: 22, paddingHorizontal: 2 }}
						/>

						{/* user level */}
						<ThemedText
							theme={theme}
							value="Level"
							style={[
								styles.UserDataText,
								{
									color: 'red',
								},
							]}
						/>
						<ThemedText
							theme={theme}
							value={level.toString()}
							style={styles.UserDataText}
						/>
					</View>

					<View
						style={{
							alignItems: 'center',
							flexDirection: 'row',
							gap: 4,
						}}>
						{/* user post amount */}
						<ThemedText
							theme={theme}
							value={postsCount.toString()}
							style={[
								styles.UserDataText,
								{
									color: 'red',
								},
							]}
						/>
						<ThemedText
							theme={theme}
							value="Posts"
							style={styles.UserDataText}
						/>
					</View>
				</View>
			</View>
		);
	};

	const UserProfileContainer = () => {
		return (
			<View
				style={[
					defaultStyles.surface_container,
					{
						backgroundColor: Colors[theme].container_surface,
						width: Dimensions.get('window').width - 24,
					},
				]}>
				{/* user fans (followers) and friends (user follows back) count */}
				<View
					style={{
						flexDirection: 'row',
						gap: 4,
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}>
					{/* fans */}
					<ThemedText
						theme={theme}
						value="Fans"
						style={[
							styles.UserDataText,
							{
								color: 'red',
							},
						]}
					/>
					<ThemedText
						theme={theme}
						value={fans.toLocaleString()}
						style={styles.UserDataText}
					/>

					{/* space */}
					<ThemedText
						theme={theme}
						value={'·'}
						style={{ fontWeight: 900, fontSize: 22, paddingHorizontal: 2 }}
					/>

					{/* friends */}
					<ThemedText
						theme={theme}
						value="Friends"
						style={[
							styles.UserDataText,
							{
								color: 'red',
							},
						]}
					/>
					<ThemedText
						theme={theme}
						value={friends.toString()}
						style={styles.UserDataText}
					/>
				</View>

				{/* User Description */}
				<View style={{ marginBottom: 12 }}>
					<ThemedText
						theme={theme}
						value={
							'I am a 27 years old flat rider, living in Bjearnum, Sweden. Never stop fighting. Take what is yours.'
						}
					/>
				</View>

				{/* best trick */}
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<ThemedText
						theme={theme}
						value="Best Trick"
						style={[{ color: 'red' }]}
					/>
					<ThemedText theme={theme} value={bestTrick} />
				</View>

				{/* type of rider */}
				<View style={{ flexDirection: 'row', gap: 8 }}>
					<ThemedText
						theme={theme}
						value="Rider Type"
						style={[{ color: 'red' }]}
					/>
					<ThemedText theme={theme} value={riderType} />
				</View>
			</View>
		);
	};

	const BestTricksContainer = () => {
		return (
			<View
				style={[
					defaultStyles.surface_container,
					{
						backgroundColor: Colors[theme].container_surface,
						width: Dimensions.get('window').width - 24,
					},
				]}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<ThemedText
							theme={theme}
							value={`Top 5 Best ${currentSelectedBestTrickType} Tricks`}
							style={[styles.UserDataText]}
						/>

						<DropDownMenu
							items={BestTricks}
							onSelect={(numb, val) => handleBestTricksType(val)}
							triggerComponent={
								<TouchableOpacity>
									<Ionicons
										color={Colors[theme].textPrimary}
										size={16}
										name="chevron-expand-outline"
									/>
								</TouchableOpacity>
							}
						/>
					</View>

					<TouchableOpacity>
						<ThemedText
							theme={theme}
							value={'compare yourself'}
							style={[
								styles.UserDataText,
								{ color: Colors[theme].primary, fontSize: 15, top: -2 },
							]}
						/>
					</TouchableOpacity>
				</View>

				{BestTricksToType[currentSelectedBestTrickType].length > 0 ? (
					<FlatList
						scrollEnabled={false}
						data={BestTricksToType[currentSelectedBestTrickType]}
						keyExtractor={(item) => item.id}
						renderItem={({ item, index }) => (
							<ThemedText
								key={index}
								theme={theme}
								value={
									item.name.length > 22
										? item.name.substring(0, 20) + '...'
										: item.name
								}
								style={{
									backgroundColor: 'rgba(255, 0, 0, 0.33)',
									padding: 10,
									// borderRadius: 8,
								}}
							/>
						)}
						contentContainerStyle={[styles.bestTricksContainer, {}]}
					/>
				) : (
					<ThemedText
						theme={theme}
						value={'No Data available'}
						style={{
							paddingTop: 10,
							fontWeight: 'bold',
							color: 'gray',
						}}
					/>
				)}
			</View>
		);
	};

	const UserPostContainer = () => {
		return (
			<View
				style={[
					defaultStyles.surface_container,
					{
						backgroundColor: Colors[theme].container_surface,
						width: Dimensions.get('window').width - 24,
					},
				]}>
				<View
					style={[
						styles.UserPostFilterContainer,
						{
							borderColor: Colors[theme].background,
						},
					]}>
					{Object.values(GeneralPostTypesIonicons).map((icon, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => setActivePostFilterIcon(icon)}>
							<Ionicons
								name={icon}
								size={activePostFilterIcon == icon ? 25 : 25}
								color={
									activePostFilterIcon == icon
										? Colors['default'].primary
										: Colors[theme].textPrimary
								}
							/>
						</TouchableOpacity>
					))}
				</View>

				<View>
					<View style={{ bottom }}>
						{posts.length > 0 ? (
							<FlatList
								scrollEnabled={false}
								data={posts}
								keyExtractor={(item) => item.id}
								numColumns={3}
								renderItem={({ item, index }) => (
									<UserPostGridItem
										key={index}
										post={item}
										style={[
											styles.GridItem,
											{ borderColor: Colors[theme].container_surface },
										]}
									/>
								)}
							/>
						) : (
							<View style={{ width: '100%', height: 200 }}>
								<NoDataPlaceholder
									subTextValue=""
									firstTextValue="No posts here..."
									arrowStyle={{ display: 'none' }}
									containerStyle={{ paddingTop: 40 }}
								/>
							</View>
						)}
					</View>
				</View>
			</View>
		);
	};

	return (
		<ThemedView theme={theme} flex={1}>
			<ScrollView
				contentContainerStyle={{}}
				showsVerticalScrollIndicator={true}
				scrollEnabled={true}>
				<View
					style={[
						styles.scrollViewContainer,
						{ backgroundColor: Colors[theme].background },
					]}>
					<HeaderContainer />
					<UserProfileContainer />
					<BestTricksContainer />
					<UserPostContainer />
				</View>
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	scrollViewContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 12,
		gap: 12,
		height: 'auto',
		width: Dimensions.get('window').width,
	},
	bestTricksContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		top: 10,
		gap: 10,
		paddingBottom: 10,
		justifyContent: 'flex-start',
	},
	header: {
		width: Dimensions.get('window').width - 24,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		padding: 0,
	},
	UserName: {
		fontSize: 28,
		fontWeight: '700',
		textAlign: 'center',
	},
	UserProfile: {
		borderWidth: 2,
		borderColor: 'red',
	},
	UserDataText: {
		fontSize: 16,
		fontWeight: '600',
	},
	UserPostFilterContainer: {
		justifyContent: 'space-evenly',
		zIndex: 10,
		flexDirection: 'row',
		borderBottomWidth: 2,
		paddingBottom: 10,
	},
	GridItem: {
		width: '33.33%',
		aspectRatio: 1,
		borderWidth: StyleSheet.hairlineWidth,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Page;
