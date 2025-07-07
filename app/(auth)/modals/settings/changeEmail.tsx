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

const ChangeEmail = () => {
	const theme = useSystemTheme();

	const [password, setPassword] = useState<string>('');

	const [email, setEmail] = useState<string>('');
	const [newEmail, setNewEmail] = useState<string>('');

	const [passwordSecretInput, setPasswordSecretInput] =
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
							value={'Change Email'}
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
							placeholder="old email"
							theme={theme}
							value={email}
							setValue={setEmail}
						/>
						<ThemedTextInput
							placeholder="new email"
							theme={theme}
							value={newEmail}
							setValue={setNewEmail}
						/>
						<ThemedTextInput
							placeholder="password"
							isSecret
							secret={passwordSecretInput}
							setSecret={setPasswordSecretInput}
							theme={theme}
							value={password}
							setValue={setPassword}
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

export default ChangeEmail;
