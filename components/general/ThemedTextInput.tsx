import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import React, {
	useState,
	useRef,
	forwardRef,
	Dispatch,
	SetStateAction,
} from 'react';
import {
	View,
	TextInput,
	Text,
	TouchableOpacity,
	ViewStyle,
	TextStyle,
	NativeSyntheticEvent,
	TextInputKeyPressEventData,
	Dimensions,
} from 'react-native';
import ThemedText from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface ThemedTextInputProps {
	isSecret?: boolean;
	setSecret?: Dispatch<SetStateAction<boolean>>;
	secret?: boolean;
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
	makeWordToBubble?: boolean;
	containerStyle?: ViewStyle | ViewStyle[];
	allowSpace?: boolean;
	outerContainerStyle?: ViewStyle | ViewStyle[];
	textInputWrapperStyle?: ViewStyle | ViewStyle[];
}

const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
	(
		{
			isSecret = false,
			setSecret = (b: boolean) => {},
			secret = false,
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
			containerStyle,
			allowSpace = true,
			outerContainerStyle,
			textInputWrapperStyle,
		},
		ref,
	) => {
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
				style={[
					{
						backgroundColor: Colors[theme].container_surface,
						borderRadius: 8,
						padding: 8,
						flexDirection: 'row',
						flexWrap: 'wrap',
						alignItems: 'center',
						minHeight: 50,
						// borderBottomWidth: 1,
						// borderBottomColor: 'rgb(15, 15, 15)',
					},
					outerContainerStyle,
				]}>
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
						style={[
							{
								justifyContent: 'space-between',
								height: multiline ? 10 * (lines || 1) : 'auto',
								width: '100%',
								flexDirection: isSecret ? 'row' : 'column',
							},
							textInputWrapperStyle,
						]}>
						<TextInput
							secureTextEntry={isSecret}
							autoCorrect={false}
							ref={ref}
							placeholderTextColor={'gray'}
							clearButtonMode={clearButton}
							autoCapitalize={'none'}
							onChangeText={(newText) => {
								let cleaned = newText.replace(/\s/g, '');

								if (allowSpace) {
									setValue(newText);
									return;
								}

								setValue(cleaned);
							}}
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
									minWidth: '88%',
								},
								defaultStyles.textInput,
								style,
							]}
							editable={!disabled}
							onTouchStart={disabled ? onPress : undefined}
							onTouchEnd={disabled ? onPress : undefined}
							onTouchCancel={disabled ? onPress : undefined}
							onTouchEndCapture={disabled ? onPress : undefined}
							cursorColor={Colors[theme].primary}
						/>

						{isSecret && (
							<TouchableOpacity onPress={() => setSecret(!secret)}>
								<Ionicons
									name={secret ? 'eye-off-outline' : 'eye-outline'}
									size={22}
									color={Colors[theme].textSecondary}
									style={{
										height: 'auto',
										padding: 10,
									}}
								/>
							</TouchableOpacity>
						)}

						<View />
						{/* Zeichenlänge */}
						{showLength && (
							<View
								style={{
									width: '100%',
									backgroundColor: 'blue',
									justifyContent: 'flex-end',
									alignItems: 'center',
								}}>
								<ThemedText
									value={`${value.length}/${maxLength}`}
									theme={theme}
									style={{
										position: 'absolute',
										right: 8,
										color: Colors[theme].gray,
									}}
								/>
							</View>
						)}

						{/* Extra Children */}
						{children && (
							<View style={[{ padding: 12 }, childrenContainerStyle]}>
								{children}
							</View>
						)}
					</View>
				</View>
			</View>
		);
	},
);

const ThemedMemoTextInput = ThemedTextInput;

export default ThemedMemoTextInput;
