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
  const likeProbeIdRef = useRef(0);
  const postTimestamp = post?.createdAt || post?.date || post?.updatedAt;

  const objectIdToMs = (id?: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) return null;
    const seconds = parseInt(id.slice(0, 8), 16);
    if (!Number.isFinite(seconds)) return null;
    return seconds * 1000;
  };

  const pickBestTimestamp = (iso?: string, objectId?: string) => {
    const isoMs = iso ? new Date(iso).getTime() : NaN;
    const idMs = objectIdToMs(objectId);
    const validIso = Number.isFinite(isoMs);
    if (!validIso && idMs) return idMs;
    if (!validIso) return null;
    if (!idMs) return isoMs;
    // Backend may return stale date defaults; prefer ObjectId time when they diverge.
    if (Math.abs(isoMs - idMs) > 2 * 60 * 1000) return idMs;
    return isoMs;
  };

  const formatTime = (iso?: string, objectId?: string) => {
    try {
      const ts = pickBestTimestamp(iso, objectId);
      if (!Number.isFinite(ts)) return '';
      const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
      if (diff < 5) return 'now';
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
      return new Date(ts).toLocaleDateString();
    } catch {
      return '';
    }
  };

  // Keep local state in sync when upstream post values change.
  React.useEffect(() => {
    if (typeof post.isLiked === 'boolean') {
      setLiked(post.isLiked);
    }
    setLikesCount(Number(post.likes) || 0);
  }, [post.isLiked, post.likes]);

  // Initialize liked status only when feed payload doesn't include it.
  React.useEffect(() => {
    if (typeof post.isLiked === 'boolean') return;
    likeProbeIdRef.current += 1;
    const probeId = likeProbeIdRef.current;
    const checkStatus = async () => {
      const status = await interactionService.isLiked(post.userId, post.postId);
      if (probeId !== likeProbeIdRef.current) return;
      setLiked(status);
    };
    checkStatus();
  }, [post.userId, post.postId, post.isLiked]);

  const handleLike = async () => {
    suppressNavRef.current = true;
    const newLiked = !liked;
    // optimistic update
    setLiked(newLiked);
    const newLikes = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLikesCount(newLikes);

    likeProbeIdRef.current += 1;
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

  const openAuthorProfile = () => {
    const authorId = post.userId;
    if (!authorId) return;
    if (authorId === user?._id) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/user/${authorId}`);
    }
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
          subtitle={formatTime(postTimestamp, post?._id)}
          left={(props) => (
            <Pressable onPress={(e) => { e.stopPropagation(); openAuthorProfile(); }}>
              {post.avatar || post.profilePicture ? 
                <Avatar.Image {...props} source={{ uri: post.avatar || post.profilePicture }} /> :
                <Avatar.Text {...props} label={(post.username || 'U').slice(0, 1).toUpperCase()} />
              }
            </Pressable>
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
