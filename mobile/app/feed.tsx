import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Title } from 'react-native-paper';
import PostCard from './components/PostCard';
import { postsService } from '../src/services/posts';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const loadPage = useCallback(async (p = 1, replace = false) => {
    if (loading || endReached) return;
    setLoading(true);
    try {
      const res = await postsService.getPosts(p);
      if (res && res.success && Array.isArray(res.data)) {
        if (replace) setPosts(res.data);
        else setPosts((prev) => (p === 1 ? res.data : [...prev, ...res.data]));
        setPage(p);
        if (res.requested_page >= res.pages) setEndReached(true);
      } else {
        // treat as end
        setEndReached(true);
      }
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, endReached]);

  useEffect(() => {
    loadPage(1, true);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setEndReached(false);
    await loadPage(1, true);
  };

  const onEndReached = async () => {
    if (loading || endReached) return;
    await loadPage(page + 1, false);
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Feed</Title>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId || item._id || String(item.date)}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={!loading ? <View style={styles.center}><Title>No posts yet</Title></View> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { paddingHorizontal: 12, marginBottom: 6 },
});
