import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';

interface TrickBuilderProps {}

const TrickBuilder: React.FC<TrickBuilderProps> = ({}) => {
	const insets = useSafeAreaInsets();
	const theme = useSystemTheme();

	return (
		<View
			style={[
				{
					bottom: insets.bottom,
				},
				styles.container,
			]}>
			<ThemedText theme={theme} value="trick builder" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'pink',
		flex: 0,
		height: Dimensions.get('window').height,
	},
});

export default TrickBuilder;
