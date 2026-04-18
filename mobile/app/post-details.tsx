import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Keyboard, Pressable, Modal, Image } from 'react-native';
import { Card, Text, IconButton, Avatar, Button, List, Menu } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { interactionService } from '../src/services/interactions';
import { postsService } from '../src/services/posts';
import { useAuth } from '../src/lib/auth-context';

interface PostComment {
  _id: string;
  commentID: string;
  username: string;
  text: string;
  createdAt?: string;
}

export default function PostDetails() {
  const { post: postParam } = useLocalSearchParams();
  const post = JSON.parse(postParam as string);
  const router = useRouter();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(Number(post.likes) || 0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const isOwner = user?._id === post.userId;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadStatus();

    const unsub = require('../src/lib/eventBus').default.on('post:update', (payload: any) => {
      if (payload.postId === post.postId) {
        setLikesCount(payload.likes);
        setLiked(payload.isLiked);
      }
    });

    return () => { unsub(); };
  }, []);

  const loadStatus = async () => {
    const [isLiked, fetchedComments] = await Promise.all([
      interactionService.isLiked(post.userId, post.postId),
      interactionService.getComments(post.userId, post.postId)
    ]);
    setLiked(isLiked);
    setComments(fetchedComments);
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));

    const ok = newLiked ? await interactionService.likePost(post.userId, post.postId) : await interactionService.unlikePost(post.userId, post.postId);
    if (!ok) {
      // rollback
      setLiked(!newLiked);
      setLikesCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1);
    } else {
      // notify feed
      const eventBus = require('../src/lib/eventBus').default;
      eventBus.emit('post:update', { postId: post.postId, likes: newLiked ? likesCount + 1 : Math.max(0, likesCount - 1), isLiked: newLiked });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const success = await interactionService.addComment(post.userId, post.postId, comment);
    if (success) {
      setComment('');
      Keyboard.dismiss();
      loadStatus();
    } else {
      Alert.alert('Error', 'Unable to post comment');
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = Date.now();
      const diff = Math.floor((now - d.getTime()) / 1000);
      if (diff < 60) return `${diff}s`;
      if (diff < 3600) return `${Math.floor(diff/60)}m`;
      if (diff < 86400) return `${Math.floor(diff/3600)}h`;
      return d.toLocaleDateString();
    } catch {
      return '';
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
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
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
        }
      }
    ]);
  };

  const onDownloadImage = async () => {
    if (!post.image || downloadingImage) return;

    setDownloadingImage(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow photo library access to download images.');
        return;
      }

      const cleanUrl = String(post.image).split('?')[0];
      const extMatch = cleanUrl.match(/\.(jpg|jpeg|png|webp)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
      const targetPath = `${FileSystem.cacheDirectory}post-${post.postId || Date.now()}.${ext}`;
      const downloaded = await FileSystem.downloadAsync(String(post.image), targetPath);

      if (downloaded.status >= 200 && downloaded.status < 300) {
        const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
        const albumName = 'pixl';
        const existingAlbum = await MediaLibrary.getAlbumAsync(albumName);

        if (existingAlbum) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], existingAlbum, false);
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
        }

        Alert.alert('Saved', 'Image downloaded to the pixl folder.');
      } else {
        Alert.alert('Error', 'Failed to download image');
      }
    } catch {
      Alert.alert('Error', 'Failed to download image');
    } finally {
      setDownloadingImage(false);
    }
  };

  const onOpenImageActions = () => {
    if (downloadingImage) return;
    Alert.alert('Image options', 'Choose what you want to do with this image.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download to phone', onPress: onDownloadImage },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0} style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Card>
          <Card.Title 
            title={post.username || 'Unknown'}
            subtitle={formatTime(post?.createdAt || post?.date || post?.updatedAt)}
            left={(props) => (
              post.avatar || post.profilePicture ? 
                <Avatar.Image {...props} source={{ uri: post.avatar || post.profilePicture }} /> :
                <Avatar.Text {...props} label={(post.username || 'U')[0]} />
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
            <Text variant="titleMedium">{post.title}</Text>
          </Card.Content>
          {post.image ? (
            <Pressable onPress={() => setImageViewerVisible(true)}>
              <Card.Cover source={{ uri: post.image }} />
            </Pressable>
          ) : null}
          <Card.Actions style={styles.actions}>
            <View style={styles.leftAction}>
              <IconButton icon={liked ? "heart" : "heart-outline"} iconColor={liked ? "red" : undefined} onPress={handleLike} />
              <Text>{likesCount}</Text>
            </View>
            <View style={styles.rightAction}>
              <IconButton icon="comment-outline" onPress={() => {}} />
              <Text>{comments.length}</Text>
            </View>
          </Card.Actions>
        </Card>
        
        <List.Section title="Comments">
          {comments.map((c, index: number) => (
            <Card key={index} style={styles.commentCard}>
              <Card.Title 
                title={c.username || 'Unknown'} 
                subtitle={c.text}
                left={(props) => (
                  c.profilePicture ? <Avatar.Image {...props} source={{ uri: c.profilePicture }} /> : <Avatar.Text {...props} label={(c.username || 'U').slice(0,1).toUpperCase()} />
                )}
                right={(props) => (
                  <Text {...props} variant="bodySmall">{formatTime(c.createdAt)}</Text>
                )}
              />
            </Card>
          ))}
        </List.Section>
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <View style={[styles.commentInputContainer, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        <TextInput 
          placeholder="Write a comment..."
          placeholderTextColor="#7a7a7a"
          style={styles.input} 
          value={comment} 
          onChangeText={setComment}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
        <Button mode="outlined" onPress={handleComment}>Post</Button>
      </View>

      <Modal
        visible={imageViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageViewerBackdrop}>
          <View style={[styles.imageViewerHeader, { paddingTop: Math.max(insets.top, 10) }]}>
            <IconButton icon="close" iconColor="#fff" size={28} onPress={() => setImageViewerVisible(false)} />
            <IconButton
              icon="dots-vertical"
              iconColor="#fff"
              size={28}
              onPress={onOpenImageActions}
              disabled={downloadingImage}
            />
          </View>
          {post.image ? <Image source={{ uri: post.image }} style={styles.fullImage} resizeMode="contain" /> : null}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 10, paddingTop: 40 },
  content: { paddingTop: 8, paddingBottom: 16 },
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftAction: { flexDirection: 'row', alignItems: 'center' },
  rightAction: { flexDirection: 'row', alignItems: 'center' },
  commentInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingTop: 6, paddingBottom: 6, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  input: { flex: 1, minHeight: 42, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  commentCard: { marginVertical: 5 },
  imageViewerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' },
  imageViewerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 6 },
  fullImage: { flex: 1, width: '100%' },
});
