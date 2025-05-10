import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import React, { useState, useRef } from 'react';
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	ViewStyle,
	TextStyle,
	NativeSyntheticEvent,
	TextInputKeyPressEventData,
} from 'react-native';
import ThemedText from './ThemedText';

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
	disabled?: boolean;
	onPress?: () => void;
	makeWordToBubble: boolean;
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
	disabled,
	onPress,
	makeWordToBubble,
}) => {
	const [bubbles, setBubbles] = useState<string[]>([]);

	const previousValue = useRef<string>('');

	const handleChangeText = (text: string) => {
		if (!makeWordToBubble) {
			setValue(text);
			return;
		}

		// Check: war vorher ein Text da, jetzt weniger oder leer?
		if (previousValue.current.length > text.length) {
			// Zeichen gelöscht
			if (text.length === 0 && bubbles.length > 0) {
				setBubbles((prev) => prev.slice(0, -1));
			}
		}

		// Word abgeschlossen mit Space?
		if (text.endsWith(' ')) {
			const word = text.trim();
			if (word.length > 0) {
				setBubbles((prev) => [...prev, word]);
			}
			setValue('');
		} else {
			setValue(text);
		}

		// Update previousValue am Ende!
		previousValue.current = text;
	};

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
	) => {
		if (!makeWordToBubble) return;

		// hit BACKSPACE
		console.log('Backspace', e.nativeEvent.key);
		console.log(value.length, bubbles.length);
		console.log(bubbles);
		if (e.nativeEvent.key === 'Backspace') {
			if (value.length === 0 && bubbles.length > 0) {
				setBubbles((prev) => prev.slice(0, -1));
			}
		}
	};

	return (
		<View
			style={{
				backgroundColor: Colors[theme].container_surface,
				borderRadius: 8,
				padding: 8,
				flexDirection: 'row',
				flexWrap: 'wrap',
				alignItems: 'center',
				minHeight: 50,
			}}>
			{/* Alle Bubbles */}
			{bubbles.map((bubble, index) => (
				<View
					key={index}
					style={{
						paddingHorizontal: 10,
						paddingVertical: 5,
						borderRadius: 20,
						borderWidth: 1,
						borderColor: Colors[theme].textPrimary,
						margin: 4,
						backgroundColor: 'transparent',
					}}>
					<Text style={{ color: Colors[theme].textPrimary }}>{bubble}</Text>
				</View>
			))}

			{/* TextInput */}
			<TextInput
				cursorColor={Colors[theme].primary}
				value={value}
				onChangeText={handleChangeText}
				onKeyPress={handleKeyPress}
				placeholder={bubbles.length > 0 ? '' : placeholder}
				placeholderTextColor="gray"
				clearButtonMode={clearButton}
				autoCapitalize="none"
				style={[
					{
						color: Colors[theme].textPrimary,
						minWidth: 50,
						flexGrow: 1,
						flexShrink: 1,
					},
					defaultStyles.textInput,
					style,
				]}
				editable={!disabled}
				onTouchStart={disabled ? onPress : undefined}
				onTouchEnd={disabled ? onPress : undefined}
				multiline={multiline ?? false}
				numberOfLines={lines ?? 1}
				maxLength={maxLength}
			/>

			{/* Zeichenlänge */}
			{showLength && (
				<ThemedText
					value={`${value.length}/${maxLength}`}
					theme={theme}
					style={{
						position: 'absolute',
						right: 8,
						bottom: 8,
					}}
				/>
			)}

			{/* Extra Children */}
			{children && (
				<View style={[{ padding: 12 }, childrenContainerStyle]}>
					{children}
				</View>
			)}
		</View>
	);
};

export default ThemedTextInput;
