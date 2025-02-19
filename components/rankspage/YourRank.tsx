import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemedText from '../ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';

interface YourRankProps {
  user?: string;
}

const YourRank: React.FC<YourRankProps> = ({ user: User }) => {
  const user = JSON.parse(User || '{}');
  const theme = useSystemTheme();

  const insets = useSafeAreaInsets();

  return (
    <View style={[{ bottom: insets.bottom }, styles.container]}>
      <ThemedText theme={theme} value="trick builder" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'pink',
    flex: 0,
    height: Dimensions.get('window').height,
  },
});

export default YourRank;
