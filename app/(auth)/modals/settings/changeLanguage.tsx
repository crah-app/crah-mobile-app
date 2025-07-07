import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftBtnPlusLogo from '@/components/header/HeaderLeftBtnPlusLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import LanguageRow from '@/components/LanguageRow';
import PostTypeButton from '@/components/PostTypeButton';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Language, LanguageISO } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CountryFlag from 'react-native-country-flag';

const ChangeLanguage = () => {
	const theme = useSystemTheme();

	const [language, setLanguage] = useState<Language>('English');

	const handleLanguageClick = (lang: Language) => {
		setLanguage(lang);
	};

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftBtnPlusLogo theme={theme} />}
				/>
			}
			theme={theme}
			scrollChildren={
				<ThemedView flex={1} theme={theme} style={{ flexDirection: 'column' }}>
					<View
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ThemedText
							style={[defaultStyles.bigText, { fontWeight: '700' }]}
							theme={theme}
							value={'Change Language'}
						/>
					</View>

					<View
						style={{
							flex: 3,
							paddingHorizontal: 18,
							flexDirection: 'column',
							gap: 18,
						}}>
						{Object.keys(LanguageISO).map((key) => (
							<LanguageRow
								setSelected={setLanguage}
								selected={language}
								theme={theme}
								Language={key as Language}
								Flag={LanguageISO[key as Language]}
							/>
						))}
						<PostTypeButton
							style={{ width: '100%' }}
							val={'Submit'}
							click_action={() => {}}
						/>
					</View>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({});

export default ChangeLanguage;
