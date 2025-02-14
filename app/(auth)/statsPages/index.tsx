import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import UserRankColumn from '@/components/UserRankColumn';
import SettingsColumn from '@/components/SettingsColumn';
import { useUser } from '@clerk/clerk-expo';
import LeaderBoardUserCircle from '@/components/LeaderBoardUserCircle';
import HomePageFilterButton from '@/components/home/HomePageFilterButton';
import { UserGalleryTopics } from '@/types';
import Colors from '@/constants/Colors';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const [CurrentGalleryTopic, setCurrentGalleryTopic] =
    useState<UserGalleryTopics>(UserGalleryTopics.USER_RANK);

  const handleGalleryTopic = (newTopic: UserGalleryTopics) => {
    setCurrentGalleryTopic(newTopic);
  };

  return (
    <ThemedView flex={1} theme={theme}>
      <View style={styles.content_container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.header_container}
          style={{ width: 'auto' }}
        >
          {Object.values(UserGalleryTopics).map((val, i) => (
            <HomePageFilterButton
              text={val}
              onPress={() => handleGalleryTopic(val)}
              key={i}
              style={{
                minWidth: 90,
                marginRight: 8,
                justifyContent: 'center',
                height: 35,
                borderColor:
                  CurrentGalleryTopic === val
                    ? Colors[theme].primary
                    : Colors[theme].textPrimary,
                zIndex: 1000,
              }}
              textStyle={{ fontSize: 15 }}
            />
          ))}
        </ScrollView>

        <ScrollView
          style={[styles.leagues_container, { bottom: insets.bottom }]}
        >
          <View style={styles.TopThreeUsers}>
            <LeaderBoardUserCircle
              width={100}
              height={100}
              imageUri={JSON.stringify(user?.imageUrl)}
              rank={2}
              style={{ top: 30 }}
            />
            <LeaderBoardUserCircle
              width={120}
              height={120}
              imageUri={JSON.stringify(user?.imageUrl)}
              rank={1}
            />
            <LeaderBoardUserCircle
              width={100}
              height={100}
              imageUri={JSON.stringify(user?.imageUrl)}
              rank={3}
              style={{ top: 30 }}
            />
          </View>
          <UserRankColumn
            user={JSON.stringify(user)}
            user_id={Number(user?.id)}
            rank={17}
            best_trick="Quad whip flat"
          />
          <UserRankColumn
            user={JSON.stringify(user)}
            user_id={Number(user?.id)}
            rank={17}
            best_trick="Quad whip flat"
          />{' '}
          <UserRankColumn
            user={JSON.stringify(user)}
            user_id={Number(user?.id)}
            rank={17}
            best_trick="Quad whip flat"
          />{' '}
          <UserRankColumn
            user={JSON.stringify(user)}
            user_id={Number(user?.id)}
            rank={17}
            best_trick="Quad whip flat"
          />{' '}
          <UserRankColumn
            user={JSON.stringify(user)}
            user_id={Number(user?.id)}
            rank={17}
            best_trick="Quad whip flat"
          />{' '}
        </ScrollView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  content_container: {},
  TopThreeUsers: {
    paddingTop: 20,
    paddingBottom: 40 + 20,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'space-around',
    gap: 12,
    flexDirection: 'row',
  },
  header_container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    height: 85,
    flexDirection: 'row',
  },
  leagues_container: {},
});

export default Page;
