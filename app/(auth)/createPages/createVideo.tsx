import Tag from '@/components/tag';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import {
	modal_mode,
	Tags,
	TextInputMaxCharacters,
	mediaTypeSourceRatio,
	upload_source_ratio,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, {
	forwardRef,
	useEffect,
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
	TextInput,
} from 'react-native';
import * as imagePicker from 'expo-image-picker';

import UploadVideoModal from '@/app/modals/uploadVideoModal';

import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import CostumKeyboardAvoidingView from '@/components/general/KeyboardAnimationView';
import {
	KeyboardAwareScrollView,
	KeyboardToolbar,
} from 'react-native-keyboard-controller';

const CreateVideo = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();

	return (
		<ThemedView theme={theme} flex={1} style={{ bottom: bottom * 3 }}>
			<CreateVideoHeader />
			<CreateVideoMainContent />
		</ThemedView>
	);
};

const CreateVideoHeader = () => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.headerContainer]}>
			<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
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
	);
};

const CreateVideoMainContent = () => {
	const theme = useSystemTheme();

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [tags, setTags] = useState<{}>();
	const [uploadedSource, setUploadedSource] = useState<
		imagePicker.ImagePickerAsset[] | undefined
	>();
	const [cover, setCover] = useState<
		imagePicker.ImagePickerAsset[] | undefined | string
	>();
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<modal_mode | undefined>();

	const [sourceRatio, setSourceRatio] = useState<upload_source_ratio>(
		upload_source_ratio.SQUARE,
	);

	useEffect(() => {
		GlobalFinalUserInputSourceRatio = sourceRatio;
	}, [sourceRatio]);

	const videoPlayerRef = useRef<{
		getCurrentTime: () => number;
		getPlayer: () => any;
	} | null>(null);

	const handleModal = (upload_mode: modal_mode) => {
		setModalVisible(true);
		setModalMode(upload_mode);
	};

	const removeSource = async () => {
		setUploadedSource(undefined);
	};

	const removeCover = async () => {
		setCover(undefined);
	};

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

	const AddTag = () => {};

	const RemoveTag = () => {};

	return (
		<>
			<KeyboardAwareScrollView
				bottomOffset={100}
				contentContainerStyle={{ gap: 0, paddingBottom: 100 }}
				style={{ flex: 1 }}>
				<UploadVideoModal
					isVisible={modalVisible}
					setVisibility={setModalVisible}
					setUploadedImage={setUploadedSource}
					setUploadedCover={setCover}
					uploadMode={modalMode}
					setSourceRatio={setSourceRatio}
					uploadedSource={uploadedSource}
					cover={cover}
				/>

				<View
					style={[
						styles.Container1,
						styles.InputContainer,
						{ paddingTop: 10 },
					]}>
					<ThemedTextInput
						value={title}
						placeholder="Enter the video title here"
						theme={theme}
						setValue={setTitle}
					/>
				</View>

				<View style={[styles.Container2, styles.InputContainer]}>
					<View style={{ gap: 12 }}>
						{uploadedSource ? (
							<UploadedSourceContainer
								removeSource={removeSource}
								uploadedSource={uploadedSource}
								SourceMode="Source"
								ref={videoPlayerRef}
								sourceRatio={sourceRatio}
							/>
						) : (
							<TouchableOpacity onPress={() => handleModal('Source')}>
								<ThemedText
									value="Upload video"
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

						{cover ? (
							<UploadedSourceContainer
								removeSource={removeCover}
								uploadedSource={cover as imagePicker.ImagePickerAsset[]}
								SourceMode="Cover"
								sourceRatio={sourceRatio}
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
										value="Upload cover"
										theme={theme}
										style={[defaultStyles.outlinedBtn, { padding: 8 }]}
									/>
								</TouchableOpacity>

								{uploadedSource && (
									<TouchableOpacity onPress={() => grabCoverFromCurrentFrame()}>
										<ThemedText
											value="Grab cover from current frame"
											theme={theme}
											style={[defaultStyles.outlinedBtn, { padding: 8 }]}
										/>
									</TouchableOpacity>
								)}
							</View>
						)}
					</View>
				</View>

				<CreateVideoTextInputs
					setTags={() => setTags}
					setDescription={setDescription}
					description={description}
					RemoveTag={RemoveTag}
				/>
			</KeyboardAwareScrollView>
			<KeyboardToolbar />
		</>
	);
};

interface CreateVideoTextInputsProps {
	description: string;
	setDescription: (text: string) => void;
	setTags: () => void;
	RemoveTag: () => void;
}

const CreateVideoTextInputs: React.FC<CreateVideoTextInputsProps> = ({
	description,
	setDescription,
	setTags,
	RemoveTag,
}) => {
	const theme = useSystemTheme();

	return (
		<View>
			<View style={[styles.Container3, styles.InputContainer]}>
				<ThemedTextInput
					placeholder={
						'Enter description, insights, hashtags, your thoughts...'
					}
					theme={theme}
					lines={30}
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
					lines={1}
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
	);
};

interface UploadedSourceContainerProps {
	uploadedSource: imagePicker.ImagePickerAsset[];
	removeSource: () => void;
	SourceMode: modal_mode;
	sourceRatio: upload_source_ratio;
}

interface UploadedSourceContainerRef {
	getCurrentTime: () => number;
	getPlayer: () => any;
}

let GlobalFinalUserInputSourceRatio: upload_source_ratio | undefined;

const UploadedSourceContainer = forwardRef<
	UploadedSourceContainerRef,
	UploadedSourceContainerProps
>((props, ref) => {
	const {
		uploadedSource,
		removeSource,
		SourceMode,
		sourceRatio: source_ratio,
	} = props;
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

	const fileName = uploadedSource[0].fileName?.toString();
	const fileNameLength = fileName?.length || 0;

	const [dynamicDimensions, setDynamicDimensions] = useState<{
		width: number | string;
		height: number;
	}>({
		width:
			GlobalFinalUserInputSourceRatio == upload_source_ratio.PORTRAIT
				? Dimensions.get('window').width * 0.94 * (9 / 16)
				: '100%',
		height:
			GlobalFinalUserInputSourceRatio != upload_source_ratio.SQUARE
				? GlobalFinalUserInputSourceRatio == upload_source_ratio.PORTRAIT
					? Dimensions.get('window').height *
					  (Dimensions.get('window').width / Dimensions.get('window').height) *
					  0.94
					: (Dimensions.get('window').width / (16 / 9)) * 0.94
				: Dimensions.get('window').width * 0.94,
	});

	const VideoPlayBtn = () => {
		return (
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
		);
	};

	return (
		<View
			style={[
				styles.videoWrapper,
				{ backgroundColor: Colors[theme].textSecondary },
			]}>
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
						// prettier-ignore
						(fileNameLength <= 20 && fileName) ? fileName! : 
						`Your uploaded ${SourceMode === 'Cover' ? `cover (${source_ratio})` : `video (${source_ratio})`}`
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
						// prettier-ignore
						width: dynamicDimensions.width as number,
						height: dynamicDimensions.height,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<VideoView
						style={{
							width: dynamicDimensions.width as number,
							height: dynamicDimensions.height,
						}}
						player={player}
						contentFit={'cover'}
						nativeControls={false}
					/>

					<VideoPlayBtn />
				</View>
			) : (
				<View
					style={{
						width: dynamicDimensions.width as number,
						height: dynamicDimensions.height,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<Image
						resizeMode={'cover'}
						style={{
							width: dynamicDimensions.width as number,
							height: dynamicDimensions.height,
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
		zIndex: 1,
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
