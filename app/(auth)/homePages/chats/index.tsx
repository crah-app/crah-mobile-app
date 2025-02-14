import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useUser } from '@clerk/clerk-expo';
import messages from '@/JSON/messages.json';
import MessageColumn from '@/components/MessageColumn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();
  const { bottom } = useSafeAreaInsets();

  return (
    <ThemedView theme={theme} flex={1}>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: true,
          headerShown: true,
          headerSearchBarOptions: { placeholder: 'Search for a chat' },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors[theme].textPrimary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <SafeAreaView>
          <View style={[styles.messages_container]}>
            <View style={{ padding: 10 }}>
              <ThemedText theme={theme} value={'latest'} />
            </View>

            <FlatList
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: Colors[theme].textPrimary,
                    marginHorizontal: 0,
                  }}
                />
              )}
              data={messages}
              keyExtractor={(item) => item._id.toString()}
              contentContainerStyle={[styles.message_list_container]}
              renderItem={(listItem) => {
                return <MessageColumn id={listItem.item._id} />;
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  messages_container: {
    flexDirection: 'column',
  },
  message_list_container: {},
});

export default Page;
