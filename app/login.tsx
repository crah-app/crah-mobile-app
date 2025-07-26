import {
	View,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
	Dimensions,
} from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Link, router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/general/ThemedText';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import ThemedView from '@/components/general/ThemedView';
import {
	CodeField,
	Cursor,
	RenderCellOptions,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import { Ionicons } from '@expo/vector-icons';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import CostumHeader from '@/components/header/CostumHeader';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import PostTypeButton from '@/components/PostTypeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNotifications } from 'react-native-notificated';
import { TextInputMaxCharacters } from '@/types';

const CELL_COUNT = 6;

const AuthHeader = ({ theme, type, pendingVerification }: any) => (
	<View
		style={{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		}}>
		<ThemedText
			theme={theme}
			style={[defaultStyles.veryBigText]}
			value={
				type === 'login' && !pendingVerification
					? 'Welcome Back!'
					: type === 'register' && !pendingVerification
					? 'Create New Account'
					: pendingVerification
					? 'Verify Your Email'
					: 'Reset Password'
			}
		/>
	</View>
);

interface AuthFormProps {
	theme: 'light' | 'dark';
	type: 'login' | 'register' | 'forgot';
	emailAddress: string;
	setEmailAddress: Dispatch<SetStateAction<string>>;
	password: string;
	setPassword: Dispatch<SetStateAction<string>>;
	username: string;
	setUsername: Dispatch<SetStateAction<string>>;
	successfulCreation: boolean;
}

const AuthForm = ({
	theme,
	type,
	emailAddress,
	setEmailAddress,
	password,
	setPassword,
	username,
	setUsername,
	successfulCreation,
}: AuthFormProps) => {
	const [secret, setSecret] = useState<boolean>(true);

	return (
		<View style={{ gap: 12 }}>
			<ThemedTextInput
				maxLength={TextInputMaxCharacters.Simple}
				placeholder="Email"
				theme={theme}
				value={emailAddress}
				setValue={setEmailAddress}
			/>

			{type !== 'forgot' && !successfulCreation && (
				<ThemedTextInput
					maxLength={TextInputMaxCharacters.UserName}
					placeholder="Password"
					theme={theme}
					value={password}
					setValue={setPassword}
					isSecret
					secret={secret}
					setSecret={setSecret}
				/>
			)}
			{type === 'register' && (
				<ThemedTextInput
					maxLength={TextInputMaxCharacters.UserName}
					placeholder="Username"
					theme={theme}
					value={username}
					setValue={setUsername}
					allowSpace={false}
				/>
			)}
		</View>
	);
};

interface VerificationCodeInputProps {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
	props: any;
	ref: any;
	theme: 'light' | 'dark';
	onVerifyPress: () => void;
}

const VerificationCodeInput = ({
	code,
	setCode,
	props,
	ref,
	theme,
	onVerifyPress,
}: VerificationCodeInputProps) => (
	<KeyboardAvoidingView
		style={[
			styles.container,
			{
				justifyContent: 'flex-start',
				// alignItems: 'center',
				// width: '100%',
				// height: 180,
				gap: 12,
			},
		]}
		behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		keyboardVerticalOffset={10}>
		<CodeField
			ref={ref}
			{...props}
			value={code}
			onChangeText={setCode}
			cellCount={CELL_COUNT}
			rootStyle={styles.codeFieldRoot}
			keyboardType="number-pad"
			textContentType="oneTimeCode"
			renderCell={({ index, symbol, isFocused }: RenderCellOptions) => (
				<ThemedText
					theme={theme}
					key={index}
					style={[
						{
							fontSize: 22,
							borderColor: Colors[theme].borderColor,
							backgroundColor: isFocused
								? Colors[theme].background2
								: 'transparent',
							flex: 1,
							width: 50,
							height: 55,
							minWidth: 50,
							justifyContent: 'center',
							alignItems: 'center',
							borderWidth: 1,
							borderRadius: 10,
							textAlign: 'center',
							textAlignVertical: 'center',
						},
					]}
					value={symbol || (isFocused ? <Cursor /> : '')}
				/>
			)}
		/>

		<PostTypeButton
			click_action={onVerifyPress}
			val={'Verify'}
			style={{ width: '100%' }}
		/>
	</KeyboardAvoidingView>
);

interface ForgotPasswordFormProps {
	theme: 'light' | 'dark';
	resetCode: string;
	setResetCode: Dispatch<SetStateAction<string>>;
	newPassword: string;
	setNewPassword: Dispatch<SetStateAction<string>>;
	props: any;
	ref: any;
	onActualPasswordReset: () => void;
}

const ForgotPasswordForm = ({
	theme,
	resetCode,
	setResetCode,
	newPassword,
	setNewPassword,
	props,
	ref,
	onActualPasswordReset,
}: ForgotPasswordFormProps) => {
	const [secret, setSecret] = useState<boolean>(true);

	return (
		<View style={{ gap: 12 }}>
			<CodeField
				ref={ref}
				{...props}
				value={resetCode}
				onChangeText={setResetCode}
				cellCount={CELL_COUNT}
				rootStyle={styles.codeFieldRoot}
				keyboardType="number-pad"
				textContentType="oneTimeCode"
				renderCell={({ index, symbol, isFocused }: RenderCellOptions) => (
					<ThemedText
						theme={theme}
						key={index}
						style={[
							{
								fontSize: 22,
								borderColor: Colors[theme].borderColor,
								backgroundColor: isFocused
									? Colors[theme].background2
									: 'transparent',
								flex: 1,
								width: 50,
								height: 55,
								minWidth: 50,
								justifyContent: 'center',
								alignItems: 'center',
								borderWidth: 1,
								borderRadius: 10,
								textAlign: 'center',
								textAlignVertical: 'center',
							},
						]}
						value={symbol || (isFocused ? <Cursor /> : '')}
					/>
				)}
			/>
			<ThemedTextInput
				maxLength={TextInputMaxCharacters.UserName}
				theme={theme}
				secret={secret}
				setSecret={setSecret}
				isSecret
				placeholder="New Password"
				value={newPassword}
				setValue={setNewPassword}
				outerContainerStyle={{
					marginTop: 0,
				}}
			/>

			<PostTypeButton
				click_action={onActualPasswordReset}
				val={'Submit'}
				style={{ width: '100%' }}
			/>
		</View>
	);
};

interface AuthActionsProps {
	theme: 'light' | 'dark';
	type: 'login' | 'forgot' | 'register';
	onSignInPress: () => void;
	onSignUpPress: () => void;
	onResetPasswordPress: () => void;
	pendingVerification: boolean;
	successfulCreation: boolean;
}

const AuthActions = ({
	theme,
	type,
	onSignInPress,
	onSignUpPress,
	onResetPasswordPress,
	pendingVerification,
	successfulCreation,
}: AuthActionsProps) => {
	if (type === 'login' && !pendingVerification) {
		return (
			<View style={{ gap: 12 }}>
				<Link
					href={{ pathname: '/login', params: { type: 'forgot' } }}
					asChild
					style={{ marginTop: 12 }}>
					<TouchableOpacity>
						<ThemedText
							style={{ color: Colors[theme].primary }}
							theme={theme}
							value={'I forgot my Password'}
						/>
					</TouchableOpacity>
				</Link>

				<PostTypeButton
					val="Log In"
					click_action={onSignInPress}
					style={{ width: '100%', marginTop: 12 }}
				/>
			</View>
		);
	} else if (type === 'register' && !pendingVerification) {
		return (
			<PostTypeButton
				click_action={onSignUpPress}
				val="Create"
				style={{ width: '100%', marginVertical: 24 }}
			/>
		);
	} else if (type === 'forgot' && !successfulCreation) {
		return (
			<View>
				<Link
					href={{ pathname: '/login', params: { type: 'login' } }}
					asChild
					style={{ marginTop: 12 }}>
					<TouchableOpacity>
						<ThemedText
							style={{ color: Colors[theme].primary }}
							theme={theme}
							value={'Go back to login'}
						/>
					</TouchableOpacity>
				</Link>

				<PostTypeButton
					click_action={onResetPasswordPress}
					val="Send Verification Code"
					style={{ width: '100%', marginVertical: 24 }}
				/>
			</View>
		);
	} else {
		return null;
	}
};

const Page = () => {
	const theme = useSystemTheme();
	const { type } = useLocalSearchParams<{
		type: 'login' | 'register' | 'forgot';
	}>();
	const { signIn, setActive, isLoaded } = useSignIn();
	const { signUp, isLoaded: signUpLoaded } = useSignUp();

	const [emailAddress, setEmailAddress] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [pendingVerification, setPendingVerification] =
		useState<boolean>(false);
	const [successfulCreation, setSuccessfulCreation] = useState<boolean>(false);
	const [resetCode, setResetCode] = useState<string>('');
	const [code, setCode] = useState<string>('');
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: code,
		setValue: setCode,
	});
	const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

	const { notify } = useNotifications();

	const onSignUpPress = async () => {
		if (!signUpLoaded) return;
		setLoading(true);
		try {
			await signUp.create({ emailAddress, password, username });
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			setPendingVerification(true);
		} catch (error: any) {
			console.warn('Error [onSignUpPress]', error);

			const message =
				error?.message || error?.errors?.[0]?.message || JSON.stringify(error);

			notify('error', {
				params: {
					title: 'Error',
					description: message,
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const onVerifyPress = async () => {
		if (!signUpLoaded || !isLoaded) return;
		setLoading(true);
		try {
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});
			if (signUpAttempt.status === 'complete') {
				await setActive({ session: signUpAttempt.createdSessionId });
				router.replace('/createProfile');
			}
		} catch (error: any) {
			console.warn('Error [onVerifyPress]', error);

			const message =
				error?.message || error?.errors?.[0]?.message || JSON.stringify(error);

			notify('error', {
				params: {
					title: 'Error',
					description: message,
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const onSignInPress = async () => {
		if (!isLoaded) return;
		setLoading(true);
		try {
			const signInAttempt = await signIn.create({
				identifier: emailAddress,
				password,
			});
			if (signInAttempt.status === 'complete') {
				await setActive({ session: signInAttempt.createdSessionId });
				router.replace('/');
			}
		} catch (error: any) {
			console.warn('Error [onSignInPress]', error);

			const message =
				error?.message || error?.errors?.[0]?.message || JSON.stringify(error);

			notify('error', {
				params: {
					title: 'Error',
					description: message,
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const onResetPasswordPress = async () => {
		if (!isLoaded) return;
		setLoading(true);
		try {
			await signIn.create({
				strategy: 'reset_password_email_code',
				identifier: emailAddress,
			});
			setSuccessfulCreation(true);
		} catch (error: any) {
			console.warn('Error [onResetPasswordPress]', error);

			const message =
				error?.message || error?.errors?.[0]?.message || JSON.stringify(error);

			notify('error', {
				params: {
					title: 'Error',
					description: message,
				},
			});
		} finally {
			setLoading(false);
		}
	};

	const onActualPasswordReset = async () => {
		if (!isLoaded) return;
		setLoading(true);
		try {
			const result = await signIn.attemptFirstFactor({
				strategy: 'reset_password_email_code',
				code: resetCode,
				password: newPassword,
			});
			await setActive({ session: result.createdSessionId });
		} catch (error: any) {
			console.warn('Error [onActualPasswordReset]', error);

			const message =
				error?.message || error?.errors?.[0]?.message || JSON.stringify(error);

			notify('error', {
				params: {
					title: 'Error',
					description: message,
				},
			});
		} finally {
			setLoading(false);
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
						<View style={{ flexDirection: 'row', gap: 8 }}>
							<TouchableOpacity onPress={router.back}>
								<Ionicons
									name="chevron-back"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
							<HeaderLeftLogo />
						</View>
					}
				/>
			}
			scrollChildren={
				<ThemedView flex={1} theme={theme}>
					<StatusBar backgroundColor={Colors[theme].background} />

					{loading && (
						<View style={defaultStyles.loadingOverlay}>
							<CrahActivityIndicator
								size="large"
								color={theme == 'dark' ? '#fff' : '#000'}
							/>
						</View>
					)}
					<KeyboardAwareScrollView
						scrollEnabled={false}
						contentContainerStyle={[styles.scrollContainer]}>
						<AuthHeader
							theme={theme}
							type={type}
							pendingVerification={pendingVerification}
						/>
						<View
							style={{ flex: 2, width: Dimensions.get('window').width - 24 }}>
							{!pendingVerification && !successfulCreation && (
								<AuthForm
									theme={theme}
									type={type}
									emailAddress={emailAddress}
									setEmailAddress={setEmailAddress}
									password={password}
									setPassword={setPassword}
									username={username}
									setUsername={setUsername}
									successfulCreation={successfulCreation}
								/>
							)}
							{pendingVerification && (
								<VerificationCodeInput
									code={code}
									setCode={setCode}
									props={props}
									ref={ref}
									theme={theme}
									onVerifyPress={onVerifyPress}
								/>
							)}
							{type === 'forgot' && successfulCreation && (
								<ForgotPasswordForm
									theme={theme}
									resetCode={resetCode}
									setResetCode={setResetCode}
									newPassword={newPassword}
									setNewPassword={setNewPassword}
									props={props}
									ref={ref}
									onActualPasswordReset={onActualPasswordReset}
								/>
							)}
							<AuthActions
								theme={theme}
								type={type}
								onSignInPress={onSignInPress}
								onSignUpPress={onSignUpPress}
								onResetPasswordPress={onResetPasswordPress}
								pendingVerification={pendingVerification}
								successfulCreation={successfulCreation}
							/>
						</View>
					</KeyboardAwareScrollView>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputField: {
		marginVertical: 4,
		height: 50,
		borderWidth: 1,
		borderRadius: 12,
		padding: 10,
	},
	btnPrimaryText: {
		fontSize: 16,
	},
	codeFieldRoot: {
		gap: 6,
	},
	scrollContainer: {
		flex: 1,
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default Page;
