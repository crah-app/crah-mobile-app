import React, { useEffect, useRef, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Image,
	ImageBackground,
	Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	useCameraPermission,
	Camera,
	useCameraDevice,
	PhotoFile,
	VideoFile,
	CameraDevice,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams, Link } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import CameraVideoView from '@/components/giftedChat/CameraVideoView';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import Colors from '@/constants/Colors';

export const CameraComponent: React.FC<{
	setUseCamera: (use: boolean) => void;
	image: PhotoFile | undefined;
	video: VideoFile | undefined;
	setImage: (image: PhotoFile | undefined) => void;
	setVideo: (video: VideoFile | undefined) => void;
}> = ({ setUseCamera, image, video, setImage, setVideo }) => {
	const theme = useSystemTheme();

	const { page, chatId } = useLocalSearchParams();
	const camera = useRef<Camera>(null);
	const [hasPermission, setHasPermission] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
		'back',
	);
	const device = useCameraDevice(cameraPosition);
	const isFocused = useIsFocused();

	useEffect(() => {
		(async () => {
			const cameraPermission = await Camera.requestCameraPermission();
			const micPermission = await Camera.requestMicrophonePermission();
			setHasPermission(
				cameraPermission === 'granted' && micPermission === 'granted',
			);
		})();
	}, []);

	const takePhoto = async () => {
		if (!camera.current) return;
		try {
			const photo: PhotoFile = await camera.current.takePhoto({
				flash: 'off',
			});
			console.log('Foto URI:', `file://${photo.path}`);
			setImage(photo);
		} catch (err) {
			console.error('Fehler beim Foto:', err);
		}
	};

	const startRecording = async () => {
		if (!camera.current || isRecording) return;
		try {
			setIsRecording(true);
			await camera.current.startRecording({
				onRecordingFinished: (video: VideoFile) => {
					console.log('Video aufgenommen:', video);
					setVideo(video);
				},
				onRecordingError: (error) => {
					console.error('Videoaufnahme-Fehler:', error);
				},
			});
		} catch (err) {
			console.error('Start recording failed:', err);
		}
	};

	const stopRecording = async () => {
		if (!camera.current || !isRecording) return;
		try {
			await camera.current.stopRecording();
			setIsRecording(false);
		} catch (err) {
			console.error('Stop recording failed:', err);
		}
	};

	const savePicture = async () => {
		if (!image) return;
		await MediaLibrary.createAssetAsync(`file://${image.path}`);
		handleGoBack();
	};

	const saveVideo = async (video: VideoFile | undefined) => {
		if (!video) return;
		setVideo(video);
		await MediaLibrary.createAssetAsync(`file://${video.path}`);
		handleGoBack();

		console.log(video);
	};

	const handleGoBack = () => {
		setUseCamera(false);
	};

	// if (!device || !hasPermission || !isFocused)
	// 	return <CrahActivityIndicator color={Colors[theme].primary} size={24} />;

	return (
		<View style={styles.container}>
			{/* in case currentUser took a photo or a video */}
			{video ? (
				<CameraVideoView
					video={video}
					setVideo={setVideo}
					saveVideo={saveVideo}
					theme={theme}
				/>
			) : image ? (
				<ImageBackground
					source={{ uri: `file://${image.path}` }}
					style={styles.camera}>
					<View style={[styles.buttonContainer, { marginBottom: 32 }]}>
						<TouchableOpacity
							onPress={() => setImage(undefined)}
							style={styles.buttonBackground}>
							<Ionicons size={24} color={'white'} name={'refresh-outline'} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={savePicture}
							style={styles.buttonBackground}>
							<Ionicons size={24} color={'white'} name={'checkmark-outline'} />
						</TouchableOpacity>
					</View>
				</ImageBackground>
			) : (
				// in case currentUser has not taken a photo/video
				<ThemedView theme={theme} style={styles.container} flex={1}>
					<Camera
						style={styles.camera}
						device={device as CameraDevice}
						isActive={isFocused}
						photo={true}
						video={true}
						audio={true}
						ref={camera}
					/>

					<View style={styles.actionContainer}>
						{/* top container */}
						<View style={styles.topContainer}>
							{/* change camera position button (front camera and back camera) */}
							<TouchableOpacity
								onPress={() =>
									setCameraPosition((prev) =>
										prev === 'back' ? 'front' : 'back',
									)
								}
								style={styles.buttonBackground}>
								<Ionicons name={'repeat-outline'} size={24} color={'white'} />
							</TouchableOpacity>

							<TouchableOpacity style={styles.buttonBackground}>
								<Ionicons name={'flash-outline'} size={24} color={'white'} />
							</TouchableOpacity>
						</View>

						{/* bottom container */}
						<View style={styles.buttonContainer}>
							{/* button for media library */}
							<Link
								href={'/modals/chats/MediaLibrary'}
								asChild
								style={styles.buttonBackground}>
								<Ionicons size={24} color={'white'} name={'images-outline'} />
							</Link>

							<TouchableOpacity
								onPress={takePhoto}
								onLongPress={startRecording}
								onPressOut={stopRecording}
								style={[
									styles.mainButton,
									{ borderColor: isRecording ? 'red' : 'white' },
								]}
							/>

							{/* close camera button */}
							<TouchableOpacity
								style={styles.buttonBackground}
								onPress={handleGoBack}>
								<Ionicons size={24} color={'white'} name={'close-outline'} />
							</TouchableOpacity>
						</View>
					</View>
				</ThemedView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	actionContainer: {
		position: 'absolute',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	camera: {
		flex: 1,
	},
	topContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 30,
		marginTop: 12,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginBottom: 68,
		paddingHorizontal: 30,
	},
	buttonBackground: {
		padding: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 1000,
	},
	mainButton: {
		width: 78,
		height: 78,
		borderWidth: 6,
		borderRadius: 1000,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
});

export default CameraComponent;
