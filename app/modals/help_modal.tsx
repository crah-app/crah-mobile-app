import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

interface HelpObjectStructure {
  type: string;
  header: string;
  showContent: boolean;
  content: string;
  stack_title?: string;
}

const HelpModal = () => {
  const { contents } = useLocalSearchParams();
  const theme = useSystemTheme();

  const content: HelpObjectStructure[] = JSON.parse(contents as string);

  // return back if no content is provided to display
  if ((content || [])?.length <= 0) {
    router.back();
    return <ThemedView flex={1} theme={theme}></ThemedView>;
  }

  return (
    <ThemedView flex={1} theme={theme} style={{ padding: 12 }}>
      <Stack.Screen options={{ headerTitle: content[0].stack_title }} />

      {content.map((val: HelpObjectStructure, key: number) => (
        <View key={`0${key + 3}`}>
          <ThemedText
            key={`0${key + 1}`}
            theme={theme}
            value={val.header}
            style={[
              defaultStyles.biggerText,
              { fontSize: val.type == 'title' ? 22 : 18 },
              { paddingTop: val.type == 'title' ? 0 : 12 },
              { paddingBottom: val.type == 'title' ? 0 : 4 },
              {
                color:
                  val.type == 'title'
                    ? Colors[theme].primary
                    : Colors[theme].textPrimary,
              },
            ]}
          />
          {val.showContent && (
            <ThemedText
              key={`1${key + 2}`}
              theme={theme}
              value={val.content}
              style={[
                {
                  color:
                    val.type == 'title' ? 'gray' : Colors[theme].textPrimary,
                },
              ]}
            />
          )}
        </View>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default HelpModal;
