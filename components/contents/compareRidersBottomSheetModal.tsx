import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useUser } from '@clerk/clerk-expo';
import { CrahUser, CrahUserDetailedStats } from '@/types';
import useCrahUser from '@/hooks/useCrahUser';
import SearchBar from '../general/SearchBar';
import { useSharedValue } from 'react-native-reanimated';
import NoDataPlaceholder from '../general/NoDataPlaceholder';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import AllUserRowContainer from '../displayFetchedData/AllUserRowContainer';
import Row from '../general/Row';
import ClerkUser from '@/types/clerk';

interface BottomSheetModalProps {
	theme: 'light' | 'dark';
	displaySelfInSuggestions: boolean;
	allUsers?: CrahUserDetailedStats[] | null;
	rider: CrahUserDetailedStats | null;
	handleUserPress: (userId: string | undefined) => void;
	selected_riderId: string | undefined;
	user: CrahUser | null;
}

const BottomSheetModalComponent = forwardRef<
	BottomSheetModal,
	BottomSheetModalProps
>(
	(
		{
			theme,
			displaySelfInSuggestions,
			allUsers,
			rider,
			selected_riderId,
			user,
		},
		ref,
	) => {
		const snapPoints = useMemo(() => ['75%'], []);

		const [searchQuery, setSearchQuery] = useState<string>('');
		const [searchResultLoaded, setSearchResultLoaded] =
			useState<boolean>(false);

		const [searchResult, setSearchResult] = useState<CrahUserDetailedStats[]>(
			[],
		);
		const [errorWhileLoading, setErrorWhileLoading] = useState<boolean>(false);

		const renderBackdrop = useCallback((props: any) => {
			const animatedIndex = useSharedValue(0);
			const animatedPosition = useSharedValue(1);

			return (
				<BottomSheetBackdrop
					animatedIndex={animatedIndex}
					animatedPosition={animatedPosition}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
				/>
			);
		}, []);

		const handleRiderRowPress = (userId: string | undefined) => {
			if (!userId) return;
		};

		return (
			<BottomSheetModal
				index={1}
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background2,
				}}
				ref={ref}>
				<BottomSheetView
					style={{
						flex: 1,
						paddingHorizontal: 12,
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
							placeholder="Search a rider"
							query={searchQuery}
							setQuery={setSearchQuery}
							displayLeftSearchIcon
							containerStyle={{
								backgroundColor: Colors[theme].background,
								marginTop: 12,
							}}
							textInputStyle={{
								backgroundColor: Colors[theme].background,
							}}
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
								{/* display current-user as You */}
								<Row
									onPress={() => handleRiderRowPress(user?.id)}
									showAvatar={true}
									avatarUrl={user?.imageUrl}
									title={'You'}
									subtitle={`${user?.rank}`}
									containerStyle={{
										backgroundColor: Colors[theme].surface,
										paddingHorizontal: -12,
									}}
								/>
							</View>
						</View>
					)}

					{/* display searched riders here */}
					<View style={{ marginTop: 6, gap: 8 }}>
						<ThemedText
							style={[defaultStyles.biggerText]}
							value={
								searchQuery ? `Results for "${searchQuery}"` : 'Suggestions'
							}
							theme={theme}
						/>
					</View>

					<View style={{ flex: 1 }}>
						{/* display search result data */}

						{searchQuery ? (
							searchResultLoaded ? (
								errorWhileLoading ? (
									<NoDataPlaceholder
										firstTextValue="no users found"
										displayRetryBtn={false}
									/>
								) : (
									<View>{/* Here are the search results */}</View>
								)
							) : (
								<CrahActivityIndicator
									color={Colors[theme].primary}
									size={24}
								/>
							)
						) : (
							<View
								style={{
									flex: 1,
								}}>
								<AllUserRowContainer
									user={user}
									displayRetryBtn={false}
									excludeIds={[]}
									contentTitle=""
									bottomSheet={true}
									rowStyle={{
										backgroundColor: Colors[theme].background2,
										paddingHorizontal: 0,
									}}
									contentContainerStyle={{
										marginTop: 12,
										backgroundColor: Colors[theme].background2,
									}}
								/>
							</View>
						)}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

export default BottomSheetModalComponent;
