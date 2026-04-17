import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet, SafeAreaView } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import PostCard from './components/PostCard';
import { postsService } from '../src/services/posts';
import eventBus from '../src/lib/eventBus';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadPage = useCallback(async (replace = false) => {
    // Feed API is not paginated in the current backend implementation
    if (!replace) return;
    
    setLoading(true);
    try {
      const res = await postsService.getFeed();
      if (res && res.success && Array.isArray(res.posts)) {
        setPosts(res.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPage(true);

    const unsub = eventBus.on('post:update', (payload: any) => {
      setPosts(prev => prev.map(p => p.postId === payload.postId ? { ...p, likes: payload.likes, isLiked: payload.isLiked } : p));
    });

    return () => { unsub(); };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPage(true);
  };

  const onEndReached = async () => {
    // No-op for non-paginated feed
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Feed</Title>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId || item._id || String(item.date)}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={!loading && posts.length === 0 ? <View style={styles.center}><Title>No posts yet</Title></View> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { paddingHorizontal: 12, marginBottom: 6 },
});
