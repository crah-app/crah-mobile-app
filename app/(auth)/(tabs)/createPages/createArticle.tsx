import CreatePageHeader from '@/components/create/CreatePageHeader';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import Colors from '@/constants/Colors';
import { defaultHeaderBtnSize } from '@/constants/Styles';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import helpModalContent from '@/JSON/non_dummy_data/inbox_help_modal_content.json';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

const CreateArticle = () => {
	const theme = useSystemTheme();

	const [articleText, setArticleText] = useState('');

	const handlePostUploadClickEvent = () => {};
	const previewClickEventHandler = () => {};

	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo position="relative" />}
					headerRight={
						<Link
							asChild
							href={{
								params: { contents: JSON.stringify(helpModalContent) },
								pathname: '/modals/help_modal',
							}}>
							<TouchableOpacity>
								<Ionicons
									name="help-circle-outline"
									size={defaultHeaderBtnSize}
									color={Colors[theme].textPrimary}
								/>
							</TouchableOpacity>
						</Link>
					}
				/>
			}
			scrollChildren={
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
			}
		/>
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
