import { AudioFile } from '@/types';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

interface PlayAudioInstanceProps {
	isPlayingAudio: boolean;
	setIsPlayingAudio: Dispatch<SetStateAction<boolean>>;
	recordedAudio: AudioFile | null;
}

const PlayAudioInstance: React.FC<PlayAudioInstanceProps> = ({
	isPlayingAudio,
	setIsPlayingAudio,
	recordedAudio,
}) => {
	const audioPlayer = useAudioPlayer(
		// recordedAudio?.path
		'https://pub-78edb5b6f0d946d28db91b59ddf775af.r2.dev/user_2xEVfOKU1aRCbf3XD1PYLJzeBOh/caafd9e8-9ccd-4218-bba0-3411a7a7e0b0/untitled.wav',
	);

	useEffect(() => {
		// playAudio();
	}, [isPlayingAudio]);

	useEffect(() => {
		setIsPlayingAudio(audioPlayer.playing);
	}, [audioPlayer.playing]);

	return <View></View>;
};

const styles = StyleSheet.create({});

export default PlayAudioInstance;
