import React, { ReactNode, useRef, useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Animated,
	Easing,
	Dimensions,
} from 'react-native';
import ThemedView from '../general/ThemedView';
import ThemedText from '../general/ThemedText';
import { SvgXml } from 'react-native-svg';
import MessagesButton from '../home/MessagesButton';
import Colors from '@/constants/Colors';
import { ContentFilterTypes } from '@/types';
import { filterPosts } from '@/utils/globalFuncs';
import SearchBar from '../general/SearchBar';

type Props = {
	theme: 'light' | 'dark';
	headerRight?: ReactNode;
	headerLeft?: ReactNode;
	headerCenter?: ReactNode;
	headerBottom?: ReactNode;
};

const CostumHeader = ({
	theme,
	headerRight,
	headerLeft,
	headerCenter,
	headerBottom,
}: Props) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	return (
		<ThemedView
			theme={theme}
			flex={1}
			style={[
				styles.container,
				{
					backgroundColor: Colors[theme].background,
					width: Dimensions.get('window').width,
					paddingHorizontal: 12,
				},
			]}>
			{/* prettier-ignore */}
			{(headerLeft || headerRight) && (
				<View style={styles.rowContainer}>
					{/* left header side */}
					{headerLeft}

					{headerCenter}

					{/* right header side */}
					{headerRight}
					{/*  */}
				</View>
			)}
			{/* bottom half of the header */}
			{headerBottom && <View style={{ flex: 1 }}>{headerBottom}</View>}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	rowContainer: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});

export default CostumHeader;
