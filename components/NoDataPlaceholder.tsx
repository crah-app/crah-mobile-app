import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

import arrow from '../assets/images/vectors/arrow-to-down-right-svgrepo-com.svg';
import { SvgXml } from 'react-native-svg';
import { Link } from 'expo-router';
import { useSystemTheme } from '@/utils/useSystemTheme';

const NoDataPlaceholder = () => {
  const theme = useSystemTheme();

  return (
    <View style={styles.placeholderContainer}>
      <SvgXml
        width="30"
        height="30"
        xml={arrow}
        fill={Colors[theme].textPrimary}
        style={[
          styles.arrow,
          {
            color: Colors[theme].textPrimary,
          },
        ]}
      />

      <Text style={styles.placeholderText}>No one's around here</Text>
      <Link href={{ pathname: '/(auth)/createPages' }} asChild>
        <TouchableOpacity>
          <Text
            style={[styles.placeholderText, { color: Colors.default.primary }]}
          >
            Create A Post
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    left: 72,
    top: 390,
    flex: 1,
    zIndex: 1,
    transform: [{ rotate: '-105deg' }],
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  placeholderText: {
    fontWeight: '700',
    fontSize: 28,
    color: 'gray',
  },
});

export default NoDataPlaceholder;
