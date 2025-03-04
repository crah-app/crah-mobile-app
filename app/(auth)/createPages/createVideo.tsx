import Tag from '@/components/tag';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { modal_mode, Tags, TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import {
	Dimensions,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	Image,
	Alert,
	DimensionValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as imagePicker from 'expo-image-picker';

import UploadVideoModal from '@/app/modals/uploadVideoModal';

import placeholderImage from '@/assets/images/crah.png';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import * as VideoThumbnails from 'expo-video-thumbnails';

const CreateVideo = () => {
	const theme = useSystemTheme();
	const insets = useSafeAreaInsets();

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [tags, setTags] = useState<{}>();

	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<modal_mode | undefined>();

	const AddTag = () => {};

	const RemoveTag = () => {};

	const [uploadedSource, setUploadedSource] = useState<
		imagePicker.ImagePickerAsset[] | undefined
	>();

	const [cover, setCover] = useState<
		imagePicker.ImagePickerAsset[] | undefined | string
	>();

	const removeSource = async () => {
		try {
			setUploadedSource(undefined);
		} catch (error: any) {
			Alert.alert(error.message);
			setModalVisible(false);
		}
	};

	const removeCover = async () => {
		try {
			setCover(undefined);
		} catch (error: any) {
			Alert.alert(error.message);
			setModalVisible(false);
		}
	};

	const handleModal = (upload_mode: modal_mode) => {
		setModalVisible(true);
		setModalMode(upload_mode);
	};

	const videoPlayerRef = useRef<{
		getCurrentTime: () => number;
		getPlayer: () => any;
	} | null>(null);

	const grabCoverFromCurrentFrame = async () => {
		if (videoPlayerRef.current && uploadedSource) {
			const currentTime = Number(
				(videoPlayerRef.current.getCurrentTime() * 1000).toFixed(0),
			);

			const { uri } = await VideoThumbnails.getThumbnailAsync(
				uploadedSource[0].uri,
				{
					time: currentTime,
				},
			);

			setCover(uri);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
			<UploadVideoModal
				isVisible={modalVisible}
				setVisibility={setModalVisible}
				setUploadedImage={setUploadedSource}
				setUploadedCover={setCover}
				uploadMode={modalMode}
			/>

			<ThemedView theme={theme} flex={1} style={[styles.container]}>
				<View style={[styles.headerContainer]}>
					<View
						style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
						<ThemedText
							theme={theme}
							value={'Create Video'}
							style={defaultStyles.biggerText}
						/>
						<TouchableOpacity>
							<Ionicons
								size={24}
								color={Colors[theme].textPrimary}
								name="send-outline"
							/>
						</TouchableOpacity>
					</View>

					<View style={{ marginVertical: 4, width: '100%' }}>
						<TouchableOpacity>
							<ThemedText
								style={{
									flex: 0,
									borderRadius: 8,
									color: Colors[theme].primary,
								}}
								theme={theme}
								value={'click here for preview'}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						contentInsetAdjustmentBehavior="automatic"
						keyboardDismissMode="on-drag"
						style={{}}>
						<View style={{ paddingBottom: 200 }}>
							<View
								style={[
									styles.Container1,
									styles.InputContainer,
									{ paddingTop: 22 - 12 },
								]}>
								<ThemedTextInput
									value={title}
									placeholder={'Enter the video title here'}
									theme={theme}
									setValue={setTitle}
								/>
							</View>
							<View style={[styles.Container2, styles.InputContainer]}>
								{/*  */}
								<View style={{ gap: 12 }}>
									{/*  */}
									{uploadedSource ? (
										<UploadedSourceContainer
											removeSource={removeSource}
											uploadedSource={uploadedSource}
											SourceMode="Source"
											ref={videoPlayerRef}
										/>
									) : (
										<TouchableOpacity onPress={() => handleModal('Source')}>
											<ThemedText
												value={'Upload video'}
												theme={theme}
												style={[
													defaultStyles.primaryBtn,
													{
														padding: 14,
														color: Colors[theme].textPrimaryReverse,
													},
												]}
											/>
										</TouchableOpacity>
									)}
									{/*  */}
									{cover ? (
										<UploadedSourceContainer
											removeSource={removeCover}
											uploadedSource={cover as imagePicker.ImagePickerAsset[]}
											SourceMode="Cover"
										/>
									) : (
										<View
											style={{
												flexDirection: 'row',
												width: '100%',
												justifyContent: 'space-between',
												gap: 8,
											}}>
											<TouchableOpacity
												style={{ flex: 1 }}
												onPress={() => handleModal('Cover')}>
												<ThemedText
													value={'Upload cover'}
													theme={theme}
													style={[defaultStyles.outlinedBtn, { padding: 8 }]}
												/>
											</TouchableOpacity>

											{uploadedSource && (
												<TouchableOpacity
													onPress={() => grabCoverFromCurrentFrame()}>
													<ThemedText
														value={'Grab cover from current frame'}
														theme={theme}
														style={[defaultStyles.outlinedBtn, { padding: 8 }]}
													/>
												</TouchableOpacity>
											)}
										</View>
									)}
									{/*  */}
								</View>
								{/*  */}
							</View>
							<View style={[styles.Container3, styles.InputContainer]}>
								<ThemedTextInput
									placeholder={
										'Enter description, insights, hashtags, your thoughts...'
									}
									theme={theme}
									lines={4}
									multiline={true}
									maxLength={TextInputMaxCharacters.BigDescription}
									showLength={true}
									children={null}
									value={description}
									setValue={setDescription}
								/>
							</View>
							<View style={[styles.Container4, styles.InputContainer]}>
								<ThemedTextInput
									value={''}
									setValue={setTags}
									placeholder={'Add tag'}
									theme={theme}
									lines={99}
									multiline={false}
									childrenContainerStyle={{
										flexDirection: 'row',
										gap: 10,
										flexWrap: 'wrap',
									}}>
									<Tag
										DisplayRemoveBtn={true}
										theme={theme}
										tag={Tags.Banger}
										ActionOnRemoveBtnClick={RemoveTag()}
									/>
								</ThemedTextInput>
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</ThemedView>
		</KeyboardAvoidingView>
	);
};

interface UploadedSourceContainerProps {
	uploadedSource: imagePicker.ImagePickerAsset[];
	removeSource: () => void;
	SourceMode: modal_mode;
}

interface UploadedSourceContainerRef {
	getCurrentTime: () => number;
	getPlayer: () => any;
}

const UploadedSourceContainer = forwardRef<
	UploadedSourceContainerRef,
	UploadedSourceContainerProps
>((props, ref) => {
	const { uploadedSource, removeSource, SourceMode } = props;
	const theme = useSystemTheme();
	const player = useVideoPlayer(uploadedSource[0].uri, (player) => {
		player.playbackRate = 1;
		player.loop = true;
		player.allowsExternalPlayback = false;
		player.audioMixingMode = 'doNotMix';
	});

	const { isPlaying } = useEvent(player, 'playingChange', {
		isPlaying: player.playing,
	});

	const playBtnColor = theme === 'dark' ? 0 : 255;

	const handleVideoPlayer = () => {
		isPlaying ? player.pause() : player.play();
	};

	useImperativeHandle(ref, () => ({
		getCurrentTime: () => player.currentTime,
		getPlayer: () => player,
	}));

	const sourceRatio = uploadedSource[0].width / uploadedSource[0].height;

	const isLandscape = sourceRatio >= 16 / 9;
	const isPortrait = sourceRatio < 1; // Falls du auch quadratische Videos als "nicht Portrait" sehen möchtest, ändere das zu sourceRatio < 1 && sourceRatio !== 1;

	// console.log('Aspect Ratio:', sourceRatio);
	// console.log('Is Landscape:', isLandscape);
	// console.log('Is Portrait:', isPortrait);

	const sourceDimensions = {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width,
	};

	return (
		<View
			style={[styles.videoWrapper, { backgroundColor: Colors[theme].surface }]}>
			<View
				style={{
					width: '95%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<ThemedText
					style={[{ fontSize: 16 }]}
					value={
						uploadedSource[0].fileName?.toString() ||
						`Your uploaded ${SourceMode === 'Cover' ? 'cover (1:1)' : 'video'}`
					}
					theme={theme}
				/>
				<TouchableOpacity
					onPress={removeSource}
					style={[
						defaultStyles.primaryBtn,
						{
							backgroundColor: Colors[theme].primary,
						},
					]}>
					<ThemedText value={'Delete'} theme={'dark'} />
				</TouchableOpacity>
			</View>

			{SourceMode === 'Source' ? (
				<View
					style={{
						width: Dimensions.get('window').width,
						height: isLandscape
							? Dimensions.get('window').width / sourceRatio
							: Dimensions.get('window').width,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{isLandscape ? (
						<VideoView
							style={{
								width: '94%',
								height: Dimensions.get('window').width / sourceRatio,
							}}
							player={player}
							contentFit={'fill'}
							nativeControls={false}
						/>
					) : (
						<VideoView
							style={{
								width: Dimensions.get('window').width * sourceRatio * 0.94,
								height: '100%',
							}}
							player={player}
							contentFit={'fill'}
							nativeControls={false}
						/>
					)}

					<TouchableOpacity
						onPress={handleVideoPlayer}
						style={styles.playBtn}
						activeOpacity={0.8}>
						{!isPlaying && (
							<View
								style={{
									padding: 12,
									backgroundColor:
										'gray' +
										`rgba(${playBtnColor},${playBtnColor},${playBtnColor},0.5)`,
									borderRadius: '100%',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Ionicons
									name={isPlaying ? 'pause' : 'play'}
									size={24}
									color={'gray' + `rgba(${255},${255},${255},0.8)`}
									style={{ textAlign: 'center', marginLeft: 2 }}
								/>
							</View>
						)}
					</TouchableOpacity>
				</View>
			) : (
				<View
					style={{
						width: Dimensions.get('window').width,
						height: Dimensions.get('window').width,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Image
						resizeMode="cover"
						style={{
							width: '94%',
							height: isLandscape
								? Dimensions.get('window').width
								: Dimensions.get('window').width,
						}}
						source={{
							uri:
								typeof uploadedSource !== 'string'
									? uploadedSource[0].uri
									: uploadedSource,
						}}
					/>
				</View>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 0,
		height: Dimensions.get('window').height,
	},
	headerContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingTop: 12,
		paddingBottom: 12,
	},
	Container1: {},
	Container2: {},
	Container3: {},
	Container4: {},
	InputContainer: {
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	videoWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		paddingTop: 8,
		borderRadius: 5,
	},
	playBtn: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1,
		flex: 1,
	},
});

export default CreateVideo;
