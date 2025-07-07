import React, { useState } from 'react';
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
import { SelectedTrick, SpotInterface, TextInputMaxCharacters } from '@/types';
import { defaultStyles } from '@/constants/Styles';
import { format } from 'date-fns';
import TrickPreviewCard from './TrickPreviewCard';
import { useAuth, useUser } from '@clerk/clerk-expo';
import PostTypeButton from '../PostTypeButton';
import TransparentLoadingScreen from '../TransparentLoadingScreen';

interface TrickBuilderProps {}

const TrickBuilder: React.FC<TrickBuilderProps> = ({}) => {
	const theme = useSystemTheme();
	const { user } = useUser();
	const { getToken } = useAuth();

	const [trickCreated, setTrickCreated] = useState<boolean>(false);
	const [addedSpot, setAddedSpot] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	const [tricks, setTricks] = useState<SelectedTrick[]>([]);

	const [value, setValue] = useState<string>('');
	const [spots, setSpots] = useState<SpotInterface[]>([
		// { spot: 'Flat', landing_date: new Date() },
		// {
		// 	spot: 'Street',
		// 	landing_date: new Date(100000000000),
		// },
	]);

	const createTrickObject = (): SelectedTrick[] => {
		const createdTrick: SelectedTrick[] = [
			{
				Spot: 'Park', // placeholder. Park does not manipulate trick points
				Name: value,
				DefaultPoints: 0, // default points get calculated in the backend
				Costum: false, // gets evaluated in the backend
				Type: '', // gets evaluated in the backend
				SecondName: '', // leave it blank
			},
		];

		setTricks(createdTrick);
		return createdTrick;
	};

	const handleCreateTrick = async () => {
		try {
			if (value.length <= 0) return;

			setTrickCreated(false);
			setLoading(true);
			setModalVisible(true);
			setAddedSpot(false);

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
			console.log('Raw response:', text);

			// const result = await response.json();

			if (!response.ok) {
				setTrickCreated(false);
				setLoading(false);
				setModalVisible(false);
				setAddedSpot(false);

				Alert.alert('Error adding trick');
			}
		} catch (error) {
			Alert.alert('Error adding trick');
			console.warn(error);
		} finally {
			setTrickCreated(true);
			setLoading(false);
			setModalVisible(false);
			setAddedSpot(false);
		}
	};

	const TrickBuilderBody = () => {
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
						height: 35,
						borderBottomColor: Colors[theme].gray,
						borderBottomWidth: !addSpot ? StyleSheet.hairlineWidth : 0,
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
								value={format(
									spotData.landing_date || new Date(),
									'yyyy-MM-dd',
								)}
							/>
						)}
					</View>
				</View>
			);
		};

		const TableHeader = ({ isDisabled }: { isDisabled: boolean }) => {
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
		};

		const Title = () => {
			return (
				<>
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
				</>
			);
		};

		const InputField = () => {
			return (
				<>
					{!trickCreated && (
						<View
							style={{
								gap: 14,
							}}>
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
								click_action={async () => await handleCreateTrick()}
								style={{ width: '100%' }}
							/>
						</View>
					)}
				</>
			);
		};

		const AddSpotInputField = () => {
			return (
				<>
					{!addedSpot && trickCreated && (
						<View
							style={{
								gap: 14,
							}}>
							<ThemedTextInput
								containerStyle={{ width: '100%' }}
								makeWordToBubble
								theme={theme}
								value={value}
								setValue={setValue}
								lines={1}
								maxLength={TextInputMaxCharacters.Simple}
								placeholder="Park, Street, Flat"
							/>

							<PostTypeButton
								val={spots.length > 1 ? 'Add Spots!' : 'Add Spot!'}
								click_action={async () => await handleCreateTrick()}
								style={{ width: '100%' }}
							/>
						</View>
					)}
				</>
			);
		};

		const TrickDetails = () => {
			return (
				<View style={{ gap: 18 }}>
					<View>
						<View style={{ width: '100%' }}>
							{/* table header */}
							{!trickCreated ? (
								<TableHeader isDisabled={false} />
							) : (
								<TableHeader isDisabled={true} />
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
								<SpotRow addSpot={false} spotData={spotData} key={index} />
							))}
							<SpotRow
								addSpot
								spotData={{ spot: 'Flat', landing_date: new Date() }}
								key={4}
							/>
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
		};

		return (
			<View
				style={[
					{
						gap: 18,
						paddingVertical: 24,
						paddingHorizontal: 24,
						width: Dimensions.get('window').width,
						minHeight: 550,
						justifyContent: 'center',
					},
				]}>
				<Title />
				<InputField />
				<AddSpotInputField />

				{/* trick spots */}
				{trickCreated && addedSpot ? <TrickDetails /> : <></>}
			</View>
		);
	};

	return (
		<View>
			<TransparentLoadingScreen
				visible={modalVisible}
				progress={0}
				showProgress={false}
			/>
			<TrickBuilderBody />
		</View>
	);
};

const styles = StyleSheet.create({
	innerRowContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
});

export default TrickBuilder;
