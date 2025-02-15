import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TrickBuilderProps {}

const TrickBuilder: React.FC<TrickBuilderProps> = ({}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          bottom: insets.bottom,
        },
      ]}
    >
      trick builder
    </View>
  );
};

const styles = StyleSheet.create({});

export default TrickBuilder;
