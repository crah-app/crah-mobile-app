import ThemedText from '@/components/general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CreateTextPost = () => {
	const theme = useSystemTheme();

	return (
		<View>
			<ThemedText theme={theme} value={'Video'} />
		</View>
	);
};

const styles = StyleSheet.create({});

export default CreateTextPost;
