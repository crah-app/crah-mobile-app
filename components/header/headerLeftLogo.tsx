import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import TextLogo from '../../assets/images/vectors/TextLogo.svg';

const HeaderLeftLogo = () => {
  return (
    <SvgXml
      width={130}
      height={40}
      xml={TextLogo}
      style={{
        position: 'absolute',
        left: 0,
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default HeaderLeftLogo;
