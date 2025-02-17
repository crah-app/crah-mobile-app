import ThemedView from '@/components/ThemedView';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { SearchTypes, ExplorePostOrder, Tags } from '@/types';
import PostTypeButton from '@/components/PostTypeButton';
import posts from '../../../JSON/posts.json'; // posts that are relevant for the search section
import { filterPosts } from '@/utils/globalFuncs';
import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import UserPost from '@/components/UserPost';
import Tag from '@/components/tag';

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    'all',
  );
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>(
    ExplorePostOrder['toOldest'],
  );
  const [friendsOnly, setFriendsOnly] = useState(false);

  const theme = useSystemTheme();

  // filter categories
  const FilterPosts = (type: string) => {
    filterPosts(posts, type);
    setSelectedCategory(type);
  };

  // filter tags
  const handleTagPress = (tag: string) => {
    setSelectedTag(tag === selectedTag ? undefined : tag);
  };

  // friends only checkbox
  const toggleCheckbox = () => {
    setFriendsOnly(!friendsOnly);
  };

  return (
    <ThemedView theme={theme}>
      <SafeAreaView>
        <ScrollView>
          <ThemedView theme={theme} style={styles.container}>
            <View style={styles.category_container}>
              {Object.entries(SearchTypes).map(([key, value]) => (
                <PostTypeButton
                  key={key}
                  val={value}
                  click_action={() => {
                    setSelectedCategory(key);
                    FilterPosts(key);
                  }}
                  style={{
                    backgroundColor:
                      key === selectedCategory
                        ? 'rgba(255, 0, 0, 0.5)'
                        : 'transparent',
                    borderColor: Colors.default.primary,
                    borderWidth: 1,
                    minWidth: 90,
                    maxWidth: 90,
                    shadowColor: 'transparent',
                  }}
                  fontStyle={{
                    fontSize: 13,
                  }}
                />
              ))}
            </View>

            <View style={[{ padding: 12.5, bottom: 20 }]}>
              <View
                style={[
                  { padding: 20, flexDirection: 'column', width: '100%' },
                  {
                    backgroundColor: Colors[theme].container_surface,
                    borderRadius: 10,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.tag_container_left]}>
                    <ThemedText theme={theme} value={'tags'} />
                  </View>

                  <View style={[styles.tag_container]}>
                    {Object.values(Tags).map((tag) => {
                      const isSelected = tag === selectedTag;
                      return (
                        <Tag
                          handleTagPress={() => handleTagPress(tag)}
                          isSelectedOnClick={isSelected}
                          tag={tag}
                          theme={theme}
                          key={tag}
                        />
                      );
                    })}
                  </View>
                </View>

                <View style={{ marginTop: 35, flexDirection: 'row' }}>
                  <View style={[styles.tag_container_left]}>
                    <ThemedText theme={theme} value={'order'} />
                  </View>

                  <View style={{ gap: 10, flexDirection: 'row' }}>
                    {Object.keys(ExplorePostOrder).map((val) => {
                      return (
                        <TouchableOpacity
                          key={val}
                          onPress={() =>
                            setSelectedOrder(ExplorePostOrder[val])
                          }
                        >
                          <ThemedText
                            theme={theme}
                            value={ExplorePostOrder[val]}
                            style={[
                              styles.text2,
                              { borderColor: Colors[theme].textPrimary },
                              {
                                backgroundColor:
                                  selectedOrder === ExplorePostOrder[val]
                                    ? 'rgba(255,0,0,0.4)'
                                    : 'transparent',
                              },
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={{ marginTop: 35, flexDirection: 'row' }}>
                  <View
                    style={[
                      styles.tag_container_left,
                      { marginRight: 5, width: '25%' },
                    ]}
                  >
                    <ThemedText theme={theme} value={'friends only'} />
                  </View>

                  <View
                    style={{
                      gap: 10,
                      flexDirection: 'row',
                      bottom: 4,
                    }}
                  >
                    <BouncyCheckbox
                      size={25}
                      fillColor="red"
                      text="Custom Checkbox"
                      iconStyle={{ borderColor: 'red' }}
                      innerIconStyle={{ borderWidth: 2 }}
                      onPress={(isChecked: boolean) => {
                        console.log(isChecked);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ThemedView>

          <View style={[styles.PostViewContainer]}>
            <UserPost post={posts[0]} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    // backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  category_container: {
    width: Dimensions.get('window').width,
    maxHeight: '25%',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    padding: 12.5,
  },
  tag_container: {
    width: Dimensions.get('window').width / 1.5,
    borderRadius: 20,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag_container_left: {
    width: '15%',
    height: '100%',
  },
  text2: {
    borderWidth: 1.25,
    borderRadius: 10,
    minWidth: 130,
    maxWidth: 130,
    shadowColor: 'transparent',
    padding: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  rectContainer: {
    marginBottom: 10,
  },
  PostViewContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingBottom: 65,
  },
});

export default Page;
