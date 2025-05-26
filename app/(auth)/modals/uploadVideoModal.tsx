import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as imagePicker from 'expo-image-picker';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import {
	ionicon,
	mediaTypeSourceRatio,
	modal_mode,
	upload_source_ratio,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Modal from 'react-native-modal';

enum upload_mode {
	Camera = 'camera',
	Gallery = 'gallery',
}

const options: { text: upload_mode; icon: ionicon }[] = [
	{ text: upload_mode.Camera, icon: 'camera-outline' },
	{ text: upload_mode.Gallery, icon: 'image-outline' },
];

interface UploadVideoModalProps {
	isVisible: boolean;
	setVisibility: (visible: boolean) => void;
	setUploadedImage: (assets: imagePicker.ImagePickerAsset[]) => void;
	setUploadedCover: (assets: imagePicker.ImagePickerAsset[]) => void;
	uploadMode: modal_mode | undefined;
	setSourceRatio: (ratio: upload_source_ratio) => void;
	uploadedSource?: imagePicker.ImagePickerAsset[] | undefined;
	cover: imagePicker.ImagePickerAsset[] | undefined | string;
	setVideo: React.Dispatch<
		React.SetStateAction<imagePicker.ImagePickerAsset[] | undefined | string>
	>;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
	isVisible,
	setVisibility,
	setUploadedImage,
	setUploadedCover,
	uploadMode,
	setSourceRatio,
	uploadedSource,
	cover,
	setVideo,
}) => {
	const theme = useSystemTheme();

	const [selectedRatio, setSelectedRatio] = useState<upload_source_ratio>(
		upload_source_ratio.SQUARE,
	);
	const [ratioInputOptions, setRatioInputOptions] = useState<
		upload_source_ratio[]
	>(Object.values(upload_source_ratio));

	useEffect(() => {
		if (!uploadedSource && !cover) {
			setRatioInputOptions(Object.values(upload_source_ratio));
		} else {
			setRatioInputOptions([selectedRatio]);
		}
	}, [uploadedSource, cover]);

	useEffect(() => {
		if (selectedRatio) {
			setSourceRatio(selectedRatio);
		}
	}, [selectedRatio]);

	const uploadFromGallery = async (mediatype: imagePicker.MediaType) => {
		await imagePicker.requestMediaLibraryPermissionsAsync();
		return await imagePicker.launchImageLibraryAsync({
			mediaTypes: [mediatype],
			allowsEditing: true,
			aspect: mediaTypeSourceRatio[selectedRatio],
			allowsMultipleSelection: false,
			quality: 1,
		});
	};

	const uploadFromCamera = async (mediatype: imagePicker.MediaType) => {
		await imagePicker.requestCameraPermissionsAsync();
		return await imagePicker.launchCameraAsync({
			mediaTypes: [mediatype],
			cameraType: imagePicker.CameraType.back,
			allowsEditing: true,
			aspect: mediaTypeSourceRatio[selectedRatio],
			allowsMultipleSelection: false,
			quality: 1,
		});
	};

	const uploadSource = async (
		mode: upload_mode,
		setStateFunction: (assets: imagePicker.ImagePickerAsset[]) => void,
		mediatype: any,
	) => {
		try {
			const result =
				mode === upload_mode.Camera
					? await uploadFromCamera(mediatype)
					: await uploadFromGallery(mediatype);

			if (!result?.canceled) {
				await saveSource(result?.assets, setStateFunction);
			}
		} catch (error) {
			console.warn(error);
		}
	};

	const saveSource = async (
		image: imagePicker.ImagePickerAsset[] | undefined,
		setStateFunction: (assets: imagePicker.ImagePickerAsset[]) => void,
	) => {
		if (image) {
			console.log(uploadMode, 'uploadmode,asdf');
			if (uploadMode === 'Source') {
				console.log('your video: ', image);
				setVideo(image); // name is confusing. it can be image or video
			}

			setStateFunction(image);
			setVisibility(false);
		}
	};

	return (
		<Modal
			isVisible={isVisible}
			backdropOpacity={0.5}
			onBackdropPress={() => setVisibility(false)}
			statusBarTranslucent={false} // Entferne translucent, kann Probleme machen
			useNativeDriver={true}
			useNativeDriverForBackdrop={true}
			hideModalContentWhileAnimating={true}
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flex: 1,
			}}>
			<ThemedView
				theme={theme}
				style={[
					styles.container,
					{
						backgroundColor: Colors[theme].surface,
						width: '80%',
						height: '30%',
					},
				]}>
				<View style={styles.header}>
					<ThemedText
						value={`Upload ${uploadMode === 'Cover' ? 'Cover' : 'Video'}`}
						theme={theme}
						style={defaultStyles.biggerText}
					/>
				</View>

				<View style={styles.main}>
					{options.map((val, key) => (
						<TouchableOpacity
							key={key}
							onPress={() =>
								uploadSource(
									val.text === upload_mode.Gallery
										? upload_mode.Gallery
										: upload_mode.Camera,
									uploadMode === 'Source' ? setUploadedImage : setUploadedCover,
									uploadMode === 'Source' ? 'videos' : 'images',
								)
							}
							style={[
								styles.btn,
								{ backgroundColor: Colors[theme].background },
							]}>
							<Ionicons
								name={val.icon}
								size={24}
								color={Colors[theme].primary}
							/>
							<ThemedText value={val.text} theme={theme} />
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.footer}>
					{ratioInputOptions.map((value, key) => (
						<TouchableOpacity
							key={key}
							onPress={() => setSelectedRatio(value)}
							style={[
								styles.btn,
								styles.ratioBtn,
								{
									backgroundColor: Colors[theme].background,
									borderColor:
										selectedRatio === value
											? Colors[theme].primary
											: 'transparent',
								},
							]}>
							<ThemedText value={value} theme={theme} />
						</TouchableOpacity>
					))}
				</View>
			</ThemedView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		zIndex: 100,
	},
	background: {
		flex: 1,
		backgroundColor: '#000000cc',
		zIndex: 101,
	},
	container: {
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 32,
		zIndex: 102,
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	main: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: 20,
	},
	btn: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		borderRadius: 12,
		gap: 5,
	},
	footer: {
		flexDirection: 'row',
		gap: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ratioBtn: {
		padding: 12,
		width: 64,
		height: 48,
		borderWidth: 1,
	},
});

export default UploadVideoModal;
