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
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Modal,
	Dimensions,
} from 'react-native';
import * as imagePicker from 'expo-image-picker';

enum upload_mode {
	Camera = 'camera',
	Gallery = 'gallery',
}

const options: { text: upload_mode; icon: ionicon }[] = [
	{
		text: upload_mode.Camera,
		icon: 'camera-outline',
	},
	{
		text: upload_mode.Gallery,
		icon: 'image-outline',
	},
];

interface UploadVideoModalProps {
	isVisible: boolean;
	setVisibility: (visible: boolean) => void;
	setUploadedImage: (assets: imagePicker.ImagePickerAsset[]) => void;
	setUploadedCover: (assets: imagePicker.ImagePickerAsset[]) => void;
	uploadMode: modal_mode | undefined;
	setSourceRatio: (ratio: upload_source_ratio) => void;
	uploadedSource: imagePicker.ImagePickerAsset[] | undefined;
	cover: imagePicker.ImagePickerAsset[] | undefined | string;
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
}) => {
	const theme = useSystemTheme();

	const [selectedRatio, setSelectedRatio] = useState<upload_source_ratio>(
		upload_source_ratio.SQUARE,
	);

	// prettier-ignore
	const [ratioInputOptions, setRatioInputOptions] = useState<
	upload_source_ratio[]
>(Object.values(upload_source_ratio));

	useEffect(() => {
		// console.log(uploadedSource, cover, 'lol');
		if (uploadedSource == undefined && cover == undefined) {
			setRatioInputOptions(Object.values(upload_source_ratio));
		} else {
			setRatioInputOptions([selectedRatio]);
		}
	}, [uploadedSource, cover]);

	useEffect(() => {
		if (!selectedRatio) return;

		setSourceRatio(selectedRatio);
		console.log(selectedRatio);
	}, [selectedRatio]);

	const uploadFromGallery = async (mediatype: imagePicker.MediaType) => {
		await imagePicker.requestMediaLibraryPermissionsAsync();
		let result = await imagePicker.launchImageLibraryAsync({
			mediaTypes: [mediatype],
			allowsEditing: true,
			aspect: mediaTypeSourceRatio[selectedRatio],
			allowsMultipleSelection: false,
			quality: 1,
		});

		return result;
	};

	const uploadFromCamera = async (mediatype: imagePicker.MediaType) => {
		await imagePicker.requestCameraPermissionsAsync();
		let result = await imagePicker.launchCameraAsync({
			mediaTypes: [mediatype],
			cameraType: imagePicker.CameraType.back,
			allowsEditing: true,
			aspect: mediaTypeSourceRatio[selectedRatio],
			allowsMultipleSelection: false,
			quality: 1,
		});

		return result;
	};

	const uploadSource = async (
		mode: upload_mode,
		setStateFunction: (assets: imagePicker.ImagePickerAsset[]) => void,
		mediatype: imagePicker.MediaType,
	) => {
		try {
			let result =
				mode == upload_mode.Camera
					? await uploadFromCamera(mediatype)
					: await uploadFromGallery(mediatype);

			if (!result?.canceled) {
				await saveSource(result?.assets, setStateFunction);
			}
		} catch (error: any) {
			console.warn(error);
		}
	};

	const saveSource = async (
		image: imagePicker.ImagePickerAsset[] | undefined,
		setStateFunction: (assets: imagePicker.ImagePickerAsset[]) => void,
	) => {
		try {
			if (image) {
				setStateFunction(image);
				setVisibility(false);
			} else {
				console.log('object');
			}
		} catch (error) {
			throw error;
		}
	};

	return (
		<Modal
			presentationStyle="overFullScreen"
			animationType="fade"
			visible={isVisible}
			transparent
			style={[styles.modal, { display: 'flex' }]}>
			{/* full screen background */}
			<TouchableOpacity
				activeOpacity={1}
				onPress={() => setVisibility(false)}
				style={[styles.background, { backgroundColor: '#000000cc' }]}>
				{/* content */}
				<ThemedView
					theme={theme}
					style={[
						styles.container,
						{ backgroundColor: Colors[theme].surface },
					]}>
					{/* header */}
					<View style={[styles.header]}>
						<ThemedText
							value={`Upload ${uploadMode == 'Cover' ? 'Cover' : 'Video'}`}
							theme={theme}
							style={[defaultStyles.biggerText]}
						/>
					</View>

					{/* main */}
					<View style={[styles.main]}>
						{options.map((val, key) => (
							<TouchableOpacity
								onPress={() =>
									uploadSource(
										val.text === upload_mode.Gallery
											? upload_mode.Gallery
											: upload_mode.Camera,

										uploadMode === 'Source'
											? setUploadedImage
											: setUploadedCover,

										uploadMode === 'Source' ? 'videos' : 'images',
									)
								}
								key={key}
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

					{/* footer */}
					<View style={styles.footer}>
						{ratioInputOptions.map(
							(value: upload_source_ratio, key: number) => {
								return (
									<TouchableOpacity
										key={key}
										onPress={() => setSelectedRatio(value)}
										style={[
											styles.btn,
											{ backgroundColor: Colors[theme].background },
											{ padding: 12, width: 64, height: 48, borderWidth: 1 },
											{
												borderColor:
													selectedRatio === value
														? Colors[theme].primary
														: 'transparent',
											},
										]}>
										<ThemedText value={value} theme={theme} />
									</TouchableOpacity>
								);
							},
						)}
					</View>
					{/*  */}
				</ThemedView>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		width: Dimensions.get('window').width * 1,
		height: Dimensions.get('window').height * 1,
		backgroundColor: 'pink',
		flex: 1,
	},
	background: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	container: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.3,
		flexDirection: 'column',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 32,
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 'auto',
	},
	main: {
		flexDirection: 'row',
		height: 'auto',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: 20,
		marginTop: 0,
	},
	btn: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		borderRadius: 12,
		gap: 5,
	},
	footer: {
		padding: 0,
		flexDirection: 'row',
		gap: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default UploadVideoModal;
