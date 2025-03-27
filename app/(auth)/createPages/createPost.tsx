import CreatePageHeader from '@/components/create/CreatePageHeader';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { TextInputMaxCharacters, upload_source_ratio } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import * as imagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import PagerView from 'react-native-pager-view';
import UploadVideoModal from '@/app/modals/uploadVideoModal';

const CreateTextPost = () => {
	const theme = useSystemTheme();

	const [modalVisible, setModalVisible] = useState<boolean>(false);

	const [text, setText] = useState<string>('');
	const [uploadedImages, setUploadedImages] = useState<
		imagePicker.ImagePickerAsset[]
	>([
		{
			assetId: null,
			base64: null,
			duration: null,
			exif: null,
			fileName: '7956f1a1-b270-443e-87b7-6029077a60cd.jpeg',
			fileSize: 35065,
			height: 1440,
			mimeType: 'image/jpeg',
			type: 'image',
			uri: 'file:///data/user/0/com.anonymous.crahapp/cache/ImagePicker/7956f1a1-b270-443e-87b7-6029077a60cd.jpeg',
			width: 1440,
		},
		{
			assetId: null,
			base64: null,
			duration: null,
			exif: null,
			fileName: '7956f1a1-b270-443e-87b7-6029077a60cd.jpeg',
			fileSize: 35065,
			height: 1440,
			mimeType: 'image/jpeg',
			type: 'image',
			uri: 'file:///data/user/0/com.anonymous.crahapp/cache/ImagePicker/7956f1a1-b270-443e-87b7-6029077a60cd.jpeg',
			width: 1440,
		},
	]);
	const [sourceRatio, setSourceRatio] = useState<upload_source_ratio>(
		upload_source_ratio.SQUARE,
	);

	const multiplicator = 1;
	const [dynamicDimensions, setDynamicDimensions] = useState<{
		width: number | string;
		height: number;
	}>({
		width:
			sourceRatio == upload_source_ratio.PORTRAIT
				? Dimensions.get('window').width * multiplicator * (9 / 16)
				: '100%',
		height:
			sourceRatio != upload_source_ratio.SQUARE
				? sourceRatio == upload_source_ratio.PORTRAIT
					? Dimensions.get('window').height *
					  (Dimensions.get('window').width / Dimensions.get('window').height) *
					  multiplicator
					: (Dimensions.get('window').width / (16 / 9)) * multiplicator
				: Dimensions.get('window').width * multiplicator,
	});

	const handleImagesModal = () => {};

	const handleMusicModal = () => {};

	const handlePostUploadClickEvent = () => {};

	const previewClickEventHandler = () => {};

	return (
		<ThemedView flex={1} theme={theme}>
			<ScrollView>
				<KeyboardAwareScrollView
					scrollEnabled={false}
					contentContainerStyle={[styles.scrollContainer]}>
					<UploadVideoModal
						isVisible={modalVisible}
						setVisibility={setModalVisible}
						setUploadedImage={setUploadedImages} // we do not use it here. It works as a void filler and typescript error avoider
						setUploadedCover={setUploadedImages}
						uploadMode={'Cover'}
						setSourceRatio={setSourceRatio}
						cover={uploadedImages}
					/>

					<ThemedView style={[styles.container]} theme={theme} flex={1}>
						<CreatePageHeader
							title={'Create Post'}
							handleUploadClickEvent={handlePostUploadClickEvent}
							previewClickEventHandler={previewClickEventHandler}
						/>
						{/* first container */}
						<ThemedView
							style={[
								defaultStyles.surface_container,
								{ backgroundColor: Colors[theme].container_surface },
							]}
							theme={theme}>
							<ThemedTextInput
								value={text}
								setValue={setText}
								theme={theme}
								placeholder="Your Text..."
								maxLength={TextInputMaxCharacters.BigDescription}
								showLength={true}
								style={{ flexWrap: 'wrap' }}
								lines={22}
								multiline={true}
							/>

							{/* footer of first container */}
							<View style={{ gap: 8 }}>
								<TouchableOpacity onPress={() => setModalVisible(true)}>
									<ThemedText
										value="Upload images"
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
							</View>
						</ThemedView>
						{/*  */}

						{uploadedImages && (
							<View style={{ gap: 8, flexDirection: 'column', marginTop: 8 }}>
								<ThemedText
									theme={theme}
									value={'Your uploaded images:'}
									style={[defaultStyles.biggerText, { fontSize: 18 }]}
								/>
								<PagerView initialPage={0}>
									{/* {uploadedImages.map((value, index) => ( */}
									<View
										key={`${1}`}
										style={[
											{
												alignItems: 'center',
												justifyContent: 'center',
												backgroundColor: Colors[theme].textPrimary,
												width: dynamicDimensions.width as number,
												height: dynamicDimensions.height,
											},
										]}>
										<Image
											resizeMode={'cover'}
											style={{
												width: dynamicDimensions.width as number,
												height: dynamicDimensions.height,
											}}
											source={{ uri: uploadedImages[0].uri }}
										/>
									</View>
									{/* ))} */}
								</PagerView>
							</View>
						)}
					</ThemedView>
				</KeyboardAwareScrollView>
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		paddingTop: 12,
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width - 24,
	},
});

export default CreateTextPost;
