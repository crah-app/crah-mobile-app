import React, { useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import ThemedTextInput from '../general/ThemedTextInput';
import {
	BestTrickType,
	SpotInterface,
	TextInputMaxCharacters,
	TrickListSpot,
	TrickSpot,
} from '@/types';
import { defaultStyles } from '@/constants/Styles';
import { format } from 'date-fns';
import TrickPreviewCard from './TrickPreviewCard';
import { useUser } from '@clerk/clerk-expo';

interface TrickBuilderProps {}

const TrickBuilder: React.FC<TrickBuilderProps> = ({}) => {
	const insets = useSafeAreaInsets();
	const theme = useSystemTheme();
	const { user } = useUser();

	// trick builder header
	const TrickBuilderHeader = () => {
		const onHelpPress = () => {
			router.navigate({ pathname: '/modals/help_modal', params: {} });
		};

		const onConfirmPress = () => {
			fetch('', {
				headers: { 'Cache-Control': 'no-cache' },
				body: JSON.stringify({}),
			})
				.then()
				.catch((err) => console.log(err))
				.finally(() => {});
		};

		return (
			<View
				style={{
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
					marginBottom: 12,
				}}>
				<TouchableOpacity onPress={onHelpPress}>
					<Ionicons name={'help'} size={24} color={Colors[theme].textPrimary} />
				</TouchableOpacity>

				<TouchableOpacity onPress={onConfirmPress}>
					<Ionicons
						name={'checkmark'}
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	const TrickBuilderBody = () => {
		const [value, setValue] = useState<string>('');
		const [spots, setSpots] = useState<SpotInterface[]>([
			{ spot: 'Flat', landing_date: new Date() },
			{
				spot: 'Street',
				landing_date: new Date(100000000000),
			},
		]);

		// spot row
		const SpotRow: React.FC<{ spotData: SpotInterface; addSpot: boolean }> = ({
			spotData,
			addSpot,
		}) => {
			return (
				<View
					style={{
						flexDirection: 'row',
						width: '100%',
						borderBottomColor: Colors[theme].gray,
						borderBottomWidth: !addSpot ? StyleSheet.hairlineWidth : 0,
						paddingBottom: 8,
					}}>
					<View style={{ width: '50%', paddingLeft: 24 }}>
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

					<View
						style={{
							width: '50%',
							paddingLeft: 24,
							borderLeftColor: Colors[theme].gray,
							borderLeftWidth: StyleSheet.hairlineWidth,
						}}>
						{addSpot ? (
							<ThemedText
								style={{ color: Colors[theme].gray }}
								theme={theme}
								value={'YYYY-MM-DD'}
							/>
						) : (
							<ThemedText
								theme={theme}
								value={format(spotData.landing_date, 'yyyy-MM-dd')}
							/>
						)}
					</View>
				</View>
			);
		};

		return (
			<View style={styles.container}>
				{/* input field with button */}
				<View style={{ gap: 12 }}>
					<ThemedTextInput
						makeWordToBubble
						theme={theme}
						value={value}
						setValue={setValue}
						lines={1}
						maxLength={TextInputMaxCharacters.Simple}
						placeholder="Your costum trick..."
					/>

					<TouchableOpacity>
						<ThemedText
							theme={theme}
							value={'Create'}
							style={[defaultStyles.primaryBtn]}
						/>
					</TouchableOpacity>
				</View>
				{/* trick spots */}
				<View style={{ width: '100%' }}>
					<View
						style={{
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'space-around',
							padding: 8,
						}}>
						<View style={{ width: '50%', paddingLeft: 24 }}>
							<ThemedText theme={theme} value={'Spot'} />
						</View>

						<View style={{ width: '50%', paddingLeft: 24 }}>
							<ThemedText theme={theme} value={'Landed on'} />
						</View>
					</View>

					<View
						style={{
							backgroundColor: Colors[theme].container_surface,
							padding: 8,
							gap: 12,
							borderRadius: 8,
						}}>
						{spots.map((spotData, index) => (
							<SpotRow addSpot={false} spotData={spotData} key={index} />
						))}
						<SpotRow
							addSpot
							spotData={{ spot: 'Flat', landing_date: new Date() }}
							key={4}
						/>
					</View>
				</View>
				{/* trick preview */}
				<TrickPreviewCard
					theme={theme}
					trickName={'Crossfoot Buttercup Crossfoot'}
					userId={user?.id}
					spots={spots}
				/>
			</View>
		);
	};

	return (
		<ScrollView
			style={{
				paddingHorizontal: 24,
				gap: 12,
				flexDirection: 'column',
				width: Dimensions.get('window').width,
			}}>
			<TrickBuilderHeader />
			<TrickBuilderBody />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, gap: 12, width: '100%' },
});

export default TrickBuilder;
