import Colors from '@/constants/Colors';
import { TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import {
	Dimensions,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';
import ThemedView from './ThemedView';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
	query: string;
	setQuery: (string: string) => void;
	placeholder: string;
	displayOptionsBtn?: boolean;
	onOptionsPress?: () => void;
	flex?: number;
	containerStyle?: ViewStyle;
	displayLeftSearchIcon?: boolean;
	displayCloseRequestBtn?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
	query,
	setQuery,
	placeholder,
	displayOptionsBtn,
	onOptionsPress,
	flex,
	containerStyle,
	displayLeftSearchIcon = false,
	displayCloseRequestBtn = true,
}) => {
	const theme = useSystemTheme();

	return (
		<ThemedView
			theme={theme}
			flex={flex ?? 1}
			style={[
				// @ts-ignore
				containerStyle,
				{
					flexDirection: 'row',
					backgroundColor: Colors[theme].container_surface,
					alignItems: 'center',
					justifyContent: 'space-between',
					width: Dimensions.get('window').width - 24,
					borderRadius: 10,
					marginBottom: 10,
					paddingHorizontal: 12,
					height: 42,
					maxHeight: 42,
					minHeight: 42,
				},
			]}>
			{displayLeftSearchIcon && (
				<Ionicons name={'search'} size={22} color={Colors[theme].gray} />
			)}
			<TextInput
				style={[
					{
						marginLeft: 12,
						flex: 1,
						color: Colors[theme].textPrimary,
						backgroundColor: Colors[theme].container_surface,
						cursor: Colors[theme].textPrimary,
						fontSize: 18,
					},
				]}
				placeholderTextColor={'gray'}
				placeholder={placeholder}
				value={query}
				onChangeText={setQuery}
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

			{displayCloseRequestBtn && !displayOptionsBtn && query.length > 0 && (
				<TouchableOpacity
					onPress={() => {
						setQuery('');
					}}>
					<Ionicons name="close-outline" size={18} color={Colors[theme].gray} />
				</TouchableOpacity>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({});

export default SearchBar;
