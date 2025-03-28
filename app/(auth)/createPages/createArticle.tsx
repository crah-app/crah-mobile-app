import CreatePageHeader from '@/components/create/CreatePageHeader';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

const CreateArticle = () => {
	const theme = useSystemTheme();

	const [articleText, setArticleText] = useState('');

	const handlePostUploadClickEvent = () => {};
	const previewClickEventHandler = () => {};

	return (
		<ThemedView flex={1} theme={theme}>
			<ScrollView>
				<KeyboardAwareScrollView
					scrollEnabled={false}
					contentContainerStyle={[styles.scrollContainer]}>
					<ThemedView style={[styles.container]} theme={theme} flex={1}>
						<CreatePageHeader
							title={'Create Article'}
							handleUploadClickEvent={handlePostUploadClickEvent}
							previewClickEventHandler={previewClickEventHandler}
						/>

						<ThemedTextInput
							theme={theme}
							value={articleText}
							setValue={setArticleText}
							multiline={true}
							maxLength={TextInputMaxCharacters.Article}
							showLength={true}
							lines={50}
							placeholder={'Your writing starts here...'}
						/>
					</ThemedView>
				</KeyboardAwareScrollView>
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		paddingTop: 12,
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width - 24,
	},
});

export default CreateArticle;
