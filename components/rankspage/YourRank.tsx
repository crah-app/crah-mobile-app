import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface YourRankProps {
  user?: string;
}

const YourRank: React.FC<YourRankProps> = ({ user: User }) => {
  const user = JSON.parse(User || '{}');

  const insets = useSafeAreaInsets();

  return <View style={[{ bottom: insets.bottom }]}>Your Rank</View>;
};

const styles = StyleSheet.create({});

export default YourRank;
