import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Link } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import ThemedView from './ThemedView';
import Reactions from '@/constants/Reactions';
import ThemedText from './ThemedText';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from 'react-native-vector-icons';
import { ReactionType, UserPostType } from '@/types';
import { ScrollView } from 'react-native-gesture-handler';

const DUMMY_PROFILE_IMAGE = 'https://via.placeholder.com/150';
const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

interface UserPostComponentProps {
  post: UserPostType;
}

const UserPost: React.FC<UserPostComponentProps> = ({ post }) => {
  const player = useVideoPlayer(post.videoUrl || videoSource, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const theme = useSystemTheme();

  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<ReactionType[]>([]);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments.length || 0);
  const [shareCount, setshareCount] = useState(post.shares || 0);

  const handleReaction = (reaction: string) => {
    if (reaction) {
      setReactions((prev: string[]) => [...prev, reaction]);
    }
    setShowReactions(false);
  };

  const handleLike = () => {
    setLikesCount(likesCount + 1);
  };

  const handleComment = () => {
    setCommentsCount(commentsCount + 1);
  };

  const handleShare = () => {
    setshareCount(shareCount + 1);
  };

  const renderPostContent = () => {
    switch (post.type) {
      case 'videoLandscape':
        return (
          <View style={styles.contentContainer}>
            <VideoView
              style={styles.video}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        );
      case 'videoPortrait':
        return (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        );
      case 'article':
        return (
          <Link
            asChild
            href={{
              pathname: '/../modals/postView',
              params: { data: JSON.stringify(post), type: post.type },
            }}
            style={[styles.textPost]}
          >
            <TouchableOpacity>
              <ThemedText
                style={[
                  styles.articlePreview,
                  { color: Colors[theme].textPrimary },
                ]}
                theme={theme}
                value={`${post.article?.slice(0, 150)}...`}
              />
            </TouchableOpacity>
          </Link>
        );
      case 'text':
        return (
          <Text style={[styles.textPost, { color: Colors[theme].textPrimary }]}>
            {post.text}
          </Text>
        );
      default:
        return (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            height={456}
          />
        );
    }
  };

  const postTimeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
  });

  // render post
  return (
    <View
      style={[
        styles.postContainer,
        { backgroundColor: Colors[theme].background },
      ]}
    >
      {/* Header */}
      <PostHeader post={post} postTimeAgo={postTimeAgo} />

      {/* Main content */}
      {renderPostContent()}

      {/* Footer */}
      <PostFooter
        likesCount={likesCount}
        commentsCount={commentsCount}
        post={post}
        shareCount={shareCount}
        reactions={reactions}
        setShowReactions={setShowReactions}
        handleLike={handleLike}
        handleShare={handleShare}
      />

      {/* Reactions Modal */}
      <UserPostReactionsModal
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        handleReaction={handleReaction}
      />
    </View>
  );
};

const PostHeader: React.FC<{ post: UserPostType; postTimeAgo: string }> = ({
  post,
  postTimeAgo,
}) => {
  const theme = useSystemTheme();

  return (
    <View>
      <View style={styles.header}>
        <Image
          source={{ uri: post.profileImage || DUMMY_PROFILE_IMAGE }}
          style={styles.profileImage}
        />
        <Text style={[styles.username, { color: Colors[theme].textPrimary }]}>
          {post.username}
        </Text>
      </View>
      <Text style={[styles.postTime, { color: 'gray' }]}>{postTimeAgo}</Text>
    </View>
  );
};

