import CompareRidersContents from '@/components/contents/compareRidersContents';
import ThemedView from '@/components/general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CompareRiders = () => {
	const theme = useSystemTheme();

	const { rider1Id, rider2Id } = useLocalSearchParams();

	return (
		<ThemedView theme={theme} flex={1}>
			<CompareRidersContents
				rider1Id={rider1Id as string}
				rider2Id={rider2Id as string}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({});

export default CompareRiders;
