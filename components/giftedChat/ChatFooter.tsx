import {
	ChatFooterBarTypes,
	ChatMessage,
	selectedRiderInterface,
	selectedTrickInterface,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '../general/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Row from '../general/Row';

import Scooter from '../../assets/images/vectors/scooter.svg';
import ThemedText from '../general/ThemedText';
import ReplyMessageBar from './ReplyMessageBar';

interface ChatFooterBarProps {
	msgType: ChatFooterBarTypes | undefined;
	displayFooter: boolean | undefined;
	trickData?: selectedTrickInterface;
	riderData?: selectedRiderInterface;
	sourceData?: any;
	audioData?: any;
	setDisplayFooter: (b: boolean) => void;
	setAttachedMessageType: (t: ChatFooterBarTypes | undefined) => void;
	setSelectedRiderData: (u: selectedRiderInterface | undefined) => void;
	setSelectedTrickData: (u: selectedTrickInterface | undefined) => void;
	setSelectedVideo: (source: string | undefined) => void;
	setSelectedImage: (source: string | undefined) => void;
	setReplyMessage: Dispatch<SetStateAction<ChatMessage | undefined>>;
	replyMessage: ChatMessage | undefined;
	isReply: boolean;
	replyToMessageId: string | undefined;
	setIsReply: (isReply: boolean) => void;
	setReplyMessageId: (id: string | undefined) => void;
}

const ChatFooterBar: React.FC<ChatFooterBarProps> = ({
	msgType,
	displayFooter,
	trickData,
	riderData,
	sourceData,
	audioData,
	setAttachedMessageType,
	setDisplayFooter,
	setSelectedRiderData,
	setSelectedTrickData,
	setReplyMessage,
	replyMessage,
	isReply,
	replyToMessageId,
	setIsReply,
	setReplyMessageId,
	setSelectedImage,
	setSelectedVideo,
}) => {
	const theme = useSystemTheme();

	const TrickRow = () => {
		return (
			<View style={{ backgroundColor: Colors[theme].container_surface }}>
				<Row
					showAvatar
					avatarIsSVG
					avatarUrl={Scooter}
					// @ts-ignore
					title={trickData?.name}
					subtitle={trickData?.difficulty}
					containerStyle={{
						backgroundColor: Colors[theme].container_surface,
					}}
				/>
			</View>
		);
	};

	const RiderRow = () => {
		return (
			<View style={{ backgroundColor: Colors[theme].container_surface }}>
				<Row
					showAvatar
					// @ts-ignore
					avatarUrl={riderData?.avatar}
					// @ts-ignore
					title={riderData?.name}
					subtitle={riderData?.rank + ' #' + riderData?.rankPosition}
					containerStyle={{ backgroundColor: Colors[theme].container_surface }}
				/>
			</View>
		);
	};

	const AudioRow = () => {
		return (
			<View style={{ backgroundColor: Colors[theme].container_surface }}>
				<Row
					title={'Audio'}
					subtitle="12 seconds"
					containerStyle={{ backgroundColor: Colors[theme].container_surface }}
				/>
			</View>
		);
	};

	const SourceRow = () => {
		if (sourceData.type === 'image') {
			return (
				<View style={{ backgroundColor: Colors[theme].container_surface }}>
					<Row
						showAvatar
						avatarUrl={sourceData.uri}
						title={'Image'}
						subtitle="image view"
						containerStyle={{
							backgroundColor: Colors[theme].container_surface,
						}}
					/>
				</View>
			);
		}

		// render video
		return <></>;
	};

	const ReplyRow = () => {
		return (
			<View>
				<ReplyMessageBar
					trickData={trickData}
					riderData={riderData}
					message={replyMessage}
				/>

				{/* when user wants to reply not with plain text but with a different 
				type of message such as trick, rider, audio or a source */}
				<RenderReplyRowAttachments />
			</View>
		);
	};

	const RenderReplyRowAttachments = () => {
		return (
			<View>
				{msgType === 'TrickRow' ? (
					<TrickRow />
				) : msgType === 'RiderRow' ? (
					<RiderRow />
				) : msgType === 'Audio' ? (
					<AudioRow />
				) : msgType === 'Source' ? (
					<SourceRow />
				) : (
					<></>
				)}
			</View>
		);
	};

	const abortAttachedMessage = () => {
		// data of attached message
		setSelectedRiderData(undefined);
		setSelectedTrickData(undefined);

		// message type
		setAttachedMessageType(undefined);

		// source
		setSelectedVideo(undefined);
		setSelectedImage(undefined);

		// reply to message data
		setReplyMessage(undefined);
		setIsReply(false);
		setReplyMessageId(undefined);
	};

	if (!displayFooter) return <></>;

	return (
		<ThemedView theme={theme}>
			<TouchableOpacity
				onPress={abortAttachedMessage}
				style={{
					zIndex: 1,
					position: 'absolute',
					right: 8,
					top: Dimensions.get('window').height * -0.0 + 8,
				}}>
				<Ionicons name="close" size={20} color={Colors[theme].textPrimary} />
			</TouchableOpacity>

			{isReply ? <ReplyRow /> : <RenderReplyRowAttachments />}
		</ThemedView>
	);
};

export default ChatFooterBar;
