import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsColumn from '@/components/SettingsColumn';
import UserRankColumn from '@/components/UserRankColumn';
import { useUser } from '@clerk/clerk-expo';
import LeaderBoardUserCircle from '@/components/LeaderBoardUserCircle';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();

  return (
    <ThemedView flex={1} theme={theme}>
      <SafeAreaView>
        {/* "Your Trick" Button */}
        {/* <SettingsColumn
          type="ordinary"
          text="Trick List"
          icon="list-outline"
          hasIcon={true}
          svg={false}
        /> */}

        <ScrollView>
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
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  TopThreeUsers: {
    width: '100%',
    height: '50%',
    alignContent: 'center',
    justifyContent: 'space-around',
    gap: 12,
    flexDirection: 'row',
  },
});

export default Page;
