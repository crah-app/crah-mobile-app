import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Stack } from 'expo-router';
import { SearchBar } from 'react-native-screens';
import TrickColumn from '../TrickColumn';
import { TrickDifficulty } from '@/types';

interface TricksProps {}

const Tricks: React.FC<TricksProps> = ({}) => {
  const insets = useSafeAreaInsets();
  const theme = useSystemTheme();

  return (
    <View style={[{ bottom: insets.bottom }, styles.container]}>
      <FlatList
        data={[
          {
            name: 'buttercup',
            points: 200,
            difficulty: TrickDifficulty.HARD,
            id: 0,
          },
          {
            name: 'double fingerwhip',
            points: 170,
            difficulty: TrickDifficulty.ADVANCED,
            id: 1,
          },
        ]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TrickColumn
            name={item.name}
            points={item.points}
            difficulty={item.difficulty}
          />
        )}
        ListHeaderComponent={TrickListHeader}
      />
    </View>
  );
};

const TrickListHeader = () => {
  return (
    <SearchBar
      // round={true}
      // lightTheme={true}
      placeholder="Search..."
      autoCapitalize="none"
      // autoCorrect={false}
      // onChangeText={this.search}
      // value={this.state.searchText}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 0,
    height: Dimensions.get('window').height,
  },
});

export default Tricks;
