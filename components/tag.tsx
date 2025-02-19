import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedText from './ThemedText';
import { Tags } from '@/types';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface TagProps {
  tag: Tags;
  theme: 'light' | 'dark';
  handleTagPress?: () => void;
  isSelectedOnClick?: boolean;
  DisplayRemoveBtn?: boolean;
  ActionOnRemoveBtnClick?: void;
}

const Tag: React.FC<TagProps> = ({
  handleTagPress,
  tag,
  isSelectedOnClick,
  theme,
  DisplayRemoveBtn,
  ActionOnRemoveBtnClick,
}) => {
  return (
    <TouchableOpacity
      key={tag}
      onPress={handleTagPress}
      style={[
        isSelectedOnClick && {
          backgroundColor: 'rgba(255,0,0,0.4)',
        },
        {
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        },
        styles.text,
        {
          borderColor:
            tag === "World's First"
              ? Colors[theme].textPrimary
              : Colors[theme].textPrimary,
        },
      ]}
    >
      <ThemedText
        theme={theme}
        value={tag}
        style={[
          {
            color:
              tag === "World's First"
                ? Colors[theme].textPrimary
                : Colors[theme].textPrimary,
          },
        ]}
      />

      {DisplayRemoveBtn && (
        <TouchableOpacity onPress={() => ActionOnRemoveBtnClick}>
          <Ionicons
            name="close-outline"
            size={16}
            color={Colors[theme].textPrimary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    padding: 5,
    borderWidth: 1.25,
    borderRadius: 10,
    width: 100,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tag;
