import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, View } from 'react-native';
import Row from './general/Row';
import { Language } from '@/types';
import Colors from '@/constants/Colors';
import CountryFlag from 'react-native-country-flag';

interface Props {
	Language: Language;
	Flag: string;
	theme: 'light' | 'dark';
	selected: Language;
	setSelected: Dispatch<SetStateAction<Language>>;
}

const LanguageRow: React.FC<Props> = ({
	Language,
	Flag,
	theme,
	selected,
	setSelected,
}) => {
	return (
		<Row
			onPress={() => setSelected(Language)}
			customRightComponent={<CountryFlag isoCode={Flag} size={24} />}
			title={Language}
			containerStyle={{
				borderRadius: 8,
				borderColor: Colors[theme].primary,
				borderWidth: 2,
				width: '100%',
				padding: 12,
				backgroundColor:
					selected === Language ? 'rgb(55, 0, 0)' : 'transparent',
				// backgroundColor: Colors[theme].darkPrimary,
			}}
		/>
	);
};

const styles = StyleSheet.create({});

export default LanguageRow;
