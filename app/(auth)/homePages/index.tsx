import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import UserPost from '@/components/UserPost';
import NoDataPlaceholder from '@/components/NoDataPlaceholder';

// dummy data
import posts from '../../../JSON/posts.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Page = () => {
  const theme = useSystemTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <ThemedView theme={theme} style={{ flex: 1 }}>
      {/* <ScrollView style={[styles.ScrollViewContainer]}> */}
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UserPost post={item} />}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <NoDataPlaceholder />
      )}
      {/* </ScrollView> */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 100,
  },
  ScrollViewContainer: {
    // paddingBottom
  },
});

export default Page;
