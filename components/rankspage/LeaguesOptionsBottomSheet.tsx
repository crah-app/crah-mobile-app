import Colors from '@/constants/Colors';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import PostTypeButton from '../PostTypeButton';
import { Rank, RankColors, RankColorsDark } from '@/types';

interface props {
	theme: 'light' | 'dark';
	showGlobalLeaderboard: () => void;
	showSpecificRankLeaderboard: (rank: Rank) => void;
}

const LeaguesOptionsBottomSheet = forwardRef<BottomSheetModal, props>(
	({ theme, showGlobalLeaderboard, showSpecificRankLeaderboard }, ref) => {
		const snapPoints = useMemo(() => ['85%'], []);

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
				<BottomSheetView>
					<View
						style={{
							flexDirection: 'column',
							gap: 24,
							paddingHorizontal: 12,
						}}>
						<ThemedText
							value={'Options'}
							theme={theme}
							style={[defaultStyles.biggerText, { textAlign: 'center' }]}
						/>

						<View style={{ gap: 18 }}>
							<ThemedText
								value={'show'}
								theme={theme}
								style={{ color: Colors[theme].gray }}
							/>
							<PostTypeButton
								splitBackground
								splitBackgroundColors={[
									RankColorsDark['Gold'][0],
									RankColorsDark['Silver'][0],
									RankColorsDark['Bronze'][0],
									RankColorsDark['Platinum'][0],
									RankColorsDark['Diamond'][0],
									RankColorsDark['Legendary'][0],
								]}
								val="Global Leaderboard"
								style={{
									width: '100%',
									// backgroundColor: RankColorsDark['Gold'][1],
									borderColor: RankColors['Gold'][1],
								}}
								click_action={showGlobalLeaderboard}
							/>
						</View>

						<View style={{ gap: 18 }}>
							<ThemedText
								value={'rank leaderboards'}
								theme={theme}
								style={{ color: Colors[theme].gray }}
							/>

							{Object.values(Rank)
								.reverse()
								.map((rank) => {
									if (rank instanceof Function) return;

									return (
										<PostTypeButton
											key={rank}
											val={rank.toString()}
											style={{
												width: '100%',
												backgroundColor: RankColorsDark[rank][0],
												borderColor: RankColorsDark[rank][1],
											}}
											click_action={() => {
												showSpecificRankLeaderboard(Rank[rank as Rank]);
											}}
										/>
									);
								})}
						</View>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

const styles = StyleSheet.create({});

export default LeaguesOptionsBottomSheet;
