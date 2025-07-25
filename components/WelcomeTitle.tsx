import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ThemedView from './general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './general/ThemedText';
import Colors from '@/constants/Colors';

const WelcomeTitle = () => {
	const theme = useSystemTheme();
	return (
		<ThemedView theme={theme} flex={2} style={styles.wrapper}>
			<ThemedText theme={theme} value="Crah" style={styles.title} />
			<ThemedText
				theme={theme}
				value="Your Place to be a Scooter Rider."
				style={styles.subtitle}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		top: 100,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: Colors.default.background2,
	},
	title: {
		fontSize: 90,
		marginBottom: 10,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	subtitle: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		textTransform: 'capitalize',
	},
});

export default WelcomeTitle;
