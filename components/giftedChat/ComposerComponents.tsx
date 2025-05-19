import Colors from '@/constants/Colors';
import {
	chatCostumMsgType,
	ChatFooterBarTypes,
	ChatMessage,
	selectedRiderInterface,
	selectedTrickInterface,
	urlRegex,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
import { SendProps } from 'react-native-gifted-chat';
import CameraComponent from './CameraComponent';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { uploadSource } from '@/hooks/bucketUploadManager';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';
import { useUser } from '@clerk/clerk-expo';
import {
	AudioModule,
	AudioRecorder,
	RecordingPresets,
	RecordingStatus,
	useAudioPlayer,
	useAudioRecorder,
} from 'expo-audio';

interface RenderSendTextProps {
	props: SendProps<ChatMessage>;
	attachedMessageType: ChatFooterBarTypes | undefined;
	selectedRiderData: selectedRiderInterface | undefined;
	selectedTrickData: selectedTrickInterface | undefined;
	isReply: boolean;
	replyToMessageId: string | undefined;
	image: PhotoFile | undefined;
	video: VideoFile | undefined;
	setLoadingSourceProgress: (progress: number) => void;
	setLoadingSourceModalVisible: (visible: boolean) => void;
}

export const RenderSendText: React.FC<RenderSendTextProps> = ({
	props,
	attachedMessageType,
	selectedRiderData,
	selectedTrickData,
	isReply,
	replyToMessageId,
	image,
	video,
	setLoadingSourceProgress,
	setLoadingSourceModalVisible,
}) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	let message: Partial<ChatMessage> = {
		text: props.text!.trim(),
		isReply: isReply,
		replyToMessageId: replyToMessageId,
	};

	// const internetLinks: RegExpMatchArray | [] =
	// 	props.text!.trim()?.match(urlRegex) ?? [];
	// const isInternetLink: boolean = internetLinks.length > 0;

	useEffect(() => {
		console.log(video);

		return () => {};
	}, []);

	useEffect(() => {
		console.log(video);

		switch (attachedMessageType) {
			case 'RiderRow':
				message.type = chatCostumMsgType.rider;
				// @ts-ignore
				message.riderId = selectedRiderData?._id;
				break;

			case 'TrickRow':
				message.type = chatCostumMsgType.trick;
				message.trickId = selectedTrickData?.id;
				break;

			case 'Audio':
				message.type = chatCostumMsgType.text;
				message.audio = '';
				break;

			case 'Source':
				message.type = chatCostumMsgType.text;
				message.image = image?.path;
				message.video = video?.path;
				break;

			case undefined:
				message.type = chatCostumMsgType.text;
				break;
		}
	}, [props]);

	// useEffect(() => {
	// 	if (isInternetLink) {
	// 		// message.video = internetLinks[0];
	// 		message.type = chatCostumMsgType.text;
	// 	}
	// }, [internetLinks]);

	const handleSendMessage = async () => {
		// console.log(video);

		if (
			!((props.text && props.text.trim()) || attachedMessageType !== undefined)
		)
			return;

		console.log(video);

		if (video) {
			setLoadingSourceModalVisible(true);

			const recievedVideoUrl = await uploadSource(
				video,
				process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
				user?.id as string,
				setLoadingSourceProgress,
			);

			message.video = recievedVideoUrl as string;
		}

		if (image) {
			setLoadingSourceModalVisible(true);

			const recievedImageUrl = await uploadSource(
				image,
				process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
				user?.id as string,
				setLoadingSourceProgress,
			);

			message.image = recievedImageUrl as string;
		}

		setLoadingSourceModalVisible(false);
		props.onSend!(message, true);
	};

	return (
		<TouchableOpacity
			onPress={handleSendMessage}
			style={{ paddingHorizontal: 14 }}>
			<Ionicons
				name="send-outline"
				size={24}
				color={Colors[theme].textPrimary}
			/>
		</TouchableOpacity>
	);
};

export const RenderSendEmptyText: React.FC<{
	props: any;
	chatId: string;
	useCamera: boolean;
	setUseCamera: (use: boolean) => void;
	audioRecorder: AudioRecorder;
}> = ({ props, chatId, useCamera, setUseCamera, audioRecorder }) => {
	const theme = useSystemTheme();

	const [isRecording, setIsRecording] = useState(false);

	// const player = createAudioPlayer(audioSource); // to play audio

	const handleCamera = () => {
		setUseCamera(true);
	};

	const record = async () => {
		await audioRecorder.prepareToRecordAsync();
		audioRecorder.record();
		setIsRecording(true);
	};

	const stopRecording = async () => {
		// The recording will be available on `audioRecorder.uri`.
		await audioRecorder.stop();
		setIsRecording(false);
	};

	useEffect(() => {
		(async () => {
			const status = await AudioModule.requestRecordingPermissionsAsync();
			if (!status.granted) {
				Alert.alert('Permission to access microphone was denied');
			}
		})();
	}, []);

	return (
		<View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}>
			<TouchableOpacity onPress={handleCamera}>
				<View>
					<Ionicons
						name="camera-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>

			<TouchableOpacity onPress={isRecording ? stopRecording : record}>
				<View>
					<Ionicons
						name={isRecording ? 'mic-outline' : 'mic-off-outline'}
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};
