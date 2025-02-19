import Tag from '@/components/tag';
import ThemedText from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import ThemedView from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Tags, TextInputMaxCharacters } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreateVideo = () => {
  const theme = useSystemTheme();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [tags, setTags] = useState<{}>();

  const [video, setVideo] = useState();
  const [cover, setCover] = useState();

  const AddTag = () => {};

  const RemoveTag = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : undefined}
    >
      <ThemedView theme={theme} flex={1} style={[styles.container]}>
        <View style={[styles.headerContainer]}>
          <ThemedText
            theme={theme}
            value={'Create Video'}
            style={defaultStyles.biggerText}
          />
          <Ionicons
            size={24}
            color={Colors[theme].textPrimary}
            name="send-outline"
          />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="on-drag"
            style={{}}
          >
            <View style={{ paddingBottom: 200 }}>
              <View
                style={[
                  styles.Container1,
                  styles.InputContainer,
                  { paddingTop: 22 - 12 },
                ]}
              >
                <ThemedTextInput
                  placeholder={'Enter the video title here'}
                  theme={theme}
                />
              </View>
              <View
                style={[styles.Container2, styles.InputContainer, { gap: 12 }]}
              >
                <TouchableOpacity>
                  <ThemedText
                    value={'Upload video'}
                    theme={theme}
                    style={[
                      defaultStyles.primaryBtn,
                      { padding: 14, color: Colors[theme].textPrimaryReverse },
                    ]}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <ThemedText
                    value={'Upload cover'}
                    theme={theme}
                    style={[defaultStyles.outlinedBtn, { padding: 8 }]}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.Container3, styles.InputContainer]}>
                <ThemedTextInput
                  placeholder={
                    'Enter description, insights, hashtags, your thoughts...'
                  }
                  theme={theme}
                  lines={4}
                  multiline={true}
                  maxLength={TextInputMaxCharacters.BigDescription}
                  showLength={true}
                  children={null}
                />
              </View>
              <View style={[styles.Container4, styles.InputContainer]}>
                <ThemedTextInput
                  placeholder={'Add tag'}
                  theme={theme}
                  lines={99}
                  multiline={false}
                  childrenContainerStyle={{
                    flexDirection: 'row',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.Banger}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />

                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.News}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />
                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.Banger}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />

                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.News}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />
                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.Banger}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />

                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.News}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />
                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.Banger}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />
                  <Tag
                    DisplayRemoveBtn={true}
                    theme={theme}
                    tag={Tags.News}
                    ActionOnRemoveBtnClick={RemoveTag()}
                  />
                </ThemedTextInput>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    // width: Dimensions.get('window').width,
  },
  Container1: {},
  Container2: {},
  Container3: {},
  Container4: {},
  InputContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});

export default CreateVideo;
