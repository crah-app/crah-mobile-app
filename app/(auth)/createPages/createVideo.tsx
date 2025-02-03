import ThemedText from '@/components/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const CreateVideo = () => {
  const theme = useSystemTheme();
  return (
    <View>
      <ThemedText theme={theme} value={'Video'} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CreateVideo;
