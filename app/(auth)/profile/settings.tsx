import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

const Page = () => {
  const { signOut } = useAuth();
  const theme = useSystemTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (err) {
      console.error('Fehler beim Abmelden:', err);
    }
  };

  return (
    <ThemedView flex={1} theme={theme}>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <ThemedText
          theme={theme}
          value="sign out"
          style={[styles.buttonText, { color: Colors['default'].primary }]}
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Page;
