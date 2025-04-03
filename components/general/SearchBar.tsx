import Colors from '@/constants/Colors';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
	query: string;
	setQuery: (string: string) => void;
	placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
	query,
	setQuery,
	placeholder,
}) => {
	const theme = useSystemTheme();

	return (
		<TextInput
			style={[
				styles.search_input,
				{
					color: Colors[theme].textPrimary,
					backgroundColor: Colors[theme].container_surface,
					cursor: Colors[theme].textPrimary,
				},
			]}
			placeholderTextColor={'grey'}
			placeholder={placeholder}
			value={query}
			onChangeText={(text) => setQuery(text)}
			clearButtonMode="always"
			cursorColor={Colors[theme].primary}
			maxLength={TextInputMaxCharacters.UserName}
		/>
	);
};

const styles = StyleSheet.create({
	search_input: {
		padding: 12,
		width: Dimensions.get('window').width * 0.95,
		borderRadius: 10,
		marginBottom: 10,
	},
});

export default SearchBar;
