import CrahActivityIndicator from '@/components/general/CrahActivityIndicator';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TrickStructure {
	trickName: string;
	trickId: number;
	trickDescription: string;
}

const TrickModal = () => {
	const theme = useSystemTheme();
	const { trickName, trickDescription, trickId } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			<View>
				<Stack.Screen
					options={{
						title: trickName as string,
					}}
				/>

				<ThemedText
					theme={theme}
					value={trickId.toString() || 'trick description'}
				/>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'pink',
	},
});

export default TrickModal;
