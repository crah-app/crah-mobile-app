import Colors from '@/constants/Colors';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import {
	Dimensions,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import ThemedView from './ThemedView';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
	query: string;
	setQuery: (string: string) => void;
	placeholder: string;
	displayOptionsBtn?: boolean;
	onOptionsPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	query,
	setQuery,
	placeholder,
	displayOptionsBtn,
	onOptionsPress,
}) => {
	const theme = useSystemTheme();

	return (
		<ThemedView
			theme={theme}
			flex={1}
			style={{
				flexDirection: 'row',
				backgroundColor: Colors[theme].container_surface,
				alignItems: 'center',
				justifyContent: 'space-between',
				width: Dimensions.get('window').width - 24,
				borderRadius: 10,
				marginBottom: 10,
				paddingHorizontal: 12,
				height: 42,
			}}>
			<TextInput
				style={[
					{
						color: Colors[theme].textPrimary,
						backgroundColor: Colors[theme].container_surface,
						cursor: Colors[theme].textPrimary,
						fontSize: 16,
					},
				]}
				placeholderTextColor={'gray'}
				placeholder={placeholder}
				value={query}
				onChangeText={(text) => setQuery(text)}
				clearButtonMode="always"
				cursorColor={Colors[theme].primary}
				maxLength={TextInputMaxCharacters.UserName}
			/>

			{displayOptionsBtn && (
				<TouchableOpacity onPress={onOptionsPress}>
					<Ionicons
						name="options-outline"
						size={18}
						color={Colors[theme].gray}
					/>
				</TouchableOpacity>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({});

export default SearchBar;
