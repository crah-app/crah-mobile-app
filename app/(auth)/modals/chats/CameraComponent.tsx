import React, { useEffect, useRef, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Button,
	Image,
	ImageBackground,
} from 'react-native';

import * as MediaLibrary from 'expo-media-library';
import {
	Camera,
	CameraType,
	CameraView,
	CameraViewRef,
	FlashMode,
	useCameraPermissions,
} from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import CameraVideoView from '@/components/giftedChat/CameraVideoView';
import { Asset, getAlbumsAsync, getAssetsAsync } from 'expo-media-library';

const CameraComponent = () => {
	const { page, chatId } = useLocalSearchParams(); // page: Page which calls the camera page

	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);

	const [isRecording, setIsRecording] = useState<boolean>(false);

	const [image, setImage] = useState<string | undefined>(undefined);
	const [video, setVideo] = useState<string | undefined>(undefined);

	const [cameraType, setCameraType] = useState<CameraType>('back');
	const [flash, setFlash] = useState<FlashMode>('off');
	const [zoom, setZoom] = useState<number>(0);

	useEffect(() => {
		const permissions = async () => {
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			const soundStatus = await Camera.requestMicrophonePermissionsAsync();

			if (!permission || !cameraStatus || !soundStatus) {
				// Camera permissions are still loading.
				return <View />;
			}

			if (
				!permission.granted ||
				!cameraStatus.granted ||
				!soundStatus.granted
			) {
				// Camera permissions are not granted yet.
				return (
					<View style={styles.container}>
						<Text style={styles.message}>
							We need your permission to show the camera
						</Text>
						<Button onPress={requestPermission} title="grant permission" />
					</View>
				);
			}
		};

		permissions();
	}, []);

	const startRecording = async () => {
		if (!cameraRef.current || isRecording) return;

		try {
			setIsRecording(true);
			const recorded = await cameraRef.current.recordAsync();
			console.log('Recorded video:', recorded);
			setVideo(recorded?.uri);
			setIsRecording(false);
		} catch (err) {
			console.warn('Recording error:', err);
			setIsRecording(false);
		}
	};

	const stopRecording = async () => {
		if (!cameraRef.current || !isRecording) return;

		try {
			cameraRef.current.stopRecording();
		} catch (err) {
			console.warn('Stop recording failed:', err);
		}
	};

	async function toggleRecord() {
		if (!cameraRef) return;

		console.log('toggle record', video);

		if (isRecording) {
			console.log('stop recording', video);

			cameraRef.current?.stopRecording();
			setIsRecording(false);
		} else {
			console.log('is recording', video);

			setIsRecording(true);
			const response = await cameraRef.current?.recordAsync();
			console.log(response);
			setVideo(response?.uri);
		}
	}

	const takePicture = async () => {
		if (!cameraRef) return;

		try {
			const data = await cameraRef.current?.takePictureAsync();
			console.log(data);
			setImage(data?.uri);
		} catch (error) {
			console.warn(error);
		}
	};

	const savePicture = async () => {
		if (!image) return;

		try {
			await MediaLibrary.createAssetAsync(image);
		} catch (error) {
			console.warn(error);
		}

		handleGoBack();
	};

	const saveVideo = () => {};

	const handleGoBack = () => {
		router.navigate({
			pathname: '/(auth)/(tabs)/homePages/chats/[id]',
			// @ts-ignore
			params: { id: chatId, video, image, fromCamera: true },
		});
	};

	return (
		<View style={styles.container}>
			{video ? (
				<CameraVideoView
					video={video}
					setVideo={setVideo}
					saveVideo={saveVideo}
				/>
			) : image ? (
				<ImageBackground source={{ uri: image }} style={styles.camera}>
					<View
						style={{
							flexDirection: 'row',
							gap: 12,
							justifyContent: 'center',
							alignItems: 'flex-end',
							flex: 1,
						}}>
						<View
							style={[
								styles.buttonContainer,
								{ justifyContent: 'space-around' },
							]}>
							<TouchableOpacity
								onPress={() => setImage(undefined)}
								style={styles.buttonBackground}>
								<Ionicons size={24} color={'white'} name={'refresh-outline'} />
							</TouchableOpacity>

							<TouchableOpacity
								onPress={savePicture}
								style={styles.buttonBackground}>
								<Ionicons
									size={24}
									color={'white'}
									name={'checkmark-outline'}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			) : (
				<CameraView
					zoom={zoom}
					facing={cameraType}
					style={styles.camera}
					flash={flash}
					ref={cameraRef}>
					<View style={styles.topContainer}>
						<TouchableOpacity
							style={styles.buttonBackground}
							onPress={() =>
								setCameraType((prev) => (prev === 'back' ? 'front' : 'back'))
							}>
							<Ionicons name={'repeat-outline'} size={24} color={'white'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonBackground}
							onPress={() =>
								setFlash((prev) => (prev === 'on' ? 'off' : 'on'))
							}>
							<Ionicons
								name={flash === 'on' ? 'flash' : 'flash-off-outline'}
								size={24}
								color={'white'}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.buttonContainer}>
						<Link
							href={'/modals/chats/MediaLibrary'}
							asChild
							style={styles.buttonBackground}>
							<Ionicons size={24} color={'white'} name={'images-outline'} />
						</Link>

						<TouchableOpacity
							// onLongPress={toggleRecord}
							// onPressOut={toggleRecord}
							style={[
								styles.mainButton,
								{ borderColor: isRecording ? 'red' : 'white' },
							]}
							onPress={takePicture}
						/>

						<TouchableOpacity
							// onLongPress={toggleRecord}
							// onPressOut={toggleRecord}
							style={[
								styles.mainButton,
								{ borderColor: isRecording ? 'red' : 'white' },
							]}
							onPress={toggleRecord}
						/>

						<TouchableOpacity
							style={styles.buttonBackground}
							onPress={router.back}>
							<Ionicons size={24} color={'white'} name={'close-outline'} />
						</TouchableOpacity>
					</View>
				</CameraView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'space-between',
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
		marginBottom: 32,
		paddingHorizontal: 30,
	},
	buttonBackground: {
		padding: 8,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 1000,
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	mainButton: {
		width: 78,
		height: 78,
		borderWidth: 6,
		borderColor: 'white',
		borderRadius: 1000,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
});

export default CameraComponent;
