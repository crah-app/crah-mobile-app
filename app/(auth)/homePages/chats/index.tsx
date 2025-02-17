import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { ChatFilterTypes, UserStatus } from '@/types';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();
  const { bottom } = useSafeAreaInsets();

  const [messagesFilterSelected, setMessagesFilter] = useState<
    keyof typeof ChatFilterTypes | string
  >(ChatFilterTypes[0]);

  const [messagesDateFilter, setMessagesDateFilter] = useState<
    'latest' | 'oldest'
  >('latest');

  const HandleFilterMessagesType = (
    value: keyof typeof ChatFilterTypes | string,
  ) => {
    setMessagesFilter((prev) => {
      return value;
    });
  };

  const HandleMessagesDateFilter = () => {
    setMessagesDateFilter((prev) => {
      return prev === 'oldest' ? 'latest' : 'oldest';
    });
  };

  return (
    <ThemedView theme={theme} flex={1}>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerTintColor: Colors[theme].textPrimary,
          headerLargeTitle: false,
          headerShown: true,
          headerSearchBarOptions: { placeholder: 'Search' },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors[theme].textPrimary}
              />
            </TouchableOpacity>
          ),

          headerTitle: () => (
            <View style={{ flex: 1 }}>
              <HeaderLeftLogo
                style={{
                  bottom: -20,
                }}
              />
            </View>
          ),

          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal-outline"
                  size={24}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        <SafeAreaView>
          <View style={{ gap: 0, marginTop: 0 }}>
            <View style={[styles.ContentFilterContainer]}>
              {ChatFilterTypes.map((value: string, index: number) => {
                return (
                  <HomePageFilterButton
                    key={value}
                    text={value}
                    onPress={() => HandleFilterMessagesType(value)}
                    style={[
                      {
                        borderColor:
                          messagesFilterSelected === value
                            ? Colors[theme].primary
                            : Colors[theme].textPrimary,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
              <TouchableOpacity
                onPress={() => HandleMessagesDateFilter()}
                style={{ flexDirection: 'row' }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors[theme].textPrimary}
                />
                <ThemedText theme={theme} value={messagesDateFilter} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.messages_container]}>
            <FlatList
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    // borderBottomWidth: StyleSheet.hairlineWidth,
                    // borderBottomColor: Colors[theme].textPrimary,
                    marginHorizontal: 0,
                  }}
                />
              )}
              data={messages}
              keyExtractor={(item) => item._id.toString()}
              contentContainerStyle={[
                styles.message_list_container,
                { borderColor: 'gray' },
              ]}
              renderItem={(listItem) => {
                return (
                  <MessageColumn
                    id={listItem.item._id}
                    name={listItem.item.user.name}
                    avatar={listItem.item.user.avatar}
                    lastActive={new Date(listItem.item.createdAt)}
                    status={
                      listItem.item.user.status != 'online'
                        ? UserStatus.OFFLINE
                        : UserStatus.ONLINE
                    }
                  />
                );
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
  message_list_container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ContentFilterContainer: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
  },
});

export default Page;
