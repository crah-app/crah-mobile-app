import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface SecuredPasswordInputProps {
  password: string;
  placeholder: string;
  setPassword: (text: string) => void;
  Viewstyle?: ViewStyle | ViewStyle[];
  InputStyle?: TextStyle | TextStyle[];
}

const SecuredPasswordInput: React.FC<SecuredPasswordInputProps> = ({
  password,
  placeholder,
  setPassword,
  Viewstyle,
  InputStyle,
}) => {
  const theme = useSystemTheme();
  const [isSecured, setIsSecured] = useState<boolean>(true);

  return (
    <View
      style={[
        Viewstyle,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors[theme].surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors[theme].borderColor,
          height: 50,
        },
      ]}
    >
      <TextInput
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={isSecured}
        style={[
          styles.inputField,
          InputStyle,
          {
            height: 48,
            borderWidth: 0,
            backgroundColor: Colors[theme].surface,
            color: Colors[theme].textPrimary,
            maxWidth: 300,
            width: 300,
          },
        ]}
      />

      <TouchableOpacity onPress={() => setIsSecured(!isSecured)}>
        <Ionicons
          name={isSecured ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color={Colors[theme].textSecondary}
          style={{
            height: 'auto',
            textAlign: 'center',
            justifyContent: 'center',
            padding: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors['default'].borderColor,
    borderRadius: 12,
    padding: 10,
  },
});

export default SecuredPasswordInput;
