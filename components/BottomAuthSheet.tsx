import { View, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { AuthStrategy } from '@/types';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import PostTypeButton from './PostTypeButton';
import { router } from 'expo-router';

const BottomAuthSheet = () => {
	useWarmUpBrowser();

	const { signUp, setActive } = useSignUp();
	const { signIn } = useSignIn();

	const { startOAuthFlow: googleAuth } = useOAuth({
		strategy: AuthStrategy.Google,
	});

	const onSelectAuth = async (strategy: AuthStrategy) => {
		if (!signIn || !signUp) return null;

		const selectedAuth = {
			[AuthStrategy.Google]: googleAuth,
		}[strategy];

		// https://clerk.com/docs/custom-flows/oauth-connections#o-auth-account-transfer-flows
		// If the user has an account in your application, but does not yet
		// have an OAuth account connected to it, you can transfer the OAuth
		// account to the existing user account.
		const userExistsButNeedsToSignIn =
			signUp.verifications.externalAccount.status === 'transferable' &&
			signUp.verifications.externalAccount.error?.code ===
				'external_account_exists';

		if (userExistsButNeedsToSignIn) {
			const res = await signIn.create({ transfer: true });

			if (res.status === 'complete') {
				setActive({
					session: res.createdSessionId,
				});
			}
		}

		const userNeedsToBeCreated =
			signIn.firstFactorVerification.status === 'transferable';

		if (userNeedsToBeCreated) {
			const res = await signUp.create({
				transfer: true,
				// username: `UserX`, // does not work for some reason. Btw. In the clerk config you have to disable the requirement for a username to set OAuth to work
			});

			if (res.status === 'complete') {
				setActive({
					session: res.createdSessionId,
				});
			}
		} else {
			// If the user has an account in your application
			// and has an OAuth account connected to it, you can sign them in.
			try {
				const { createdSessionId, setActive } = await selectedAuth();

				if (createdSessionId) {
					setActive!({ session: createdSessionId });
					console.log('OAuth success standard');
				}
			} catch (err) {
				console.error('OAuth error', err);
			}
		}
	};

	const handleCreateAccountClick = () => {
		router.push({
			params: { type: 'register' },
			pathname: '/login',
		});
	};

	const handleLoginClick = () => {
		router.push({
			params: { type: 'login' },
			pathname: '/login',
		});
	};

	return (
		<View style={[styles.container]}>
			<View style={[styles.wrapper]}>
				<PostTypeButton
					val="Sign In With Google"
					click_action={() => onSelectAuth(AuthStrategy.Google)}
					style={[styles.authColumn]}
					revert
					hasIcon
					icon="logo-google"
				/>

				<PostTypeButton
					val="I Have An Account"
					click_action={handleLoginClick}
					style={[styles.authColumn]}
					revert
					hasIcon
					icon="log-in-outline"
				/>

				<PostTypeButton
					val="Create New Account"
					click_action={handleCreateAccountClick}
					style={[styles.authColumn]}
					revert
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.default.darkPrimary,
		borderTopColor: Colors.default.bgPrimary,
		borderTopWidth: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		flex: 1,
		paddingHorizontal: 18,
	},
	wrapper: {
		paddingTop: 24,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 12,
	},
	authColumn: {
		width: '100%',
	},
});

export default BottomAuthSheet;
