import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { SvgXml } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './ThemedText';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import Scooter from '../assets/images/vectors/scooter.svg';

interface SettingsColumnProps {
  type: 'ordinary' | 'unordinary';
  text: string;
  icon: string;
  svg: boolean;
  hasIcon: boolean;
}

const SettingsColumn: React.FC<SettingsColumnProps> = ({
  type,
  text,
  icon,
  svg,
  hasIcon,
}) => {
  const theme = useSystemTheme();
  const { signOut } = useAuth();

  const handleClick = async () => {
    if (text === 'Sign Out') {
      await handleSignOut();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (err) {
      console.error('error signing out:', err);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        type === 'ordinary' && {
          backgroundColor: Colors[theme].textBubbleOther,
        },
      ]}
      onPress={handleClick}
    >
      {svg ? (
        <SvgXml
          width="25"
          height="25"
          xml={Scooter}
          fill={Colors[theme].textPrimary}
          style={[{ color: Colors[theme].textPrimary, marginRight: -2 }]}
        />
      ) : (
        <View>
          {hasIcon && (
            <Ionicons name={icon} size={24} color={Colors[theme].textPrimary} />
          )}
        </View>
      )}

      <ThemedText
        theme={theme}
        value={text}
        style={[
          styles.text,
          type === 'unordinary' && {
            color: 'red',
            textAlign: 'center',
            width: '100%',
            marginLeft: 0,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    // borderRadius: 6,
    // marginVertical: 6,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default SettingsColumn;
