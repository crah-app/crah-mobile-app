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
	trickDescription: string;
}

const TrickModal = () => {
	const theme = useSystemTheme();
	const { data } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	const [trickData, setTrickData] = useState<TrickStructure>();
	const [trickDataLoaded, setTrickDataLoaded] = useState(false);

	useEffect(() => {
		setTrickDataLoaded(false);

		if (data) {
			setTrickData(JSON.parse(data as string));
			setTrickDataLoaded(true);
		}
	}, [data]);

	return (
		<ThemedView theme={theme} flex={1} style={styles.container}>
			{trickDataLoaded ? (
				<View>
					<Stack.Screen
						options={{
							title: trickData?.trickName,
						}}
					/>

					<ThemedText
						theme={theme}
						value={trickData?.trickDescription || 'trick description'}
					/>
				</View>
			) : (
				<CrahActivityIndicator size={'large'} color={Colors[theme].primary} />
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'pink',
	},
});

export default TrickModal;
