import Colors from '@/constants/Colors';
import {
	AudioFile,
	ChatFooterBarTypes,
	dropDownMenuInputData,
	errType,
	ItemText,
	selectedRiderInterface,
	selectedTrickInterface,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import SearchBar from '../general/SearchBar';
import AllUserRowContainer from '../displayFetchedData/AllUserRowContainer';
import DropDownMenu from '../general/DropDownMenu';
import { Ionicons } from '@expo/vector-icons';
import AllTricksRowContainer from '../displayFetchedData/AllTricksRowContainer';
import { AudioRecorder, AudioSource, useAudioPlayer } from 'expo-audio';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as FileSystem from 'expo-file-system';

interface RenderRightInputButtonProps {
	props: any;
	setDisplayFooter: (b: boolean) => void;
	setAttachedMessageType: (t: ChatFooterBarTypes) => void;
	setSelectedRiderData: (u: selectedRiderInterface | undefined) => void;
	setSelectedTrickData: (u: selectedTrickInterface | undefined) => void;
	isRecording: boolean;
	setRecordedAudio: Dispatch<SetStateAction<AudioFile | null>>;
	recordedAudio: AudioFile | null;
	isPlayingAudio: boolean;
	setIsPlayingAudio: Dispatch<SetStateAction<boolean>>;
	audioRecorderPlayer: AudioRecorderPlayer;
}

export const RenderRightInputButton: React.FC<RenderRightInputButtonProps> = ({
	props,
	setDisplayFooter,
	setAttachedMessageType,
	setSelectedRiderData,
	setSelectedTrickData,
	isRecording,
	setRecordedAudio,
	recordedAudio,
	isPlayingAudio,
	setIsPlayingAudio,
	audioRecorderPlayer,
}) => {
	const theme = useSystemTheme();
	const items: Array<dropDownMenuInputData> = [
		{
			key: 0,
			text: 'Rider',
		},
		{
			key: 1,
			text: 'Trick',
		},
	];

	const [bottomSheetDisplayContentType, setBottomSheetDisplayContentType] =
		useState<ItemText>();

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['75%'], []);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleCloseModalPress = useCallback(() => {
		bottomSheetModalRef.current?.close();
	}, []);

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

	const handleBottomSheetOpen = () => {
		handlePresentModalPress();
	};

	const handleOnSelect = (val: { key: number; text: ItemText }) => {
		setBottomSheetDisplayContentType(val.text);
		handleBottomSheetOpen();

		switch (val.text) {
			case 'Rider':
				// fetchTricks();
				break;

			case 'Trick':
				// fetchRiders();
				break;
		}
	};

	// fetching...
	const [searchQuery, setSearchQuery] = useState<string>('');

	const [dataLoaded, setDataLoaded] = useState<boolean>();
	const [err, setErr] = useState<errType>();
	const [data, setData] = useState<any>();

	const onUserPress = (user: selectedRiderInterface) => {
		handleCloseModalPress();
		setDisplayFooter(true);
		setAttachedMessageType('RiderRow');
		setSelectedRiderData(user);
	};

	const onTrickPress = (trick: selectedTrickInterface) => {
		handleCloseModalPress();
		setDisplayFooter(true);
		setAttachedMessageType('TrickRow');
		setSelectedTrickData(trick);
	};

	const checkAudioFile = async (path: string) => {
		const info = await FileSystem.getInfoAsync(path);
		return info;
		console.log('Audio file info:', info);
	};

	const playAudio = async () => {
		console.log(
			'file details:',
			await checkAudioFile(recordedAudio?.path as string),
		);

		if (!recordedAudio?.path) return;

		try {
			console.log('Playing audio from:', recordedAudio.path);
			await audioRecorderPlayer.startPlayer(recordedAudio.path);

			setIsPlayingAudio(true);

			audioRecorderPlayer.addPlayBackListener((e) => {
				console.log('Progress:', e.currentPosition, e.duration);
				if (e.duration > 0 && e.currentPosition >= e.duration) {
					stopAudio();
				}
			});
		} catch (err) {
			console.warn('Fehler beim Abspielen:', err);
		}
	};

	const stopAudio = async () => {
		try {
			await audioRecorderPlayer.stopPlayer();
			audioRecorderPlayer.removePlayBackListener(); // korrekt aufräumen
			setIsPlayingAudio(false);
		} catch (err) {
			console.warn('Fehler beim Stoppen:', err);
		}
	};

	return (
		<View>
			<BottomSheetModal
				containerStyle={{}}
				backdropComponent={renderBackdrop}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].surface,
				}}
				ref={bottomSheetModalRef}
				index={1}
				snapPoints={snapPoints}>
				{/* main content */}
				<BottomSheetView
					style={{
						flex: 1,
						padding: 12,
					}}>
					<View
						style={{
							flex: 1,
							gap: 12,
							height: 94,
							minHeight: 94,
							maxHeight: 94,
						}}>
						<ThemedText
							style={[defaultStyles.biggerText]}
							value={`Select a ${bottomSheetDisplayContentType}`}
							theme={theme}
						/>
						<SearchBar
							containerStyle={{
								height: 42,
								minHeight: 42,
								maxHeight: 42,
							}}
							placeholder={'Search...'}
							query={searchQuery}
							setQuery={setSearchQuery}
						/>
					</View>
					{bottomSheetDisplayContentType === 'Rider' ? (
						<AllUserRowContainer
							costumHandleUserPress={onUserPress}
							contentContainerStyle={{
								flex: 1,
								paddingHorizontal: 0,
								backgroundColor: Colors[theme].surface,
							}}
							rowStyle={{
								paddingHorizontal: 0,
								backgroundColor: Colors[theme].surface,
							}}
							bottomSheet={true}
						/>
					) : (
						<AllTricksRowContainer
							costumHandleTrickPress={onTrickPress}
							contentContainerStyle={{
								flex: 1,
								paddingHorizontal: 0,
								backgroundColor: Colors[theme].surface,
							}}
							rowStyle={{
								paddingHorizontal: 0,
								backgroundColor: Colors[theme].surface,
							}}
							bottomSheet={true}
						/>
					)}
				</BottomSheetView>
			</BottomSheetModal>

			<View style={{ flexDirection: 'row', gap: 8, marginLeft: 8 }}>
				{!isRecording && !recordedAudio && (
					<DropDownMenu
						onSelect={(_, val) => handleOnSelect(val)}
						items={items}
						triggerComponent={
							<TouchableOpacity style={{}}>
								<Ionicons
									name="add-outline"
									size={24}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						}
					/>
				)}

				{!isRecording && recordedAudio && (
					<View style={{ flexDirection: 'row', gap: 8 }}>
						<TouchableOpacity
							style={{}}
							onPress={() => {
								setRecordedAudio(null);
							}}>
							<Ionicons
								name="trash-outline"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={{}}
							onPress={isPlayingAudio ? stopAudio : playAudio}>
							<Ionicons
								name={isPlayingAudio ? 'pause-outline' : 'play-outline'}
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</View>
	);
};
