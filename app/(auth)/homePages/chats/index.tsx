import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Animated,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useUser } from '@clerk/clerk-expo';
import messages from '@/JSON/messages.json';
import MessageColumn from '@/components/MessageColumn';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();

  return (
    <ThemedView theme={theme} flex={1}>
      <SafeAreaView>
        <View style={[styles.messages_container]}>
          <View style={{ padding: 10 }}>
            <ThemedText theme={theme} value={'latest'} />
          </View>

          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
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
              renderItem={(item) => {
                console.log(item);

                return <MessageColumn />;
              }}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
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
