import Tag from '@/components/tag';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Tags, TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as imagePicker from 'expo-image-picker';

import UploadVideoModal from '@/app/modals/uploadVideoModal';

import placeholderImage from '@/assets/images/crah.png';

const CreateVideo = () => {
	const theme = useSystemTheme();
	const insets = useSafeAreaInsets();

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [tags, setTags] = useState<{}>();

	const [video, setVideo] = useState();
	const [cover, setCover] = useState();

	const [modalVisible, setModalVisible] = useState(false);

	const AddTag = () => {};

	const RemoveTag = () => {};

	const [uploadedSource, setUploadedSource] = useState<
		imagePicker.ImagePickerAsset[] | undefined
	>();

	const removeSource = async () => {
		try {
			setUploadedSource(undefined);
		} catch (error: any) {
			Alert.alert(error.message);
			setModalVisible(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
			<UploadVideoModal
				isVisible={modalVisible}
				setVisibility={setModalVisible}
				setUploadedImage={setUploadedSource}
				uploadedImage={uploadedSource}
			/>

			<ThemedView theme={theme} flex={1} style={[styles.container]}>
				<View style={[styles.headerContainer]}>
					<ThemedText
						theme={theme}
						value={'Create Video'}
						style={defaultStyles.biggerText}
					/>
					<Ionicons
						size={24}
						color={Colors[theme].textPrimary}
						name="send-outline"
					/>
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
							<View
								style={[styles.Container2, styles.InputContainer, { gap: 12 }]}>
								{uploadedSource ? (
									<View
										style={[
											styles.videoWrapper,
											{ backgroundColor: Colors[theme].surface },
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
													uploadedSource[0].fileName?.toString() ||
													'Your uploaded video'
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

										<Image
											width={200}
											height={200}
											source={{
												uri: uploadedSource[0].uri || placeholderImage,
											}}
										/>
									</View>
								) : (
									<TouchableOpacity onPress={() => setModalVisible(true)}>
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

								<TouchableOpacity>
									<ThemedText
										value={'Upload cover'}
										theme={theme}
										style={[defaultStyles.outlinedBtn, { padding: 8 }]}
									/>
								</TouchableOpacity>
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

const styles = StyleSheet.create({
	container: {
		flex: 0,
		height: Dimensions.get('window').height,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingTop: 12,
		paddingBottom: 12,
		// width: Dimensions.get('window').width,
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
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		paddingTop: 8,
		borderRadius: 5,
	},
});

export default CreateVideo;
