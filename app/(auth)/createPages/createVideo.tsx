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
	upload_source_ratio,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import * as imagePicker from 'expo-image-picker';

import UploadVideoModal from '@/app/modals/uploadVideoModal';

import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {
	KeyboardAwareScrollView,
	KeyboardToolbar,
} from 'react-native-keyboard-controller';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import CreatePageHeader from '@/components/create/CreatePageHeader';

interface videoDataInterface {
	cover: string; // cover image
	title: string; // video title
	description: string; // video description
	tags: Tags[] | undefined; // video tags
}

const CreateVideo = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();

	const [cover, setCover] = useState<
		imagePicker.ImagePickerAsset[] | undefined | string
	>(); // Lifted state
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [tags, setTags] = useState<Tags[] | undefined>();
	const [uploadedSource, setUploadedSource] = useState<
		imagePicker.ImagePickerAsset[] | undefined
	>();

	const checkUserInputs = () => {
		if (!cover) {
			Alert.alert('Error', 'Please upload a cover image');
			return false;
		}
		if (!uploadedSource) {
			Alert.alert('Error', 'Please upload a video');
			return false;
		}
		if (!title) {
			Alert.alert('Error', 'Please enter a title');
			return false;
		}
		if (!description) {
			Alert.alert('Error', 'Please enter a description');
			return false;
		}
		return true;
	};

	const handleVideoUploadClickEvent = () => {
		if (!checkUserInputs()) return;

		Alert.alert(
			'Confirm Upload',
			'Are you sure you want to upload this video?',
			[
				{
					text: 'No',
					style: 'cancel',
				},
				{
					text: 'Yes',
					onPress: handleVideoUpload,
				},
			],
			{ cancelable: false },
		);
	};

	const [videoData, setVideoData] = useState<videoDataInterface>({
		title,
		description,
		tags,
		cover: cover as string,
	});

	const handleVideoUpload = async () => {
		setVideoData({
			cover: cover as string, // Use cover state
			title, // Use title state
			description, // Use description state
			tags, // Use tags state
		});

		router.push(
			{
				pathname: '/(auth)/homePages',
				params: {
					video_upload: 'true',
					video_cover: JSON.stringify(cover),
					video_data: JSON.stringify(videoData),
				},
			}, // Use cover state
		);
	};

	const previewClickEventHandler = () => {};

	return (
		<View style={{ flex: 1 }}>
			<ThemedView theme={theme} flex={1} style={{ bottom: bottom * 3 }}>
				<CreatePageHeader
					title={'Create Video'}
					handleUploadClickEvent={handleVideoUploadClickEvent}
					previewClickEventHandler={previewClickEventHandler}
					style={{ paddingHorizontal: 12, paddingTop: 12 }}
				/>
				<CreateVideoMainContent
					cover={cover}
					setCover={setCover}
					uploadedSource={uploadedSource}
					setUploadedSource={setUploadedSource}
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					tags={tags}
					setTags={setTags}
				/>
			</ThemedView>
		</View>
	);
};

const CreateVideoMainContent = ({
	cover,
	setCover,
	uploadedSource,
	setUploadedSource,
	title,
	setTitle,
	description,
	setDescription,
	tags,
	setTags,
}: {
	cover: imagePicker.ImagePickerAsset[] | undefined | string;
	setCover: React.Dispatch<
		React.SetStateAction<imagePicker.ImagePickerAsset[] | undefined | string>
	>;
	uploadedSource: imagePicker.ImagePickerAsset[] | undefined;
	setUploadedSource: React.Dispatch<
		React.SetStateAction<imagePicker.ImagePickerAsset[] | undefined>
	>;
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	description: string;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
	tags: Tags[] | undefined;
	setTags: React.Dispatch<React.SetStateAction<Tags[] | undefined>>;
}) => {
	const theme = useSystemTheme();
	const scrollViewRef = useRef<ScrollView>(null);

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

	return (
		<>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
				<ScrollView
					ref={scrollViewRef}
					contentContainerStyle={{ flexGrow: 1 }}
					scrollEnabled={true}>
					<KeyboardAwareScrollView
						accessibilityViewIsModal={true}
						scrollEnabled={false}
						bottomOffset={100}
						contentContainerStyle={{ gap: 0, paddingBottom: 100 }}
						style={{ flex: 1 }}>
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
											<TouchableOpacity
												onPress={() => grabCoverFromCurrentFrame()}>
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
							setDescription={setDescription}
							description={description}
							scrollViewRef={scrollViewRef}
							tags={tags}
							setTags={setTags}
						/>
					</KeyboardAwareScrollView>
				</ScrollView>

				<KeyboardToolbar />
			</KeyboardAvoidingView>
		</>
	);
};

