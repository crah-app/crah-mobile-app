import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNotifications } from 'react-native-notificated';

const SendFeedback = () => {
	const theme = useSystemTheme();

	const { notify } = useNotifications();
	const { user } = useUser();
	const { getToken } = useAuth();

	const [feedback, setFeedback] = useState<string>('');

	const handleSendFeedback = async () => {
		if (feedback.length <= 0) {
			notify('error', {
				params: {
					title: 'Error',
					description: 'Input is empty',
				},
			});
			return;
		}

		if (!user || !getToken) return;

		try {
			const message = feedback;
			setFeedback('');

			const token = await getToken();

			const response = await fetch(
				`http://192.168.0.136:4000/api/users/feedback`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: user?.id,
						feedback: message,
					}),
				},
			);

			const text = await response.text();
			if (!response.ok) throw Error(text);
		} catch (error) {
			console.warn('Error [handleSendFeedback]', error);
			notify('error', {
				params: {
					title: 'Error',
					description: 'Feedback could not be send',
				},
			});
		}
	};

	return (
		<HeaderScrollView
			theme={theme}
			scrollEnabled={false}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={
						<View style={{ flexDirection: 'row', gap: 4 }}>
							<TouchableOpacity onPress={router.back}>
								<Ionicons
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
									name="chevron-back"
								/>
							</TouchableOpacity>
							<HeaderLeftLogo />
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView theme={theme} flex={1}>
					<KeyboardAwareScrollView
						scrollEnabled={false}
						contentContainerStyle={{
							flex: 1,
							justifyContent: 'center',
						}}>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<ThemedText
								theme={theme}
								value={'Send Feedback'}
								style={[defaultStyles.veryBigText]}
							/>
						</View>

						<View
							style={{
								flex: 3,
								gap: 12,
								paddingHorizontal: 12,
								width: Dimensions.get('window').width,
								alignItems: 'center',
							}}>
							<ThemedTextInput
								theme={theme}
								placeholder="Feedback"
								value={feedback}
								setValue={setFeedback}
								multiline={true}
								lines={25}
								maxLength={TextInputMaxCharacters.BigDescription}
								showLength
								style={{
									width: Dimensions.get('window').width - 48,
									backgroundColor: Colors[theme].background2,
								}}
								textInputWrapperStyle={{
									backgroundColor: Colors[theme].background2,
									borderRadius: 12,
								}}
							/>
							<PostTypeButton
								val="Send"
								click_action={handleSendFeedback}
								style={{ width: '100%' }}
							/>
						</View>
					</KeyboardAwareScrollView>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({});

export default SendFeedback;
