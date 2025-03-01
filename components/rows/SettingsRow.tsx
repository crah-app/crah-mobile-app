import React from 'react';
import { Dimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Column from '@/components/general/Row';
import Scooter from '../../assets/images/vectors/scooter.svg';
import { ionicon } from '@/types';

interface SettingsColumnProps {
	type: 'ordinary' | 'unordinary';
	text: string;
	icon?: ionicon;
	svg?: boolean;
	hasIcon?: boolean;
}

const SettingsColumn: React.FC<SettingsColumnProps> = ({
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
			await signOut();
			router.replace('/login');
		} catch (err) {
			console.error('Error signing out:', err);
		}
	};

	const handleClick = async () => {
		if (text === 'Sign Out') await handleSignOut();
	};

	const renderLeftIcon = () => {
		if (svg && type != 'unordinary') {
			return (
				<SvgXml
					width="25"
					height="25"
					xml={Scooter}
					fill={Colors[theme].textPrimary}
					style={{ marginRight: -2 }}
				/>
			);
		}

		if (hasIcon && icon && type != 'unordinary') {
			return (
				<Ionicons name={icon} size={24} color={Colors[theme].textPrimary} />
			);
		}

		return null;
	};

	return (
		<Column
			title={text}
			onPress={handleClick}
			customLeftComponent={renderLeftIcon()}
			leftContainerStyle={{
				marginRight: 0,
			}}
			containerStyle={{
				backgroundColor:
					type === 'ordinary'
						? Colors[theme].textPrimaryReverse
						: 'transparent',
			}}
			titleStyle={{
				fontSize: 16,
				marginLeft: type === 'unordinary' ? 0 : 12,
				color: type === 'unordinary' ? 'red' : Colors[theme].textPrimary,
				textAlign: type === 'unordinary' ? 'center' : 'left',
				width: type === 'unordinary' ? '100%' : undefined,
				fontWeight: 'normal',
			}}
		/>
	);
};

export default SettingsColumn;