interface CreateVideoTextInputsProps {
	description: string;
	setDescription: (text: string) => void;
	scrollViewRef: React.RefObject<ScrollView>;
	tags: Tags[] | undefined;
	setTags: React.Dispatch<React.SetStateAction<Tags[] | undefined>>;
}

const CreateVideoTextInputs: React.FC<CreateVideoTextInputsProps> = ({
	description,
	setDescription,
	scrollViewRef,
	tags,
	setTags,
}) => {
	const theme = useSystemTheme();

	const [tagsLeft, setTagsLeft] = useState<Tags[]>(Object.values(Tags));

	const AddTag = (tag: Tags) => {
		console.log('AddTag function called');
		setTags((prev: Tags[] | undefined) => (prev ? [...prev, tag] : [tag]));

		handlCloseModalPress();
	};

	const RemoveTag = (tag: Tags) => {
		console.log('RemoveTag function called');
		setTags((prev: Tags[] | undefined) => {
			const updatedTags = prev?.filter((t) => t !== tag);
			return updatedTags;
		});
	};

	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ['50%'], []);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetRef.current?.present();

		setTagsLeft((prev) => prev.filter((tag) => !tags?.includes(tag)));
		console.log('tagsLeft: ', tagsLeft);
	}, [scrollViewRef, tagsLeft, tags]);

	const handlCloseModalPress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

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
				<View
					style={{
						backgroundColor: Colors[theme].container_surface,
						borderRadius: 8,
						paddingRight: 8,
						paddingBottom: 8,
						flexDirection: 'column',
						gap: 8,
						padding: 12,
					}}>
					<TouchableOpacity onPress={handlePresentModalPress}>
						<ThemedText
							value={'Add tags'}
							theme={theme}
							style={{ color: 'gray' }}
						/>
					</TouchableOpacity>

					<View
						style={{
							paddingBottom: 8,
							gap: 12,
							flexWrap: 'wrap',
							width: '100%',
							flexDirection: 'row',
						}}>
						{tags?.map((tag) => (
							<Tag
								key={tag}
								touchOpacity={1}
								DisplayRemoveBtn={true}
								theme={theme}
								tag={tag}
								ActionOnRemoveBtnClick={() => RemoveTag(tag)}
							/>
						))}
					</View>

					{!tags && <View style={{ height: 12 }} />}
				</View>
			</View>

			<BottomSheetModal
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background,
				}}
				ref={bottomSheetRef}>
				<BottomSheetView style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: 'column',
							gap: 12,
							paddingHorizontal: 18,
							paddingVertical: 18,
						}}>
						<ThemedText
							value={'Add a tag'}
							theme={theme}
							style={defaultStyles.biggerText}
						/>

						<ScrollView>
							<View>
								{tagsLeft.length > 0 ? (
									<View
										style={{
											width: '100%',
											flexDirection: 'row',
											gap: 8,
											flexWrap: 'wrap',
										}}>
										{tagsLeft.map((tag) => (
											<Tag
												touchOpacity={0.2}
												DisplayRemoveBtn={false}
												theme={theme}
												tag={tag}
												handleTagPress={() => AddTag(tag)}
											/>
										))}
									</View>
								) : (
									<ThemedText
										value={'No tags left'}
										theme={theme}
										style={{ color: 'gray' }}
									/>
								)}
							</View>
						</ScrollView>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
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
				{ backgroundColor: Colors[theme].container_surface },
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
		borderRadius: 8,
	},
	playBtn: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		// zIndex: 1,
		flex: 1,
	},
});

export default CreateVideo;
