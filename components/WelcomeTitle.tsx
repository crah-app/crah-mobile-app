import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ThemedView from './general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './general/ThemedText';
import Colors from '@/constants/Colors';

const WelcomeTitle = () => {
	const theme = useSystemTheme();
	return (
		<ThemedView theme={theme} flex={0} style={styles.wrapper}>
			<ThemedText
				theme={theme == 'dark' ? 'light' : 'dark'}
				value="Crah"
				style={styles.title}
			/>
			<ThemedText
				theme={theme == 'dark' ? 'light' : 'dark'}
				value="The Official Social Network for the Flat Scootering Community"
				style={styles.subtitle}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		marginTop: 70,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: Colors['default'].primary,
		position: 'absolute',
		top: 10,
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
