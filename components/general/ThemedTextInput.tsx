import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import React, { Children, useState } from 'react';
import {
	StyleSheet,
	TextInput,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import ThemedText from './ThemedText';

// do not mix showLength with children
interface ThemedTextInputProps {
	theme: 'light' | 'dark';
	style?: TextStyle | TextStyle[];
	placeholder?: string;
	lines?: number;
	multiline?: boolean;
	maxLength?: number;
	showLength?: boolean;
	children?: React.ReactNode;
	childrenContainerStyle?: ViewStyle | ViewStyle[];
	value: string;
	setValue: (text: string) => void;
	clearButton?:
		| 'always'
		| 'never'
		| 'while-editing'
		| 'unless-editing'
		| undefined;
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
	theme,
	style,
	placeholder,
	lines,
	multiline,
	maxLength,
	showLength,
	children,
	childrenContainerStyle,
	value,
	setValue,
	clearButton,
}) => {
	return (
		<View
			style={{
				backgroundColor: Colors[theme].container_surface,
				borderRadius: 8,
				paddingBottom: showLength ? 8 : 0,
				paddingRight: showLength ? 8 : 0,
				flexDirection: 'column',
				position: 'relative',
			}}>
			<View
				style={{
					justifyContent: 'space-between',
					height: multiline ? 75 * (lines || 1) : 'auto',
				}}>
				<TextInput
					clearButtonMode={clearButton}
					autoCapitalize={'none'}
					onChangeText={(newText) => setValue(newText)}
					value={value}
					maxLength={maxLength || 50}
					multiline={multiline || true}
					numberOfLines={lines || 3}
					placeholder={placeholder}
					style={[
						{
							backgroundColor: Colors[theme].container_surface,
							color: Colors[theme].textPrimary,
							textAlignVertical: 'top',
						},
						defaultStyles.textInput,
						style,
					]}
				/>

				{showLength && (
					<ThemedText
						value={`${value?.length}/${maxLength}`}
						theme={theme}
						style={{
							alignSelf: 'flex-end',
						}}
					/>
				)}

				{children && (
					<View style={[{ padding: 12 }, childrenContainerStyle]}>
						{children}
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default ThemedTextInput;
