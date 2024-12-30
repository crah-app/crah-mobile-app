import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const Pgae = () => {
  const theme = useSystemTheme();
  const { user } = useUser();

  return (
    <ThemedView theme={theme} flex={1}>
      <SafeAreaView>
        <Text>{user?.emailAddresses[0].emailAddress}</Text>
        <ThemedText theme={theme} value={user?.username!} />

        <View style={[styles.header]}>
          <Link href="/profilePages/settings" asChild>
            <TouchableOpacity>
              <Ionicons
                size={25}
                color={Colors[theme].textPrimary}
                name="settings-outline"
              />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={[styles.main]}></View>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    width: '100%',
    height: '40%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
  main: {
    width: '100%',
  },
});

export default Pgae;
