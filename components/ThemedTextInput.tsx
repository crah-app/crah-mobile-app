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
}) => {
  const [text, setText] = useState<string>('');

  return (
    <View
      style={{
        backgroundColor: Colors[theme].container_surface,
        borderRadius: 8,
        paddingBottom: showLength ? 8 : 0,
        paddingRight: showLength ? 8 : 0,

        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <View
        style={{
          justifyContent: 'space-between',
          height: multiline ? 75 * (lines || 1) : 'auto',
        }}
      >
        <TextInput
          onChangeText={(newText) => setText(newText)}
          value={text}
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
            value={`${text?.length}/${maxLength}`}
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
