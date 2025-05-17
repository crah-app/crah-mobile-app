import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import React, { Children, useState } from 'react';
import {
	KeyboardAvoidingView,
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
	disabled?: boolean; // Add this line
	onPress?: () => void; // Add this line
	containerStyle: ViewStyle | ViewStyle[];
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
	disabled, // Add this line
	onPress, // Add this line
	containerStyle,
}) => {
	return (
		<View
			style={[
				containerStyle,
				{
					backgroundColor: Colors[theme].container_surface,
					borderRadius: 8,
					paddingBottom: showLength ? 8 : 0,
					paddingRight: showLength ? 8 : 0,
					flexDirection: 'column',
					position: 'relative',
				},
			]}>
			<View
				style={{
					justifyContent: 'space-between',
					height: multiline ? 10 * (lines || 1) : 'auto',
				}}>
				<TextInput
					placeholderTextColor={'gray'}
					clearButtonMode={clearButton}
					autoCapitalize={'none'}
					onChangeText={(newText) => setValue(newText)}
					value={value}
					maxLength={maxLength ?? 50}
					multiline={multiline ?? false}
					numberOfLines={lines ?? 1}
					placeholder={placeholder}
					style={[
						{
							backgroundColor: Colors[theme].container_surface,
							color: Colors[theme].textPrimary,
							textAlignVertical: 'top',
							maxHeight: 200,
						},
						defaultStyles.textInput,
						style,
					]}
					editable={!disabled}
					onTouchStart={disabled ? onPress : undefined}
					onTouchEnd={disabled ? onPress : undefined}
					onTouchCancel={disabled ? onPress : undefined}
					onTouchEndCapture={disabled ? onPress : undefined}
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
