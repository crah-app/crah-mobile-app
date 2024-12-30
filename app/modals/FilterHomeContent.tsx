import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { PostType, PostTypes } from '@/types';

const FilterHomeContent = () => {
  const theme = useSystemTheme();

  return (
    <ThemedView theme={theme} flex={0}>
      <Modal visible={true} presentationStyle="formSheet">
        <ThemedView theme={theme} style={[styles.header]}>
          <TouchableOpacity>
            <Ionicons
              name="close"
              size={24}
              color={Colors[theme].textPrimary}
            />
          </TouchableOpacity>

          <ThemedText theme={theme} value={'Filter Content'} />

          <View></View>
        </ThemedView>
        <ThemedView theme={theme} style={[styles.main]}>
          <View style={[styles.FilterGrid]}>
            {Object.values(PostTypes).map((val, key) => (
              <ThemedText theme={theme} value={val} key={key} />
            ))}
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  main: {
    width: '100%',
  },
  FilterGrid: {
    gap: 10,
  },
});

export default FilterHomeContent;
