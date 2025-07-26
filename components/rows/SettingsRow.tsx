import React from 'react';
import { Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Column from '@/components/general/Row';
import Scooter from '../../assets/images/vectors/scooter.svg';
import { ionicon } from '@/types';
import GetSVG from '../GetSVG';
import Row from '@/components/general/Row';
import { mmkv } from '@/hooks/mmkv';

interface SettingsRowProps {
	type: 'ordinary' | 'unordinary' | string;
	text: string;
	icon?: ionicon | string;
	svg?: boolean;
	hasIcon?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
	type,
	text,
	icon,
	svg = false,
	hasIcon = false,
}) => {
	const theme = useSystemTheme();
	const { signOut } = useAuth();

	const handleSignOut = async () => {
		try {
			mmkv.set('userSignedInOnce', false);
			await signOut();
			router.replace('/login');
		} catch (err) {
			console.error('Error signing out:', err);
		}
	};

	const handleClick = async () => {
		if (text === 'Sign Out') await handleSignOut();

		switch (text) {
			case 'Edit Profile':
				router.push('/(auth)/modals/settings/editProfile');
				break;

			case 'Change Password':
				router.push('/(auth)/modals/settings/changePassword');
				break;

			case 'Change Email':
				router.push('/(auth)/modals/settings/changeEmail');
				break;

			case 'Change Language':
				router.push('/(auth)/modals/settings/changeLanguage');
				break;

			case 'User Info':
				router.push('/(auth)/modals/settings/userInfo');
				break;

			case 'Send Feedback':
				router.push('/(auth)/modals/settings/sendFeedback');
				break;

			case 'Delete Account':
				router.push('/(auth)/modals/settings/deleteAccount');
				break;
		}
	};

	const renderLeftIcon = () => {
		if (svg && type != 'unordinary') {
			return (
				<GetSVG
					props={{ width: 24, height: 24, fill: Colors[theme].textPrimary }}
					name="scooter"
				/>
			);
		}

		if (hasIcon && icon && type != 'unordinary') {
			return (
				<Ionicons
					name={icon as ionicon}
					size={24}
					color={Colors[theme].textPrimary}
				/>
			);
		}

		return null;
	};

	return (
		<Row
			title={text}
			onPress={handleClick}
			customLeftComponent={renderLeftIcon()}
			leftContainerStyle={{
				marginRight: 0,
			}}
			containerStyle={{
				marginLeft: 2,
				backgroundColor:
					type === 'ordinary' ? Colors[theme].background : 'transparent',
			}}
			titleStyle={{
				fontSize: 16,
				marginLeft: type === 'unordinary' ? 0 : 12,
				color: type === 'unordinary' ? 'red' : Colors[theme].textPrimary,
				textAlign: type === 'unordinary' ? 'center' : 'left',
				width: type === 'unordinary' ? '100%' : undefined,
				fontWeight: 'normal',
				marginTop: type === 'unordinary' ? 28 : 0,
			}}
		/>
	);
};

export default SettingsRow;
