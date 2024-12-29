import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
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

const DUMMY_PROFILE_IMAGE = 'https://via.placeholder.com/150';
const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const UserPost = ({ post }) => {
  const player = useVideoPlayer(post.videoUrl || videoSource, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  const theme = useSystemTheme();
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
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
                value={`${post.article.slice(0, 150)}...`}
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
        return <Image source={{ uri: post.imageUrl }} style={styles.image} />;
    }
  };

  const postTimeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
  });

  return (
    <View
      style={[
        styles.postContainer,
        { backgroundColor: Colors[theme].textPrimaryReverse },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.profileImage || DUMMY_PROFILE_IMAGE }}
          style={styles.profileImage}
        />
        <Text style={[styles.username, { color: Colors[theme].textPrimary }]}>
          {post.username}
        </Text>
      </View>
      <Text style={[styles.postTime, { color: Colors[theme].textSecondary }]}>
        {postTimeAgo}
      </Text>

      {/* Main content */}
      {renderPostContent()}

      {/* Footer */}
      <View style={styles.footer}>
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

        {/* reaction button */}
        <TouchableOpacity onPress={() => setShowReactions(true)}>
          <Ionicons
            name="happy-outline"
            size={24}
            color={Colors[theme].textPrimary}
          />
        </TouchableOpacity>

        {/* Reactions in a vertical bubble */}
        <View style={styles.reactionsBubbleContainer}>
          {reactions.length > 0 && (
            <View style={styles.reactionsBubble}>
              {reactions.map((reaction, index) => (
                <Text key={index} style={styles.reactionText}>
                  {reaction}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Reactions Modal */}
      <Modal
        visible={showReactions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReactions(false)}
      >
        <ThemedView theme={theme} flex={1} style={styles.modalOverlay}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReactions(false)}
            >
              <Text style={[styles.closeText, { color: 'white' }]}>X</Text>
            </TouchableOpacity>
            <ThemedView style={styles.reactionsGrid} theme={theme}>
              {Reactions.map((reaction) => (
                <TouchableOpacity
                  key={reaction}
                  style={styles.reactionItem}
                  onPress={() => handleReaction(reaction)}
                >
                  <Text style={styles.reactionText}>{reaction}</Text>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </View>
        </ThemedView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
    height: 200,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  reactionsBubbleContainer: {
    position: 'absolute',
    bottom: -10,
    left: 200,
    alignItems: 'center',
    zIndex: 1,
  },
  reactionsBubble: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    marginTop: 5,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    maxWidth: 100,
    overflow: 'hidden',
    gap: 10,
  },
  reactionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    left: 0,
    zIndex: 1,
    padding: 10,
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reactionsGrid: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  reactionItem: {
    // margin: 10,
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#eee',
    zIndex: 2,
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
