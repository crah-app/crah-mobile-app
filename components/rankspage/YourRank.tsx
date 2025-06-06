import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { CrahUser, Rank, RankColors, RankColorsDark } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// import bg from '../../assets/images/output.svg';
// import { Canvas, Path, Skia } from '@shopify/react-native-skia';

// const cleanSvg = bg.replace(/(fill|stroke)="undefined"/g, '');

interface YourRankProps {
	theme: 'light' | 'dark';
}

const YourRank: React.FC<YourRankProps> = ({ theme }) => {
	const SingleStatsWrapper: React.FC<{ regional?: boolean }> = ({
		regional,
	}) => {
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
							value="#12"
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
							value="4%"
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
						value="#1203"
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
						value="15.1%"
					/>
				</View>
			</View>
		);
	};

	const StatsContainer = () => {
		return (
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
				<SingleStatsWrapper />

				{/* regional stats */}
				<SingleStatsWrapper regional />
			</View>
		);
	};

	// const RankOvertimeContainer = () => {
	// 	// Dummy-Daten (Y-Werte)
	// 	const data = [5, 10, 8, 12, 15, 13, 17];

	// 	// Canvas Abmessungen
	// 	const width = 320;
	// 	const height = 200;
	// 	const padding = 20;

	// 	// Maximum für Skalierung
	// 	const maxData = Math.max(...data);

	// 	// Abstand zwischen Punkten horizontal
	// 	const stepX = (width - 2 * padding) / (data.length - 1);

	// 	// Pfad für Liniengraph
	// 	const path = Skia.Path.Make();

	// 	data.forEach((value, index) => {
	// 		const x = padding + stepX * index;
	// 		const y = height - padding - (value / maxData) * (height - 2 * padding);

	// 		if (index === 0) {
	// 			path.moveTo(x, y);
	// 		} else {
	// 			path.lineTo(x, y);
	// 		}
	// 	});

	// 	return (
	// 		<View style={styles.chartContainer}>
	// 			<Canvas style={{ width, height }}>
	// 				<Path
	// 					path={path}
	// 					color="purple"
	// 					style="stroke"
	// 					strokeWidth={3}
	// 					strokeJoin="round"
	// 					strokeCap="round"
	// 				/>
	// 			</Canvas>
	// 		</View>
	// 	);
	// };

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
				{/* <SvgXml width={600} height={200} xml={cleanSvg} /> */}
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
				}}>
				<ThemedText
					style={[defaultStyles.bigText, { fontWeight: '600' }]}
					theme={theme}
					value="Rank Stats"
				/>

				{/* stats */}
				<StatsContainer />

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
						style={{
							flexDirection: 'row',
							padding: 6,
							backgroundColor: Colors[theme].surface,
							borderRadius: 12,
							justifyContent: 'center',
							alignItems: 'center',
							gap: 6,
						}}>
						<Ionicons
							name="chevron-down"
							size={24}
							color={Colors[theme].textSecondary}
						/>
						<ThemedText style={[{ fontSize: 20 }]} theme={theme} value="1M" />
					</TouchableOpacity>
				</View>

				{/* <RankOvertimeContainer /> */}
			</View>
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
