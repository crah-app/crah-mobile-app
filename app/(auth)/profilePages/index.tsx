import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';

const Pgae = () => {
  const theme = useSystemTheme();
  const { user } = useUser();

  return (
    <ThemedView theme={theme} flex={1}>
      <Text>{user?.emailAddresses[0].emailAddress}</Text>
      <ThemedText theme={theme} value={user?.username!} />

      <Link href="/profile/settings" asChild>
        <TouchableOpacity>
          <ThemedText theme={theme} value="settings" />
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
};

export default Pgae;
