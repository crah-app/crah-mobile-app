import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import { Link, Stack } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import posts from '../../../JSON/posts.json';
import NoDataPlaceholder from '@/components/NoDataPlaceholder';
import UserPostGridItem from '@/components/UserPostGridItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const Page = () => {
  const theme = useSystemTheme();
  const { user } = useUser();
  const { bottom } = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;

  const pathData = `M0,100 A${windowWidth},${
    windowWidth / 3
  } 0 0,0 ${windowWidth},100`;

  return (
    <ThemedView theme={theme} flex={1}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.upperHeader}>
              <Link asChild href={{ pathname: '/profilePages/inbox' }}>
                <TouchableOpacity style={{ position: 'absolute', left: 10 }}>
                  <Ionicons
                    size={24}
                    color={Colors[theme].textPrimary}
                    name="mail-outline"
                  />
                </TouchableOpacity>
              </Link>

              <Link href="/profilePages/settings" asChild>
                <TouchableOpacity style={{ position: 'absolute', right: 10 }}>
                  <Ionicons
                    size={24}
                    color={Colors[theme].textPrimary}
                    name="settings-outline"
                  />
                </TouchableOpacity>
              </Link>
            </View>

            <Svg
              width={windowWidth}
              height={200}
              style={{ position: 'absolute', top: 10 }}
            >
              <Path
                d={pathData}
                fill="transparent"
                stroke="gray"
                strokeWidth={2}
              />
            </Svg>

            <View style={[styles.header]}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <ThemedText
                  theme={theme}
                  value={
                    user?.username! == '' ? user?.fullName! : user?.username!
                  }
                  style={[styles.UserName]}
                />
                <Image
                  height={64}
                  width={64}
                  source={{ uri: user?.imageUrl }}
                  style={[styles.UserProfile]}
                />
              </View>
            </View>

            <View style={[styles.main]}>
              <View style={{ flex: 1, bottom }}>
                {posts.length > 0 ? (
                  <FlatList
                    style={styles.PostsGridContainer}
                    data={posts}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    renderItem={({ item, index }) => (
                      <UserPostGridItem post={item} style={[styles.GridItem]} />
                    )}
                    contentContainerStyle={[styles.flatListContainer, {}]}
                  />
                ) : (
                  <NoDataPlaceholder />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  upperHeader: {
    width: '100%',
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatListContainer: {},
  header: {
    width: '100%',
    height: 500,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
    paddingTop: 20,
    paddingBottom: 15,
  },
  UserName: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  UserProfile: {
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 2,
  },
  main: {
    width: '100%',
    flex: 1,
  },
  PostsGridContainer: {},
  GridItem: {
    width: '33.33%',
    aspectRatio: 1,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page;
