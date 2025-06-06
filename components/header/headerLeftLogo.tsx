import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import GetSVG from '../GetSVG';

interface HeaderLeftLogoProps {
	style?: ViewStyle | ViewStyle[];
	position?: 'relative' | 'absolute';
}

const HeaderLeftLogo: React.FC<HeaderLeftLogoProps> = ({ style, position }) => {

	return (
		<GetSVG name={'textlogo'} props={{}}/>
	);
};

const styles = StyleSheet.create({});

export default HeaderLeftLogo;
