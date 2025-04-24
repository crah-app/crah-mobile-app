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
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SendProps } from 'react-native-gifted-chat';

interface RenderSendTextProps {
	props: SendProps<ChatMessage>;
	attachedMessageType: ChatFooterBarTypes | undefined;
	selectedRiderData: selectedRiderInterface | undefined;
	selectedTrickData: selectedTrickInterface | undefined;
}

export const RenderSendText: React.FC<RenderSendTextProps> = ({
	props,
	attachedMessageType,
	selectedRiderData,
	selectedTrickData,
}) => {
	const theme = useSystemTheme();

	let message: Partial<ChatMessage> = { text: props.text!.trim() };

	const internetLinks: RegExpMatchArray | [] =
		props.text!.trim()?.match(urlRegex) ?? [];
	const isInternetLink: boolean = internetLinks.length > 0;

	useEffect(() => {
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
				// message.video = '';
				message.image = '';
				break;

			case undefined:
				message.type = chatCostumMsgType.text;
				break;
		}
	}, [props]);

	useEffect(() => {
		if (isInternetLink) {
			message.video = internetLinks[0];
			message.type = chatCostumMsgType.text;
		}
	}, [internetLinks]);

	const handleSendMessage = () => {
		if (
			(props.text && props.text.trim()) ||
			attachedMessageType !== undefined
		) {
			props.onSend!(message, true);
		}
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

export const RenderSendEmptyText: React.FC<{ props: any }> = ({ props }) => {
	const theme = useSystemTheme();

	return (
		<View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}>
			<TouchableOpacity onPress={() => {}}>
				<View>
					<Ionicons
						name="camera-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => {}}>
				<View>
					<Ionicons
						name="mic-outline"
						size={24}
						color={Colors[theme].textPrimary}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};
