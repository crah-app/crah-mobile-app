import Colors from '@/constants/Colors';
import { defaultHeaderBtnSize } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderLeftLogo from './headerLeftLogo';

const HeaderLeftBtnPlusLogo = ({ theme }: { theme: 'light' | 'dark' }) => {
	return (
		<View style={{ flexDirection: 'row', gap: 8 }}>
			<TouchableOpacity onPress={router.back}>
				<Ionicons
					name="chevron-back-outline"
					size={defaultHeaderBtnSize}
					color={Colors[theme].textSecondary}
				/>
			</TouchableOpacity>
			<HeaderLeftLogo />
		</View>
	);
};

const styles = StyleSheet.create({});

export default HeaderLeftBtnPlusLogo;
