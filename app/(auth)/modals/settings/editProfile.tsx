import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import CostumHeader from '@/components/header/CostumHeader';

const editProfile = () => {
	const theme = useSystemTheme();
	return (
		<HeaderScrollView
			scrollChildren={
				<View style={{ flex: 1, backgroundColor: 'green' }}></View>
			}
			theme={theme}
			headerChildren={<CostumHeader theme={theme} />}
		/>
	);
};

export default editProfile;

const styles = StyleSheet.create({});
