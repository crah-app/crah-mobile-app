import ThemedView from '@/components/ThemedView';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { SearchTypes } from '@/types';
import PostTypeButton from '@/components/PostTypeButton';
import posts from '../../../JSON/posts.json'; // posts that are relevant for the search section
import { filterPosts } from '@/utils/globalFuncs';

const Page = () => {
  const [FilterIsVisible, setFilterVisibility] = useState(false);
  const [UserPosts, SetUserPosts] = useState(posts);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

  const theme = useSystemTheme();

  const FilterPosts = (type: string) => {
    filterPosts(posts, type);
    setSelectedCategory(type);
  };

  return (
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
              width: 150,
              shadowColor: 'transparent',
            }}
            fontStyle={{
              fontSize: 13,
            }}
          />
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  category_container: {
    width: Dimensions.get('window').width,
    height: '25%',
    maxHeight: '25%',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default Page;
