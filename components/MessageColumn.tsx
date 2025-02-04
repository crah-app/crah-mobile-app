import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from './ThemedText';

const MessageColumn = () => {
  const theme = useSystemTheme();

  const handleClick = () => {};

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: Colors[theme].textBubbleOther },
      ]}
      onPress={handleClick}
    >
      <View style={[styles.user_container]}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          width={32}
          height={32}
          style={[styles.user_profile]}
        />

        <View style={[styles.text_container]}>
          <ThemedText
            theme={theme}
            value={'User123'}
            style={[
              styles.text,
              {
                color: Colors[theme].textPrimary,
                fontWeight: 600,
                textAlign: 'center',
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'red',
    height: 62,
    width: Dimensions.get('window').width,
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
  user_container: {
    flexDirection: 'row',
    width: 'auto',
    gap: 8,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  user_profile: {
    borderRadius: 50,
  },
  text_container: {},
});

export default MessageColumn;
