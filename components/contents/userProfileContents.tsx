import {
	View,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ScrollView,
	Dimensions,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import ThemedText from '@/components/general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import UserPostGridItem from '@/components/UserPostGridItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	BestTrickType,
	dropDownMenuInputData,
	GeneralPostTypesIonicons,
	UserGalleryTopics,
} from '@/types';

// dummy data
import UserImageCircle from '@/components/general/UserImageCircle';
import { defaultStyles } from '@/constants/Styles';
import DropDownMenu from '@/components/general/DropDownMenu';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import ClerkUser from '@/types/clerk';

import tricks from '@/JSON/tricks.json';
import { getCachedData } from '@/hooks/cache';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

interface UserProfileProps {
	userId: string;
	self: boolean | 'true' | 'false';
}

interface UserPostContainerProps {
	activePostFilterIcon: GeneralPostTypesIonicons;
	setActivePostFilterIcon: React.Dispatch<
		React.SetStateAction<GeneralPostTypesIonicons>
	>;
	setPostsCount: (n: number) => void;
	theme: 'light' | 'dark';
	containerBorder: number;
	containerBackground: string;
	bottom: number;
	userId: string;
}

const CACHE_KEY = 'userPosts';

const UserPostContainer: React.FC<UserPostContainerProps> = ({
	activePostFilterIcon,
	setActivePostFilterIcon,
	theme,
	containerBorder,
	containerBackground,
	bottom,
	userId,
	setPostsCount,
}) => {
	const [postsLoaded, setPostsLoaded] = useState<boolean>();
	const [errFetchingPosts, setErrFetchingPosts] = useState<boolean>();
	const [posts, setPosts] = useState<any>();

	const fetchPosts = async () => {
		setErrFetchingPosts(false);
		setPostsLoaded(false);

		const cached = await getCachedData<any[]>(CACHE_KEY);

		if (cached) {
			setPosts(cached);
			setPostsLoaded(true);
			console.log(`loaded posts from user ${userId} from cache`);
			return;
		}

		console.log(`fetch user posts from id ${userId}`);

		fetch(`http://192.168.0.136:4000/api/posts/user/${userId}`, {
			headers: { 'Cache-Control': 'no-cache' },
		})
			.then((res) => res.json())
			.then((res) => {
				setPosts(res);
				setPostsCount(res.length);
				// await setCachedData(CACHE_KEY, res.commonTricks); // data gets cached
			})
			.catch((err) => setErrFetchingPosts(true))
			.finally(() => setPostsLoaded(true));
	};

	useEffect(() => {
		fetchPosts();
		return () => {};
	}, []);

	return (
		<View
			style={[
				defaultStyles.surface_container,
				{
					borderTopWidth: containerBorder,
					borderTopColor: Colors[theme].gray,
					backgroundColor: containerBackground,
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
					{!postsLoaded ? (
						// loading...
						<CrahActivityIndicator color={Colors[theme].primary} size={24} />
					) : errFetchingPosts ? (
						// error while loading
						<NoDataPlaceholder
							firstTextValue="Something went wrong..."
							subTextValue=""
							arrowStyle={{ display: 'none' }}
							containerStyle={{ paddingTop: 40 }}
						/>
					) : posts && posts.length > 0 ? (
						// successfully loaded posts
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
						// no posts
						<NoDataPlaceholder
							firstTextValue="No posts here..."
							subTextValue=""
							arrowStyle={{ display: 'none' }}
							containerStyle={{ paddingTop: 40 }}
						/>
					)}
				</View>
			</View>
		</View>
	);
};

const UserProfile: React.FC<UserProfileProps> = ({ userId, self }) => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { bottom } = useSafeAreaInsets();

	const [activePostFilterIcon, setActivePostFilterIcon] =
		useState<GeneralPostTypesIonicons>(GeneralPostTypesIonicons.all);

	const handleBestTricksType = (type: { key: number; text: BestTrickType }) => {
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
	const [postsCount, setPostsCount] = useState<number | undefined>();
	const [riderType, setRiderType] = useState<string>('Flat Rider');
	const [bestTrick, setBestTrick] = useState<string>('Buttercup Flat');
	const [userName, SetUserName] = useState<string>(
		user?.username ?? 'no user name',
	);

	const [loadingUser, setLoadingUser] = useState<boolean>(true);
	const [errLoadingUser, setErrLoadingUser] = useState<{
		state: boolean;
		message: string;
	}>({
		state: false,
		message: '200',
	});

	useEffect(() => {
		console.log(errLoadingUser, 'user ID:', userId);

		return () => {};
	}, [errLoadingUser]);

	useEffect(() => {
		if (!userId) {
			setErrLoadingUser({ state: true, message: 'Error parsing the userId' });
			return () => {};
		}

		const controller = new AbortController();

		fetch(`http://192.168.0.136:4000/api/users/${userId}`, {
			signal: controller.signal,
		})
			.then((res) => res.json())
			.then((res: ClerkUser) => SetUserName(res.username))
			.catch((err) => {
				if (err.name !== 'AbortError') {
					setErrLoadingUser({
						state: true,
						message: 'Error fetching user data',
					});
					console.warn(`Error loading user ${userId}`, err);
				}
			})
			.finally(() => setLoadingUser(false));

		return () => controller.abort();
	}, [userId]);

	const handleCompareYourself = () => {
		router.push({
			pathname: '/modals/compareRiders',
			params: {
				rider1Id: userId,
				rider2Id: user?.id,
			},
		});
	};

	const handleViewYourStats = () => {
		router.push({
			pathname: '/(auth)/(tabs)/statsPages',
			params: {
				pageType: UserGalleryTopics.USER_RANK,
			},
		});
	};

	const goBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace('/(auth)/(tabs)/profilePages');
		}
	};

	const windowHeight = useMemo(() => Dimensions.get('window').height, []);
	const containerBackground = Colors[theme].background;
	const containerBorder = 1;

	const HeaderContainer = () => {
		return (
			<View
				style={[
					styles.header,
					defaultStyles.surface_container,
					{
						borderTopWidth:
							self === 'true' || self === true ? 0 : containerBorder,
						borderTopColor: Colors[theme].gray,
						backgroundColor: containerBackground,
						flexDirection: 'row',
						gap: 12,
					},
				]}>
				{self === 'true' || self === true ? (
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
							value={userName}
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
							justifyContent: 'flex-start',
							flexDirection: 'row',
							gap: 4,
						}}>
						{/* user post amount */}
						{postsCount ? (
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
						) : (
							<CrahActivityIndicator color={Colors[theme].primary} size={14} />
						)}
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
						borderTopWidth: containerBorder,
						borderTopColor: Colors[theme].gray,
						backgroundColor: containerBackground,
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
						backgroundColor: containerBackground,
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

					{!self || self === 'false' ? (
						<TouchableOpacity onPress={handleCompareYourself}>
							<ThemedText
								theme={theme}
								value={'compare yourself'}
								style={[
									styles.UserDataText,
									{ color: Colors[theme].primary, fontSize: 15, top: -2 },
								]}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={handleViewYourStats}>
							<ThemedText
								theme={theme}
								value={'view stats'}
								style={[
									styles.UserDataText,
									{ color: Colors[theme].primary, fontSize: 15, top: -2 },
								]}
							/>
						</TouchableOpacity>
					)}
				</View>

				{BestTricksToType[currentSelectedBestTrickType].length > 0 ? (
					<FlatList
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
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

	return (
		<ThemedView theme={theme} flex={1}>
			<ScrollView
				contentContainerStyle={{}}
				showsVerticalScrollIndicator={true}
				scrollEnabled={true}>
				{errLoadingUser.state ? (
					<NoDataPlaceholder
						containerStyle={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							height: windowHeight * 0.75,
						}}
						arrowStyle={{ display: 'none' }}
						subTextValue="Something went wrong"
						firstTextValue="Sorry :/"
					/>
				) : loadingUser ? (
					<CrahActivityIndicator
						style={{
							top: windowHeight * 0.35,
						}}
						size={32}
						color={Colors[theme].primary}
					/>
				) : (
					<View
						style={[
							styles.scrollViewContainer,
							{ backgroundColor: Colors[theme].background },
						]}>
						{(self === 'false' || self === false) && (
							<View
								style={{
									flex: 1,
									justifyContent: 'flex-start',
									alignItems: 'flex-start',
									width: '100%',
								}}>
								<TouchableOpacity onPress={goBack}>
									<Ionicons
										name="chevron-back"
										size={24}
										color={Colors[theme].textPrimary}
									/>
								</TouchableOpacity>
							</View>
						)}

						<HeaderContainer />
						<UserProfileContainer />
						<BestTricksContainer />
						<UserPostContainer
							activePostFilterIcon={activePostFilterIcon}
							setActivePostFilterIcon={setActivePostFilterIcon}
							theme={theme}
							containerBorder={containerBorder}
							containerBackground={containerBackground}
							bottom={bottom}
							userId={userId}
							setPostsCount={setPostsCount}
						/>
					</View>
				)}
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

export default UserProfile;
