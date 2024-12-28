import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomAuthSheet from '@/components/BottomAuthSheet';
import Colors from '@/constants/Colors';
import WelcomeTitle from '@/components/WelcomeTitle';
import { SvgXml } from 'react-native-svg';

import TitleImage from '../assets/images/vectors/crah_transparent.svg';
import TitleImageDark from '../assets/images/vectors/crah_transparent_black.svg';
import { useSystemTheme } from '@/utils/useSystemTheme';

const Page = () => {
  const theme = useSystemTheme();
  return (
    <View style={styles.container}>
      <WelcomeTitle />
      {theme == `dark` ? (
        <SvgXml width="250" height="250" xml={TitleImageDark} />
      ) : (
        <SvgXml width="250" height="250" xml={TitleImage} />
      )}

      <BottomAuthSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.default.primary,
  },
});

export default Page;
