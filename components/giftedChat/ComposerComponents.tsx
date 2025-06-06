import Colors from '@/constants/Colors';
import {
	AudioFile,
	chatCostumMsgType,
	ChatFooterBarTypes,
	ChatMessage,
	selectedRiderInterface,
	selectedTrickInterface,
	urlRegex,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View } from 'react-native';
import { Composer, ComposerProps, SendProps } from 'react-native-gifted-chat';
import CameraComponent from './CameraComponent';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { uploadSource } from '@/hooks/bucketUploadManager';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';
import { useUser } from '@clerk/clerk-expo';
import Row from '../general/Row';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { sleep } from '@/utils/globalFuncs';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';

interface RenderSendTextProps {
	props: SendProps<ChatMessage>;
	attachedMessageType: ChatFooterBarTypes | undefined;
	selectedRiderData: selectedRiderInterface | undefined;
	selectedTrickData: selectedTrickInterface | undefined;
	isReply: boolean;
	replyToMessageId: string | undefined;
	image: PhotoFile | undefined;
	video: VideoFile | undefined;
	setLoadingSourceProgress: Dispatch<SetStateAction<number>>;
	setLoadingSourceModalVisible: (visible: boolean) => void;
	audio: AudioFile | null;
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
	audio,
}) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	const [error, setError] = useState<boolean>(false);

	let message: Partial<ChatMessage> = {
		text: props.text!.trim(),
		isReply: isReply,
		replyToMessageId: replyToMessageId,
	};

	// const internetLinks: RegExpMatchArray | [] =
	// 	props.text!.trim()?.match(urlRegex) ?? [];
	// const isInternetLink: boolean = internetLinks.length > 0;

	useEffect(() => {
		switch (attachedMessageType) {
			case 'RiderRow':
				message.type = chatCostumMsgType.rider;
				// @ts-ignore
				message.riderId = selectedRiderData?._id;
				break;

			case 'TrickRow':
				message.type = chatCostumMsgType.trick;
				message.trickId = selectedTrickData?.Id;
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
		console.log('audio haha:', audio);

		if (
			!(
				(props.text && props.text.trim()) ||
				attachedMessageType !== undefined ||
				audio
			)
		)
			return;

		if (video) {
			setLoadingSourceModalVisible(true);

			const recievedVideoUrl = await uploadSource(
				video,
				null,
				process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
				user?.id as string,
				setLoadingSourceProgress,
				setError,
			);

			message.video = recievedVideoUrl as string;
		}

		if (image) {
			setLoadingSourceModalVisible(true);

			const recievedImageUrl = await uploadSource(
				image,
				null,
				process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
				user?.id as string,
				setLoadingSourceProgress,
				setError,
			);

			message.image = recievedImageUrl as string;
		}

		if (audio) {
			setLoadingSourceModalVisible(true);

			const recievedAudioUrl = await uploadSource(
				audio,
				null,
				process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
				user?.id as string,
				setLoadingSourceProgress,
				setError,
			);

			await sleep(500);

			message.audio = recievedAudioUrl as string;
			message.text = format(new Date(audio.duration * 1000), 'mm:ss');
		}

		setLoadingSourceModalVisible(false);
		props.onSend!(message, true);
	};

	return (
		<TouchableOpacity
			onPress={handleSendMessage}
			style={{
				paddingHorizontal: 14,
				alignItems: 'flex-end',
				justifyContent: 'flex-end',
			}}>
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
	isRecording: boolean;
	setIsRecording: Dispatch<SetStateAction<boolean>>;
	audio: AudioFile | null;
	setRecordedAudio: Dispatch<SetStateAction<AudioFile | null>>;
	audioRecorderPlayer: AudioRecorderPlayer;
}> = ({
	props,
	chatId,
	useCamera,
	setUseCamera,
	isRecording,
	setIsRecording,
	audio,
	setRecordedAudio,
	audioRecorderPlayer,
}) => {
	const theme = useSystemTheme();

	let [recordingDuration, setRecordingDuration] = useState<number>(0);

	const handleCamera = () => {
		setUseCamera(true);
	};

	const record = async () => {
		try {
			const uri = await audioRecorderPlayer.startRecorder();
			console.log('Recording started at:', uri);

			audioRecorderPlayer.addRecordBackListener((e) => {
				setRecordingDuration(e.currentPosition);
				return;
			});

			setIsRecording(true);
		} catch (err) {
			console.warn('Error while starting recorder:', err);
		}
	};

	const stopRecording = async () => {
		try {
			const rawResult = await audioRecorderPlayer.stopRecorder();
			audioRecorderPlayer.removeRecordBackListener();
			const cleanedPath = rawResult.replace(/^file:\/+/, '/');
			console.log('Recording stopped, file saved to:', cleanedPath);

			setIsRecording(false);

			// Pfad in `file://`-Format für Anzeige oder Weitergabe
			const finalPath = 'file://' + cleanedPath;

			const fileInfo = await FileSystem.getInfoAsync(finalPath);
			console.log('File info:', fileInfo);

			if (!fileInfo.exists) {
				console.warn('⚠️ Datei existiert nicht:', finalPath);
				return;
			}

			console.log(recordingDuration, 'recordiunngduration');

			setRecordedAudio({
				width: 0,
				height: 0,
				duration: Math.floor(recordingDuration / 1000),
				path: finalPath, // für Anzeige
			});
		} catch (err) {
			console.warn('Error while stopping recorder:', err);
		}
	};

	return (
		<View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}>
			{!isRecording && !audio?.path && (
				<TouchableOpacity onPress={handleCamera}>
					<View>
						<Ionicons
							name="camera-outline"
							size={24}
							color={Colors[theme].textPrimary}
						/>
					</View>
				</TouchableOpacity>
			)}

			<TouchableOpacity onPress={isRecording ? stopRecording : record}>
				<View>
					<Ionicons
						name={isRecording ? 'checkmark-outline' : 'mic-outline'}
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

interface RenderComposerProps {
	props: ComposerProps;
	theme: 'light' | 'dark';
	audio: AudioFile | null;
	isRecording: boolean;
	setIsRecording: Dispatch<SetStateAction<boolean>>;
}

export const RenderComposer: React.FC<RenderComposerProps> = ({
	props,
	theme,
	audio,
	isRecording,
	setIsRecording,
}) => {
	if (isRecording) {
		return (
			<Composer
				{...props}
				textInputStyle={{ color: Colors[theme].textPrimary }}
				text="Recording audio..."
			/>
		);
	}

	if (audio) {
		return (
			<Composer
				{...props}
				textInputStyle={{ color: Colors[theme].textPrimary }}
				text={`Recorded audio ${format(
					new Date(audio.duration * 1000),
					'mm:ss',
				)}`}
			/>
		);
	}

	return (
		<Composer
			{...props}
			textInputStyle={{ color: Colors[theme].textPrimary }}
		/>
	);
};
