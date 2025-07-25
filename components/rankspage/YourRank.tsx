import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import GetSVG from '../GetSVG';
import { useSaveUserRegion } from '@/hooks/useSaveUserRegion';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
	CrahUserDetailedStats,
	Rank,
	RankOvertimeEntry,
	RankOvertimeInterval,
} from '@/types';
import NoDataPlaceholder from '../general/NoDataPlaceholder';
import CrahActivityIndicator from '../general/CrahActivityIndicator';

interface YourRankProps {
	theme: 'light' | 'dark';
}

const YourRank: React.FC<YourRankProps> = ({ theme }) => {
	const { user: clerkUser } = useUser();
	const { getToken } = useAuth();

	// const { status, error, region, country } = useSaveUserRegion(clerkUser?.id);
	const [user, setUser] = useState<CrahUserDetailedStats[] | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		// if (status !== 'success' || !country || !region) return;
		getUserRankData();
	}, []);

	async function getUserRankData() {
		setError(null);

		try {
			const token = await getToken();

			const response = await fetch(
				'http://192.168.0.136:4000/api/users/ranked/allStats',
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}

			const result = JSON.parse(text);

			setUser(result);
		} catch (error) {
			console.warn('Error [getUserRankData] component YourRank', error);
			setUser(null);
			setError(new Error(String(error)));
		}
	}

	return (
		<View style={[{}, styles.container]}>
			{/* display users rank */}
			<View
				style={[
					{
						height: 200,
						width: Dimensions.get('window').width,
					},
				]}>
				<GetSVG
					props={{ width: 600, height: 200 }}
					name="trianglify_red_background"
				/>
				<View
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
						zIndex: 1,
						position: 'absolute',
						height: 200,
						width: 600,
						marginTop: 0,
						borderBottomColor: Colors[theme].primary,
						borderBottomWidth: 2,
						borderTopColor: Colors[theme].primary,
						borderTopWidth: 1,
					}}></View>
			</View>

			<View
				style={{
					padding: 12,
					marginTop: 12,
					flex: 1,
				}}>
				<ThemedText
					style={[defaultStyles.bigText, { fontWeight: '600' }]}
					theme={theme}
					value="Rank Stats"
				/>

				{/* stats */}

				{!user ? (
					<View style={{ flex: 1 }}>
						{error ? (
							<NoDataPlaceholder
								firstTextValue="Something went wrong"
								retryFunction={getUserRankData}
								containerStyle={{
									bottom: 200,
								}}
							/>
						) : (
							<CrahActivityIndicator style={{ top: 150 }} />
						)}
					</View>
				) : (
					<View>
						{/* Rank Stats */}
						<View
							style={{
								marginTop: 20,
								flexDirection: 'row',
								width: '100%',
								alignItems: 'center',
								justifyContent: 'space-around',
								gap: 12,
							}}>
							{/* global stats */}
							<SingleStatsWrapper theme={theme} user={user[0]} />

							{/* regional stats */}
							<SingleStatsWrapper regional theme={theme} user={user[0]} />
						</View>

						{/* Rank Overtime */}
						<RankOvertimeContainer
							userId={clerkUser?.id}
							getToken={getToken}
							theme={theme}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

const SingleStatsWrapper: React.FC<{
	regional?: boolean;
	theme: 'light' | 'dark';
	user: CrahUserDetailedStats;
}> = ({ regional, theme, user }) => {
	if (regional) {
		return (
			<View
				style={[
					{
						padding: 12,
						backgroundColor: Colors[theme].container_surface,
						borderRadius: 12,
						borderWidth: 2,
						borderColor: Colors[theme].darkPrimary,
						width: 190,
					},
				]}>
				<View style={{ flexDirection: 'row', gap: 6 }}>
					<ThemedText
						style={[
							{
								fontWeight: '600',
								fontSize: 19,
								color: Colors[theme].textSecondary,
							},
						]}
						theme={theme}
						value="Regional"
					/>
					<ThemedText
						style={[{ fontWeight: '600', fontSize: 19 }]}
						theme={theme}
						value={`#${user.rankRegionalIndex}`}
					/>
				</View>
				<View style={{ flexDirection: 'row', gap: 6 }}>
					<ThemedText
						style={[
							{
								fontWeight: '600',
								fontSize: 19,
								color: Colors[theme].textSecondary,
							},
						]}
						theme={theme}
						value="Top"
					/>
					<ThemedText
						style={[{ fontWeight: '600', fontSize: 19 }]}
						theme={theme}
						value={`${user.rankRegionalRelative}%`}
					/>
				</View>
			</View>
		);
	}

	return (
		<View
			style={[
				{
					padding: 12,
					backgroundColor: Colors[theme].container_surface,
					borderRadius: 12,
					borderWidth: 2,
					borderColor: Colors[theme].darkPrimary,
					width: 190,
				},
			]}>
			<View style={{ flexDirection: 'row', gap: 6 }}>
				<ThemedText
					style={[
						{
							fontWeight: '600',
							fontSize: 19,
							color: Colors[theme].textSecondary,
						},
					]}
					theme={theme}
					value="Global"
				/>
				<ThemedText
					style={[{ fontWeight: '600', fontSize: 19 }]}
					theme={theme}
					value={`#${user.rankGlobalIndex}`}
				/>
			</View>
			<View style={{ flexDirection: 'row', gap: 6 }}>
				<ThemedText
					style={[
						{
							fontWeight: '600',
							fontSize: 19,
							color: Colors[theme].textSecondary,
						},
					]}
					theme={theme}
					value="Top"
				/>
				<ThemedText
					style={[{ fontWeight: '600', fontSize: 19 }]}
					theme={theme}
					value={`${user.rankGlobalRelative}%`}
				/>
			</View>
		</View>
	);
};

interface RankOvertimeProps {
	userId: string | null | undefined;
	getToken: () => Promise<string | null>;
	theme: 'light' | 'dark';
}

const RankOvertimeContainer: React.FC<RankOvertimeProps> = ({
	userId,
	getToken,
	theme,
}) => {
	const [error, setError] = useState<Error | null>(null);
	const [rankOvertime, setRankOvertime] = useState<RankOvertimeEntry[] | null>(
		[],
	);

	const [interval, setOvertimeInterval] =
		useState<RankOvertimeInterval>('Year');

	const fetchRankOvertime = async (
		interval: RankOvertimeInterval,
		userId: string | null | undefined,
	) => {
		if (!userId || !getToken) {
			setError(new Error('Precondition failed: UserId or getToken missing'));
			console.warn(
				'Error [fetchRankOvertime] in Component RankOvertimeContainer',
				'Precondition failed: UserId or getToken missing',
				userId,
				getToken,
			);
			return;
		}
		setError(null);
		setRankOvertime(null);

		try {
			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/ranks/${userId}/overtime/${interval}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const text = await response.text();

			if (!response.ok) {
				throw Error(text);
			}

			const result = JSON.parse(text);
			setRankOvertime(result);
		} catch (error) {
			console.warn(
				'Error [fetchRankOvertime] in Component RankOvertimeContainer',
				error,
			);
			setRankOvertime(null);
			setError(new Error(String(error)));
		}
	};

	const handleOnIntervalBtnPress = async () => {
		setOvertimeInterval((prev) => (prev === 'Month' ? 'Year' : 'Month'));
		await fetchRankOvertime(interval === 'Month' ? 'Year' : 'Month', userId);
	};

	useEffect(() => {
		fetchRankOvertime(interval, userId);
	}, []);

	// Dummy-Daten (Y-Werte)
	const data = [5, 10, 8, 12, 15, 13, 17];

	// Canvas Abmessungen
	const width = 320;
	const height = 200;
	const padding = 20;

	// Maximum für Skalierung
	const maxData = Math.max(...data);

	// Abstand zwischen Punkten horizontal
	const stepX = (width - 2 * padding) / (data.length - 1);

	// Pfad für Liniengraph
	// const path = Skia.Path.Make();

	// data.forEach((value, index) => {
	// 	const x = padding + stepX * index;
	// 	const y = height - padding - (value / maxData) * (height - 2 * padding);

	// 	if (index === 0) {
	// 		path.moveTo(x, y);
	// 	} else {
	// 		path.lineTo(x, y);
	// 	}
	// });

	return (
		<View style={{ flex: 0, height: 200 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginTop: 20,
				}}>
				<ThemedText
					style={[defaultStyles.bigText, { fontWeight: '600' }]}
					theme={theme}
					value="Rank Overtime"
				/>

				<TouchableOpacity
					onPress={handleOnIntervalBtnPress}
					style={{
						flexDirection: 'row',
						padding: 6,
						backgroundColor: Colors[theme].surface,
						borderRadius: 12,
						justifyContent: 'center',
						alignItems: 'center',
						gap: 6,
						paddingHorizontal: 12,
					}}>
					<Ionicons
						name="chevron-down"
						size={24}
						color={Colors[theme].textSecondary}
					/>
					<ThemedText
						style={[{ fontSize: 20 }]}
						theme={theme}
						value={interval === 'Month' ? '1M' : '1Y'}
					/>
				</TouchableOpacity>
			</View>
			{!rankOvertime || error ? (
				<View>
					{error ? (
						<NoDataPlaceholder
							firstTextValue="Something went wrong"
							retryFunction={() => fetchRankOvertime(interval, userId)}
							containerStyle={{
								top: 200,
							}}
						/>
					) : (
						<CrahActivityIndicator
							style={{
								top: 110,
							}}
						/>
					)}
				</View>
			) : (
				<View>
					{rankOvertime.length <= 0 ? (
						<View
							style={{
								top: 100,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<ThemedText
								value={'No Data to be displayed'}
								theme={'dark'}
								style={[defaultStyles.bigText, { color: Colors[theme].gray }]}
							/>
						</View>
					) : (
						<View style={styles.chartContainer}>
							{/* <Canvas style={{ width, height }}>
					<Path
						path={path}
						color="purple"
						style="stroke"
						strokeWidth={3}
						strokeJoin="round"
						strokeCap="round"
					/>
				</Canvas> */}
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		// paddingTop: 0,
	},
	chartContainer: {
		margin: 20,
	},
});

export default YourRank;
