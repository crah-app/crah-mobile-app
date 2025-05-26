import Colors from '@/constants/Colors';
import {
	ChatMessage,
	selectedRiderInterface,
	selectedTrickInterface,
} from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import Row from '../general/Row';

import { useUser } from '@clerk/clerk-expo';
import { RenderRider, RenderTrick } from './MessageAttachments';

type ReplyMessageBarProps = {
	message: ChatMessage | undefined;
	trickData?: selectedTrickInterface;
	riderData?: selectedRiderInterface;
};

const ReplyMessageBar = ({
	message,
	trickData,
	riderData,
}: ReplyMessageBarProps) => {
	const theme = useSystemTheme();
	const { user } = useUser();

	let username = message?.user.name;

	if (message?.user.name === user?.username)
		username = `You - ${user?.username}`;

	return (
		<>
			{message && (
				<Animated.View
					style={{
						height: 65,
						flexDirection: 'row',
						backgroundColor: Colors[theme].surface,
					}}
					entering={FadeInDown}
					exiting={FadeOutDown}>
					{/* left color padding */}
					<View
						style={{
							height: '100%',
							width: 6,
							backgroundColor: Colors[theme].primary,
						}}
					/>
					{/* text to reply to */}
					<View style={{ flexDirection: 'column' }}>
						<Text
							style={{
								color: Colors[theme].primary,
								paddingLeft: 10,
								paddingTop: 5,
								fontWeight: '600',
								fontSize: 15,
							}}>
							{username}
						</Text>
						{/* render message text */}
						{message.text && message.type === 'text' && (
							<Text
								style={{
									color: Colors[theme].gray,
									paddingLeft: 10,
									paddingTop: 5,
								}}>
								{message.text.length > 40
									? message?.text.substring(0, 40) + '...'
									: message?.text}
							</Text>
						)}

						{/* render other content if it is not a text message */}
						<View>
							{message.type === 'rider' ? (
								<RenderRider asMessageBubble={false} riderData={riderData} />
							) : message.type === 'trick' ? (
								<RenderTrick asMessageBubble={false} trickData={trickData} />
							) : (
								<></>
							)}
						</View>
					</View>
					{/* right container */}
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingRight: 10,
						}}></View>
					{/*  */}
				</Animated.View>
			)}
		</>
	);
};

export default ReplyMessageBar;
