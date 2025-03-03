import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { ionicon } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Modal,
	Dimensions,
	Alert,
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
	uploadedImage: imagePicker.ImagePickerAsset[] | undefined;
	removeImage?: () => void;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
	isVisible,
	setVisibility,
	setUploadedImage,
	uploadedImage,
	removeImage,
}) => {
	const theme = useSystemTheme();

	const uploadFromGallery = async () => {
		await imagePicker.requestMediaLibraryPermissionsAsync();
		let result = await imagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		return result;
	};

	const uploadFromCamera = async () => {
		await imagePicker.requestCameraPermissionsAsync();
		let result = await imagePicker.launchCameraAsync({
			mediaTypes: ['images'],
			cameraType: imagePicker.CameraType.back,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		return result;
	};

	const uploadSource = async (mode: upload_mode) => {
		try {
			let result =
				mode == upload_mode.Camera
					? await uploadFromCamera()
					: await uploadFromGallery();

			if (!result?.canceled) {
				await saveSource(result?.assets);
			}
		} catch (error: any) {
			console.warn(error);
		}
	};

	const saveSource = async (
		image: imagePicker.ImagePickerAsset[] | undefined,
	) => {
		try {
			if (image) {
				setUploadedImage(image);
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
							value={'Upload Video'}
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.2,
		borderRadius: 12,
	},
	header: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '35%',
	},
	main: {
		flexDirection: 'row',
		height: '65%',
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
});

export default UploadVideoModal;
