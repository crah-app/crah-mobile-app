import Tag from '@/components/tag';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import {
	CreatePostType,
	helpPageParameter,
	modal_mode,
	Tags,
	TextInputMaxCharacters,
	upload_source_ratio,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, {
	Dispatch,
	forwardRef,
	SetStateAction,
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

import UploadVideoModal from '@/app/(auth)/modals/uploadVideoModal';

import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
	KeyboardAwareScrollView,
	KeyboardToolbar,
} from 'react-native-keyboard-controller';
import { Link, router } from 'expo-router';
import CreatePageHeader from '@/components/create/CreatePageHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import { VideoUIBtns } from '@/components/VideoUI';
import { uploadSource } from '@/hooks/bucketUploadManager';
import { useUser, useAuth } from '@clerk/clerk-expo';
import TransparentLoadingScreen from '@/components/TransparentLoadingScreen';
import { sleep } from '@/utils/globalFuncs';
import PostTypeButton from '@/components/PostTypeButton';
import { useSharedValue } from 'react-native-reanimated';

interface videoDataInterface {
	video: imagePicker.ImagePickerAsset[]; // video
	cover: imagePicker.ImagePickerAsset[]; // cover image
	title: string; // video title
	description: string; // video description
	tags: Tags[] | undefined; // video tags
	ratio: string;
}

const CreateVideo = () => {
	const theme = useSystemTheme();
	// const { bottom } = useSafeAreaInsets();

	const { getToken } = useAuth();
	const { user } = useUser();

	const [cover, setCover] = useState<
		imagePicker.ImagePickerAsset[] | undefined | string
	>();
	const [video, setVideo] = useState<
		imagePicker.ImagePickerAsset[] | undefined | string
	>();

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [tags, setTags] = useState<Tags[] | undefined>();
	const [uploadedSource, setUploadedSource] = useState<
		imagePicker.ImagePickerAsset[] | undefined
	>();

	const [sourceRatio, setSourceRatio] = useState<upload_source_ratio>(
		upload_source_ratio.SQUARE,
	);

	const [videoData, setVideoData] = useState<videoDataInterface>({
		video: video as imagePicker.ImagePickerAsset[],
		title,
		description,
		tags,
		cover: cover as imagePicker.ImagePickerAsset[],
		ratio: sourceRatio,
	});

	const [errorUploadingSource, setErrorUploadingSource] =
		useState<boolean>(false);
	const [uploadingProgress, setUploadingProgress] = useState<number>(0);
	const [uploadingModalVisible, setUploadingModalVisible] =
		useState<boolean>(false);
	const [wantsToUpload, setWantsToUpload] = useState<boolean>(false);

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

	const handleVideoUpload = async () => {
		setVideoData({
			video: video as imagePicker.ImagePickerAsset[],
			cover: cover as imagePicker.ImagePickerAsset[], // Use cover state
			title, // Use title state
			description, // Use description state
			tags, // Use tags state
			ratio: sourceRatio, // ratio the user claimed the source to be
		});

		setWantsToUpload(true);
	};

	useEffect(() => {
		if (!videoData.video && !videoData.cover && !wantsToUpload) return;

		const upload = async () => {
			const token = await getToken();

			if (!token || !user?.id || !wantsToUpload) return;

			setUploadingProgress(0);
			setErrorUploadingSource(false);
			setUploadingModalVisible(true);

			const result = await uploadSource(
				{
					path: videoData.video[0].uri,
					// @ts-ignore
					duration: Math.floor(videoData.video[0].duration / 1000) ?? 0,
					width: videoData.video[0].width,
					height: videoData.video[0].height,
				},
				{
					width: videoData.cover[0].width,
					height: videoData.cover[0].height,
					path: videoData.cover[0].uri,
					orientation: 'portrait', // do not need this information
					isMirrored: false,
					isRawPhoto: false,
				},
				token as string,
				user?.id as string,
				setUploadingProgress,
				setErrorUploadingSource,
				{
					type: 'Video',
					userId: user.id,
					data: {
						title: videoData.title,
						description: videoData.description,
						tags: videoData.tags,
					},
				},
			);

			await sleep(300);
			setUploadingModalVisible(false);
			setWantsToUpload(false);
			setUploadingProgress(0);

			// do a cool animation on the modal that upload is finished

			if (result) {
				router.navigate('/(auth)/(tabs)/homePages');
			}

			return result;
		};

		upload();

		return () => {};
	}, [wantsToUpload]);

	useEffect(() => {
		if (!errorUploadingSource) return;

		setUploadingModalVisible(false);
		setErrorUploadingSource(false);
		Alert.alert('Something went wrong uploading the post');
	}, [errorUploadingSource]);

	const [currentSelectedSegment, setCurrentSelectedSegment] =
		useState<CreatePostType>(CreatePostType.video);

	const previewClickEventHandler = () => {};

	const handleOptionPress = (option: string) => {
		setCurrentSelectedSegment(option as CreatePostType);

		switch (option as CreatePostType) {
			case CreatePostType.video:
				router.push('/(auth)/(tabs)/createPages/createVideo');

				break;

			case CreatePostType.article:
				router.push('/(auth)/(tabs)/createPages/createArticle');

				break;

			case CreatePostType.post:
				router.push('/(auth)/(tabs)/createPages/createTextPost');

				break;
		}
	};

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={
						<Link
							style={{}}
							asChild
							href={{
								params: { first: helpPageParameter.createVideo },
								pathname: '/modals/help_modal',
							}}>
							<TouchableOpacity>
								<Ionicons
									name="help-circle-outline"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</Link>
					}
					// headerCenter={
					// <View style={{ flex: 0 }}>
					// 	<SegmentedControl
					// 		theme={theme}
					// 		options={[
					// 			CreatePostType.video,
					// 			CreatePostType.post,
					// 			CreatePostType.article,
					// 		]}
					// 		selectedOption={currentSelectedSegment}
					// 		onOptionPress={handleOptionPress}
					// 	/>
					// </View>
					// }
				/>
			}
			scrollChildren={
				<View style={{ flex: 1 }}>
					<TransparentLoadingScreen
						visible={uploadingModalVisible}
						progress={uploadingProgress}
					/>

					<ThemedView theme={theme} flex={1} style={{}}>
						<CreatePageHeader
							title={'Create Video'}
							handleUploadClickEvent={handleVideoUploadClickEvent}
							previewClickEventHandler={previewClickEventHandler}
							style={{ paddingHorizontal: 12 }}
						/>
						<CreateVideoMainContent
							setVideo={setVideo}
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
							sourceRatio={sourceRatio}
							setSourceRatio={setSourceRatio}
						/>
					</ThemedView>
				</View>
			}
		/>
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
	setVideo,
	sourceRatio,
	setSourceRatio,
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
	setVideo: React.Dispatch<
		React.SetStateAction<imagePicker.ImagePickerAsset[] | undefined | string>
	>;
	sourceRatio: upload_source_ratio;
	setSourceRatio: Dispatch<SetStateAction<upload_source_ratio>>;
}) => {
	const theme = useSystemTheme();
	const scrollViewRef = useRef<ScrollView>(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<modal_mode | undefined>();

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
			const { uri, width, height } = await VideoThumbnails.getThumbnailAsync(
				uploadedSource[0].uri,
				{
					time: currentTime,
				},
			);

			setCover([{ width, height, uri }]);
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
					setVideo={setVideo}
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
						<View style={[styles.Container1, styles.InputContainer]}>
							<ThemedTextInput
								value={title}
								placeholder="Enter the video title here"
								theme={theme}
								setValue={setTitle}
							/>
						</View>

						<View style={[styles.Container2, styles.InputContainer]}>
							<View style={{ gap: 24, marginBottom: 12 }}>
								{uploadedSource ? (
									<UploadedSourceContainer
										removeSource={removeSource}
										uploadedSource={uploadedSource}
										SourceMode="Source"
										ref={videoPlayerRef}
										sourceRatio={sourceRatio}
									/>
								) : (
									<PostTypeButton
										fontStyle={{ color: Colors[theme].textPrimaryReverse }}
										style={{ width: '100%' }}
										val="Upload Video"
										click_action={() => handleModal('Source')}
									/>
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
											flexDirection: 'column',
											gap: 12,
										}}>
										<PostTypeButton
											fontStyle={{ color: Colors[theme].primary }}
											style={[defaultStyles.outlinedBtn, { width: '100%' }]}
											val="Upload Cover"
											click_action={() => handleModal('Cover')}
										/>

										{uploadedSource && (
											<PostTypeButton
												fontStyle={{ color: Colors[theme].primary }}
												style={[defaultStyles.outlinedBtn, { width: '100%' }]}
												val="Grab cover from current frame"
												click_action={() => grabCoverFromCurrentFrame()}
											/>
										)}
									</View>
								)}
							</View>
						</View>

						<CreateVideoTextInputs
							setDescription={setDescription}
							description={description}
							scrollViewRef={scrollViewRef as React.RefObject<ScrollView>}
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
	const { bottom } = useSafeAreaInsets();

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
	const snapPoints = useMemo(() => ['55%'], []);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetRef.current?.present();

		setTagsLeft((prev) => prev.filter((tag) => !tags?.includes(tag)));
	}, [scrollViewRef, tagsLeft, tags]);

	const handlCloseModalPress = useCallback(() => {
		bottomSheetRef.current?.close();
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

	return (
		<View>
			<BottomSheetModal
				index={1}
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background2,
				}}
				ref={bottomSheetRef}>
				<BottomSheetView>
					<View
						style={{
							flexDirection: 'column',
							gap: 12,
							paddingHorizontal: 18,
							paddingVertical: 18,
							paddingBottom: 52,
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
												key={tag}
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

			<View style={[styles.Container3, styles.InputContainer]}>
				<ThemedTextInput
					containerStyle={{ width: '100%' }}
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
					makeWordToBubble={false}
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
							style={{ color: 'gray', fontSize: 16 }}
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

					<VideoUIBtns
						theme={theme}
						handleVideoPlayer={handleVideoPlayer}
						isPlaying={isPlaying}
					/>
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
		paddingVertical: 8,
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
		flex: 1,
	},
});

export default CreateVideo;
