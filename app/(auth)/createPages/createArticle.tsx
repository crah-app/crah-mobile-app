import ThemedText from '@/components/general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CreateArticle = () => {
	const theme = useSystemTheme();

	return (
		<View>
			<ThemedText theme={theme} value={'Video'} />
		</View>
	);
};

const styles = StyleSheet.create({});

export default CreateArticle;
