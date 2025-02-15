import React, { useState, useCallback, useEffect } from 'react';
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  SystemMessage,
} from 'react-native-gifted-chat';
import initialMessages from '@/JSON/messages.json';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ThemedView from '@/components/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useNavigation } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { QuickReplies } from 'react-native-gifted-chat/lib/QuickReplies';

const userProfile = {
  _id: 2,
  name: 'Max Mustermann',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  online: true,
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');

  const theme = useSystemTheme();
  const { bottom, top } = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    // Tab-Leiste ausblenden
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      // Tab-Leiste wieder einblenden, wenn man den Screen verlässt
      navigation.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    };
  }, [navigation]);

  useEffect(() => {
    const formattedMessages = initialMessages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    }));

    formattedMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    setMessages(formattedMessages);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

  return (
    <ThemedView theme={theme} flex={1} style={{}}>
      {/* chat header */}
      <Stack.Screen
        options={{
          headerBlurEffect: 'regular',
          headerStyle: {
            backgroundColor: Colors[theme].surface,
          },
          headerTitleStyle: {
            color: Colors[theme].textPrimary,
          },
          headerShadowVisible: false,
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerRight}>
              {/* video call btn */}
              <TouchableOpacity onPress={() => console.log('Video Call')}>
                <Ionicons
                  name="videocam-outline"
                  size={26}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>

              {/* call btn */}
              <TouchableOpacity onPress={() => console.log('Call')} style={{}}>
                <Ionicons
                  name="call-outline"
                  size={24}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>
              {/*  */}
            </View>
          ),

          headerLeft: () => (
            <View style={{}}>
              {/* navigate back btn */}
              <TouchableOpacity onPress={router.back} style={styles.headerLeft}>
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={Colors[theme].textPrimary}
                />
              </TouchableOpacity>
            </View>
          ),

          headerTitle: () => (
            <View style={[styles.headerCenter, {}]}>
              {/* user info */}
              <Image
                source={{ uri: userProfile.avatar }}
                style={styles.profilePic}
              />
              <View style={styles.headerText}>
                <Text
                  style={[
                    styles.userName,
                    { color: Colors[theme].textPrimary },
                  ]}
                >
                  {userProfile.name}
                </Text>
                <Text
                  style={[
                    styles.userStatus,
                    {
                      color: userProfile.online
                        ? Colors[theme].primary
                        : 'gray',
                    },
                  ]}
                >
                  {userProfile.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          ),
        }}
      />

      {/* GiftedChat */}
      <ImageBackground style={{ flex: 1, paddingBottom: bottom }}>
        <GiftedChat
          keyboardShouldPersistTaps="never"
          renderAvatar={null}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1, // chat id
          }}
          onInputTextChanged={setText}
          // centered system messages
          renderSystemMessage={(props) => (
            <SystemMessage
              {...props}
              textStyle={{ color: Colors[theme].textSecondary }}
            />
          )}
          // left action: add btn
          renderActions={(props) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
              }}
            >
              <RenderRightInputButton props={props} />
            </View>
          )}
          // right btn: send
          renderSend={(props) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
              }}
            >
              {text.length > 0 ? (
                <RenderSendText props={props} />
              ) : (
                <RenderSendEmptyText props={props} />
              )}
            </View>
          )}
          // centered text input
          textInputProps={[styles.composer]}
          renderBubble={(props) => <RenderBubble props={props} />}
          listViewProps={{
            keyboardShouldPersistTaps: 'handled',
            keyboardDismissMode:
              Platform.OS === 'ios' ? 'interactive' : 'on-drag',
          }}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: Colors[theme].surface,
              }}
            />
          )}
          renderQuickReplies={(props) => (
            <QuickReplies color={Colors[theme].primary} {...props} />
          )}
          renderComposer={(props) => (
            <Composer
              {...props}
              textInputStyle={{ color: Colors[theme].textPrimary }}
            />
          )}
        />
      </ImageBackground>
    </ThemedView>
  );
};

const RenderSendEmptyText: React.FC<{ props: any }> = ({ props }) => {
  const theme = useSystemTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 14 }}>
      <TouchableOpacity
        onPress={() => {
          console.log('camera pressed');
        }}
      >
        <View>
          <Ionicons
            name="camera-outline"
            size={24}
            color={Colors[theme].textPrimary}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log('mic pressed');
        }}
      >
        <View>
          <Ionicons
            name="mic-outline"
            size={24}
            color={Colors[theme].textPrimary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const RenderSendText: React.FC<{ props: any }> = ({ props }) => {
  const theme = useSystemTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.text && props.text.trim()) {
          props.onSend({ text: props.text.trim() }, true);
          console.log('send pressed');
        }
      }}
      style={{ paddingHorizontal: 14 }}
    >
      <Ionicons
        name="send-outline"
        size={24}
        color={Colors[theme].textPrimary}
      />
    </TouchableOpacity>
  );
};

const RenderRightInputButton: React.FC<{ props: any }> = ({ props }) => {
  const theme = useSystemTheme();

  return (
    <TouchableOpacity
      onPress={() => console.log('Plus pressed')}
      style={{ paddingHorizontal: 10 }}
    >
      <Ionicons
        name="add-outline"
        size={24}
        color={Colors[theme].textPrimary}
      />
    </TouchableOpacity>
  );
};

const RenderBubble: React.FC<{ props: any }> = ({ props }) => {
  const theme = useSystemTheme();

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: Colors[theme].textBubbleOwn },
        left: { backgroundColor: Colors[theme].textBubbleOther },
      }}
      textStyle={{
        right: { color: 'white' },
        left: { color: 'white' },
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerLeft: { marginRight: 20 },
  headerCenter: {
    width: 250,
    flexDirection: 'row',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 0,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
  },
  composer: {
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
});

export default ChatScreen;
