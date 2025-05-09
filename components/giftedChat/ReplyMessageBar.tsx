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

import Scooter from '../../assets/images/vectors/scooter.svg';
import { getTrickTitle } from '@/utils/globalFuncs';
import { useUser } from '@clerk/clerk-expo';

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

	const RenderTrick = () => {
		return (
			<View style={{ backgroundColor: Colors[theme].surface }}>
				<Row
					costumAvatarWidth={18}
					costumAvatarHeight={18}
					showAvatar
					avatarIsSVG
					avatarUrl={Scooter}
					// @ts-ignore
					title={getTrickTitle(trickData)}
					containerStyle={{
						backgroundColor: Colors[theme].surface,
					}}
				/>
			</View>
		);
	};

	const RenderRider = () => {
		console.log(riderData, 'undineuinuunuhs');

		return (
			<View style={{ backgroundColor: Colors[theme].surface }}>
				<Row
					costumAvatarWidth={18}
					costumAvatarHeight={18}
					showAvatar
					// @ts-ignore
					avatarUrl={riderData?.avatar}
					// @ts-ignore
					title={riderData?.name}
					// subtitle={riderData?.rank + ' #' + riderData?.rankPosition}
					containerStyle={{ backgroundColor: Colors[theme].surface }}
				/>
			</View>
		);
	};

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
						{message.text && (
							<Text
								style={{
									color: Colors[theme].gray,
									paddingLeft: 10,
									paddingTop: 5,
								}}>
								{message!.text.length > 40
									? message?.text.substring(0, 40) + '...'
									: message?.text}
							</Text>
						)}

						{/* render other content if it is not a text message */}
						<View>
							{message.type === 'rider' ? (
								<RenderRider />
							) : message.type === 'trick' ? (
								<RenderTrick />
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
