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
import { Link } from 'expo-router';
import { UserStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface MessageColumnProps {
  id: number;
  name: string;
  avatar: string;
  status: UserStatus;
  lastActive?: Date;
}

const MessageColumn: React.FC<MessageColumnProps> = ({
  id,
  name,
  avatar,
  status,
  lastActive,
}) => {
  const theme = useSystemTheme();

  const handleClick = () => {};

  const chatTimeAgo = formatDistanceToNow(
    new Date(lastActive?.toString() || new Date()),
    {
      addSuffix: true,
    },
  );

  return (
    <Link
      asChild
      href={{ pathname: '/(auth)/homePages/chats/[id]', params: { id } }}
      style={[styles.container, { borderTopColor: 'gray' }]}
    >
      <TouchableOpacity
        style={[{ backgroundColor: Colors[theme].textBubbleOther }]}
        onPress={handleClick}
      >
        <View style={[styles.user_container]}>
          <Image
            source={{ uri: avatar }}
            width={32}
            height={32}
            style={[styles.user_profile]}
          />

          <View style={[styles.text_container]}>
            <ThemedText
              theme={theme}
              value={name}
              style={[
                styles.text,
                {
                  color: Colors[theme].textPrimary,
                  fontWeight: 600,
                  textAlign: 'center',
                },
              ]}
            />

            <Text
              style={{
                color:
                  status === UserStatus.OFFLINE
                    ? 'gray'
                    : Colors[theme].primary,
              }}
            >
              {status === UserStatus.OFFLINE
                ? `last seen ${chatTimeAgo}`
                : status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 62,
    width: Dimensions.get('window').width,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
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
  text_container: {
    alignItems: 'flex-start',
  },
});

export default MessageColumn;
