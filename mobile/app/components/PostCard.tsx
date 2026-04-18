import React, { useRef } from 'react';
import eventBus from '../../src/lib/eventBus';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Card, Avatar, IconButton, Text, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { interactionService } from '../../src/services/interactions';
import { postsService } from '../../src/services/posts';
import { useAuth } from '../../src/lib/auth-context';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [liked, setLiked] = React.useState(!!post.isLiked);
  const [likesCount, setLikesCount] = React.useState(Number(post.likes) || 0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const isOwner = user?._id === post.userId;
  const suppressNavRef = useRef(false);
  const postTimestamp = post?.createdAt || post?.date || post?.updatedAt;

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = Date.now();
      const diff = Math.floor((now - d.getTime()) / 1000);
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  };

  // Initialize liked status
  React.useEffect(() => {
    const checkStatus = async () => {
      const status = await interactionService.isLiked(post.userId, post.postId);
      setLiked(status);
    };
    checkStatus();
  }, [post.userId, post.postId]);

  const handleLike = async () => {
    suppressNavRef.current = true;
    const newLiked = !liked;
    // optimistic update
    setLiked(newLiked);
    const newLikes = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLikesCount(newLikes);

    let ok = false;
    try {
      if (newLiked) {
        ok = await interactionService.likePost(post.userId, post.postId);
      } else {
        ok = await interactionService.unlikePost(post.userId, post.postId);
      }
    } catch (e) {
      ok = false;
    }

    if (!ok) {
      // rollback
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1);
    } else {
      // notify other views (feed, details) to update
      eventBus.emit('post:update', { postId: post.postId, likes: newLikes, isLiked: newLiked });
    }

    // allow short window to avoid parent navigation
    setTimeout(() => { suppressNavRef.current = false; }, 350);
  };

  const handlePress = () => {
    router.push({
      pathname: '/post-details',
      params: { post: JSON.stringify({ ...post, isLiked: liked, likes: likesCount }) }
    });
  };

  const onEdit = () => {
    setMenuVisible(false);
    router.push({ pathname: '/edit-post', params: { post: JSON.stringify(post) } });
  };

  const onDelete = async () => {
    setMenuVisible(false);
    Alert.alert('Confirm', 'Delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const res = await postsService.deletePost(post.userId, post.postId);
          if (res.success) {
            Alert.alert('Deleted');
            router.replace('/(tabs)');
          } else {
            Alert.alert('Error', String(res.message || 'Delete failed'));
          }
        } catch (err) {
          Alert.alert('Error', String(err));
        }
      } }
    ]);
  };

  return (
    <Pressable
      onPress={() => { if (suppressNavRef.current) { suppressNavRef.current = false; return; } handlePress(); }}
      style={({ hovered, pressed }) => [
        styles.pressable,
        hovered && styles.pressableHover,
        pressed && styles.pressablePressed,
      ]}
    >
      <Card style={styles.card} elevation={1}>
        <Card.Title
          title={post.username || 'Unknown'}
          subtitle={formatTime(postTimestamp)}
          left={(props) => (
            post.avatar || post.profilePicture ? 
              <Avatar.Image {...props} source={{ uri: post.avatar || post.profilePicture }} /> :
              <Avatar.Text {...props} label={(post.username || 'U').slice(0, 1).toUpperCase()} />
          )}
          right={(props) => (
            isOwner ? (
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={<IconButton {...props} icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
              >
                <Menu.Item onPress={onEdit} title="Edit" />
                <Menu.Item onPress={onDelete} title="Delete" />
              </Menu>
            ) : null
          )}
        />
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium">{post.title}</Text>
        </Card.Content>
        {post.image ? <Card.Cover source={{ uri: post.image }} /> : null}
        <Card.Actions style={styles.actions}>
          <View style={styles.leftAction}>
            <IconButton icon={liked ? "heart" : "heart-outline"} iconColor={liked ? "red" : undefined} onPress={handleLike} />
            <Text variant="bodyMedium">{likesCount}</Text>
          </View>
          <View style={styles.rightAction}>
            <IconButton icon="comment-outline" onPress={handlePress} />
            <Text variant="bodyMedium">{post.comments || 0}</Text>
          </View>
        </Card.Actions>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
  },
  pressableHover: {
    opacity: 0.98,
    transform: [{ translateY: -1 }],
  },
  pressablePressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: { paddingTop: 4, paddingBottom: 14 },
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftAction: { flexDirection: 'row', alignItems: 'center' },
  rightAction: { flexDirection: 'row', alignItems: 'center' },
});
