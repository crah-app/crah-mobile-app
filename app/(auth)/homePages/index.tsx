import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
  Easing,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import UserPost from '@/components/UserPost';
import NoDataPlaceholder from '@/components/NoDataPlaceholder';

// dummy data
import posts from '../../../JSON/posts.json';
import { Filter, SvgXml } from 'react-native-svg';
import { Link, Stack } from 'expo-router';

import ScooterBar from '../../../assets/images/vectors/bar.svg';
import ScooterWheel from '../../../assets/images/vectors/wheel.svg';
import ScooterWheelReflexes from '../../../assets/images/vectors/wheel_reflexes.svg';
import { Ionicons } from '@expo/vector-icons';
import { PostType, PostTypes } from '@/types';
import PostTypeButton from '@/components/PostTypeButton';
import { filterPosts } from '@/utils/globalFuncs';

const Page = () => {
  const theme = useSystemTheme();
  const [FilterIsVisible, setFilterVisibility] = useState(false);
  const { width, height } = useWindowDimensions();
  const [UserPosts, SetUserPosts] = useState(posts);

  const rotation = useRef(new Animated.Value(0)).current;

  const handleClickWheel = () => {
    setFilterVisibility(!FilterIsVisible);

    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const FilterPosts = (type: string) => {
    let filteredPosts = filterPosts(posts, type);

    SetUserPosts(filteredPosts);
    setFilterVisibility(false);
  };

  return (
    <ThemedView theme={theme} flex={1}>
      <Stack.Screen
        options={{
          headerTitle: () => <View></View>,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity onPress={handleClickWheel}>
                <Animated.View
                  style={[
                    {
                      transform: [{ rotate: rotateInterpolate }],
                    },
                  ]}
                >
                  <SvgXml
                    width="25"
                    height="25"
                    xml={ScooterWheelReflexes}
                    style={[
                      {
                        color: Colors[theme].textPrimary,
                      },
                    ]}
                  />
                </Animated.View>
              </TouchableOpacity>

              <Link
                asChild
                href={{
                  params: {},
                  pathname: '/homePages/messages',
                }}
              >
                <TouchableOpacity>
                  <SvgXml
                    width="25"
                    height="25"
                    xml={ScooterBar}
                    style={[
                      {
                        color: Colors[theme].textPrimary,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
      />

      {UserPosts.length > 0 ? (
        <FlatList
          data={UserPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UserPost post={item} />}
          contentContainerStyle={[styles.flatListContainer]}
        />
      ) : (
        <NoDataPlaceholder />
      )}

      <Modal
        visible={FilterIsVisible}
        presentationStyle="overFullScreen"
        animationType="fade"
        transparent
        statusBarTranslucent
      >
        <View style={styles.PopUpBackground}>
          <View
            style={[
              styles.popUpInnerWrapper,
              {
                top: height / 3.5,
                left: width / 10,
                width: (width / 10) * 8,
                height: (height / 10) * 4.5,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: Colors[theme].surface,
              },
            ]}
          >
            <ThemedView
              theme={theme}
              style={[
                styles.header,
                { backgroundColor: Colors[theme].surface },
              ]}
            >
              <TouchableOpacity onPress={() => setFilterVisibility(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>

              <ThemedText
                theme={theme}
                value={'Filter Content'}
                style={{ fontSize: 25, fontWeight: '600' }}
              />

              <View></View>
            </ThemedView>
            <ThemedView theme={theme} style={[styles.main]} flex={1}>
              <View style={[styles.FilterGrid]}>
                {Object.values(PostTypes).map((val, key) => (
                  <PostTypeButton
                    key={key}
                    val={val}
                    click_action={() =>
                      FilterPosts(`${Object.keys(PostTypes)[key]}`)
                    }
                  />
                ))}
              </View>
            </ThemedView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    // paddingHorizontal: 15,
    // paddingTop: 10,
    paddingBottom: 100,
  },
  popUpInnerWrapper: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  PopUpBackground: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    alignItems: 'center',
  },
  main: {
    width: '100%',
    paddingHorizontal: 20,
  },
  FilterGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    height: '100%',
  },
  FilterButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: 200,
  },
  FilterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Page;
