import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftBtnPlusLogo from '@/components/header/HeaderLeftBtnPlusLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const ChangePassword = () => {
	const theme = useSystemTheme();

	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');

	const [passwordSecretInput, setPasswordSecretInput] =
		useState<boolean>(false);
	const [newPasswordSecretInput, setNewPasswordSecretInput] =
		useState<boolean>(false);

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftBtnPlusLogo theme={theme} />}
				/>
			}
			theme={theme}
			scrollChildren={
				<ThemedView flex={1} theme={theme} style={{ flexDirection: 'column' }}>
					<View
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ThemedText
							style={[defaultStyles.bigText, { fontWeight: '700' }]}
							theme={theme}
							value={'Change Password'}
						/>
					</View>

					<View
						style={{
							flex: 3,
							paddingHorizontal: 18,
							flexDirection: 'column',
							gap: 18,
						}}>
						<ThemedTextInput
							placeholder="old password"
							isSecret
							secret={passwordSecretInput}
							setSecret={setPasswordSecretInput}
							theme={theme}
							value={password}
							setValue={setPassword}
						/>
						<ThemedTextInput
							placeholder="new password"
							isSecret
							secret={newPasswordSecretInput}
							setSecret={setNewPasswordSecretInput}
							theme={theme}
							value={newPassword}
							setValue={setNewPassword}
						/>
						<PostTypeButton
							style={{ width: '100%' }}
							val={'Submit'}
							click_action={() => {}}
						/>
						<ThemedText
							theme={theme}
							value={'Forgot Password'}
							style={{ color: Colors['default'].primary }}
						/>
					</View>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({});

export default ChangePassword;
