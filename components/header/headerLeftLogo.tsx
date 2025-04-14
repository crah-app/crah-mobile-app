import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import TextLogo from '../../assets/images/vectors/TextLogo.svg';

interface HeaderLeftLogoProps {
	style?: ViewStyle | ViewStyle[];
	position?: 'relative' | 'absolute';
}

const HeaderLeftLogo: React.FC<HeaderLeftLogoProps> = ({ style, position }) => {
	return (
		<SvgXml
			width={130}
			height={40}
			xml={TextLogo}
			style={[
				{
					position: position ?? 'absolute',
					left: 0,
				},
				style,
			]}
		/>
	);
};

const styles = StyleSheet.create({});

export default HeaderLeftLogo;
