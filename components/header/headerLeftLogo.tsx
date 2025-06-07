import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import GetSVG from '../GetSVG';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderLeftLogoProps {
	style?: ViewStyle | ViewStyle[];
	position?: 'relative' | 'absolute';
}

const HeaderLeftLogo: React.FC<HeaderLeftLogoProps> = ({ style, position }) => {
	return <GetSVG name={'textlogo'} props={{ width: 130, height: 40 }} />;
};

const styles = StyleSheet.create({});

export default HeaderLeftLogo;