interface PostFooterProps {
  likesCount: number;
  handleLike: () => void;
  handleShare: () => void;
  commentsCount: number;
  post: UserPostType;
  shareCount: number;
  reactions: string[];
  setShowReactions: (boolean: boolean) => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
  likesCount,
  commentsCount,
  handleLike,
  handleShare,
  post,
  shareCount,
  setShowReactions,
  reactions,
}) => {
  const theme = useSystemTheme();

  return (
    <View style={styles.footer}>
      <View style={styles.upper_footer}>
        {/* <left side of the footer> */}
        <View style={styles.footerLeft}>
          {/* like button */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
            <Ionicons
              name="heart-outline"
              size={24}
              color={Colors[theme].textPrimary}
            />
            <Text
              style={[styles.iconCount, { color: Colors[theme].textPrimary }]}
            >
              {likesCount}
            </Text>
          </TouchableOpacity>

          {/* comment button */}
          <Link
            asChild
            href={{
              pathname: '/modals/PostCommentSection',
              params: { data: JSON.stringify(post.comments) },
            }}
          >
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={Colors[theme].textPrimary}
              />
              <Text
                style={[styles.iconCount, { color: Colors[theme].textPrimary }]}
              >
                {commentsCount}
              </Text>
            </TouchableOpacity>
          </Link>

          {/* share button */}
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color={Colors[theme].textPrimary}
            />
            <Text
              style={[styles.iconCount, { color: Colors[theme].textPrimary }]}
            >
              {shareCount}
            </Text>
          </TouchableOpacity>
        </View>

        {/* reaction button <right side of the footer> */}
        <TouchableOpacity onPress={() => setShowReactions(true)}>
          <Ionicons
            name="happy-outline"
            size={24}
            color={Colors[theme].textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.lower_footer,
          {
            height:
              post.type == 'videoPortrait' ||
              post.type == 'videoLandscape' ||
              post.type == 'image'
                ? reactions.length > 0
                  ? 100
                  : 45
                : reactions.length > 0
                ? 45
                : 0,
          },
        ]}
      >
        {/* Reactions in a vertical bubble */}
        <View style={{ height: 'auto' }}>
          {/* // reaction and counter container */}
          <View
            style={[
              {
                // padding: 10,
                // borderRadius: 25,
                // backgroundColor: 'rgba(100,100,100,0.3)',
                flexDirection: 'column',
                overflow: 'hidden',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginTop: 2,
                gap: 10,
              },
            ]}
          >
            {/* write comment bar */}
            {(post.type == 'videoPortrait' ||
              post.type == 'videoLandscape' ||
              post.type == 'image') && (
              <View
                style={[
                  styles.writeCommentBar,
                  {
                    backgroundColor: Colors[theme].surface,
                    padding: 10,
                    borderRadius: 20,
                    width: Dimensions.get('window').width - 20,
                    height: 45,
                    justifyContent: 'center',
                  },
                ]}
              >
                <Text style={{ color: 'gray' }}>Write a comment...</Text>
              </View>
            )}

            {/* reaction container */}
            {reactions.length > 0 && (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                  maxWidth: '100%',
                  flexDirection: 'row', 
                  overflowX: 'hidden',
                }}
              >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {reactions.map((reaction: string, index: number) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 6,
                        backgroundColor: 'rgba(100,100,100,0.3)',
                        padding: 10,
                        borderRadius: 20,
                        height: 40,
                      }}
                      key={index + 'Container'}
                    >
                      <Text key={index} style={{}}>
                        {reaction}
                      </Text>

                      <Text
                        key={index + 'Text'}
                        style={[
                          {
                            color: Colors[theme].textPrimary,
                            fontSize: 14,
                            fontWeight: 'bold',
                          },
                        ]}
                      >
                        {2322}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

interface UserPostReactionsModalProps {
  showReactions: boolean;
  setShowReactions: (boolean: boolean) => void;
  handleReaction: (reaction: string) => void;
}

const UserPostReactionsModal: React.FC<UserPostReactionsModalProps> = ({
  showReactions,
  setShowReactions,
  handleReaction,
}) => {
  const theme = useSystemTheme();

  return (
    <Modal
      visible={showReactions}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowReactions(false)}
    >
      <ThemedView theme={theme} flex={1} style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={() => setShowReactions(false)}>
          <View
            style={[styles.modalOverlay, { backgroundColor: 'transparent' }]}
          >
            <ThemedView
              style={[
                styles.reactionsGrid,
                {
                  width: Dimensions.get('window').width / 1.25,
                },
              ]}
              theme={theme}
            >
              {Reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  onPress={() => handleReaction(reaction)}
                >
                  <Text style={{ fontSize: 24 }}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    overflow: 'hidden',
    shadowColor: '#000',
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postTime: {
    fontSize: 12,
    paddingLeft: 10,
    marginBottom: 15,
    marginTop: -1,
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  video: {
    width: 350,
    height: 275,
  },
  articlePreview: {
    fontSize: 14,
  },
  textPost: {
    padding: 10,
    fontSize: 14,
  },
  footer: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  lower_footer: {
    marginTop: 10,
    height: 45,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  writeCommentBar: {},
  upper_footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerLeft: {
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: 15,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  iconCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  reactionCountContainer: {
    fontWeight: 'bold',
    borderRadius: '100%',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reactionsGrid: {
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    zIndex: 1,
    gap: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
});

export default UserPost;
