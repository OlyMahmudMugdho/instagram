import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { useAuth } from '../src/lib/auth-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { usersService } from '../src/services/users';
import { postsService } from '../src/services/posts';
import { storage } from '../src/lib/storage';
import eventBus from '../src/lib/eventBus';
import * as Network from 'expo-network';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [cachedPostsCount, setCachedPostsCount] = useState(0);
  const [showOfflinePostsCount, setShowOfflinePostsCount] = useState(false);
  const hasFetchedHeaderRef = useRef(false);

  const profileCacheKey = authUser?._id ? `profile-header-${authUser._id}` : '';
  const postsCountCacheKey = authUser?._id ? `profile-posts-count-${authUser._id}` : '';

  const loadCachedPostsCount = useCallback(async () => {
    if (!postsCountCacheKey) return;
    const cached = await storage.getItem(postsCountCacheKey);
    if (!cached) return;
    const count = Number(cached);
    if (Number.isFinite(count) && count >= 0) {
      setCachedPostsCount(count);
    }
  }, [postsCountCacheKey]);

  const loadPosts = useCallback(async () => {
    if (!authUser?._id) return;
    setPostsLoading(true);

    const networkState = await Network.getNetworkStateAsync();
    const connected = !!networkState.isConnected && !!networkState.isInternetReachable;
    setIsConnected(connected);

    if (!connected) {
      setShowOfflinePostsCount(true);
      setPosts([]);
      setPostsLoading(false);
      return;
    }

    const postsRes = await postsService.getUserPosts(authUser._id);
    if (postsRes.success) {
      const fetchedPosts = postsRes.posts || [];
      setPosts(fetchedPosts);
      const count = fetchedPosts.length;
      setCachedPostsCount(count);
      if (postsCountCacheKey) {
        await storage.setItem(postsCountCacheKey, String(count));
      }
      setShowOfflinePostsCount(false);
    } else {
      // Self posts intentionally stay network-only (no offline cache fallback).
      setShowOfflinePostsCount(true);
      setPosts([]);
    }
    setPostsLoading(false);
  }, [authUser, postsCountCacheKey]);

  const loadCachedHeader = useCallback(async () => {
    if (!profileCacheKey) return false;
    const cached = await storage.getItem(profileCacheKey);
    if (!cached) return false;
    try {
      const parsed = JSON.parse(cached);
      if (parsed) {
        setProfile(parsed);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [profileCacheKey]);

  const loadHeader = useCallback(async (force = false) => {
    if (!authUser?._id) return;
    if (!force && hasFetchedHeaderRef.current) return;

    const profileRes = await usersService.getProfile(authUser._id);
    if (profileRes.success && profileRes.message?.foundUser) {
      const fresh = profileRes.message.foundUser;
      setProfile((prev: any) => {
        const prevSnapshot = JSON.stringify({
          name: prev?.name || '',
          username: prev?.username || '',
          followers: prev?.followers || 0,
          following: prev?.following || 0,
          profilePicture: prev?.profilePicture || null,
        });
        const nextSnapshot = JSON.stringify({
          name: fresh?.name || '',
          username: fresh?.username || '',
          followers: fresh?.followers || 0,
          following: fresh?.following || 0,
          profilePicture: fresh?.profilePicture || null,
        });
        return prevSnapshot === nextSnapshot ? prev : fresh;
      });
      if (profileCacheKey) {
        await storage.setItem(profileCacheKey, JSON.stringify(fresh));
      }
    }
    hasFetchedHeaderRef.current = true;
    setHeaderLoading(false);
  }, [authUser, profileCacheKey]);

  useEffect(() => {
    if (!authUser?._id) return;
    let mounted = true;
    hasFetchedHeaderRef.current = false;
    setHeaderLoading(true);

    (async () => {
      const hasCache = await loadCachedHeader();
      if (hasCache && mounted) {
        setHeaderLoading(false);
      } else {
        await loadHeader(true);
      }
    })();

    return () => { mounted = false; };
  }, [authUser, loadCachedHeader, loadHeader]);

  useEffect(() => {
    if (!authUser?._id) return;
    loadCachedPostsCount();

    const netSub = Network.addNetworkStateListener((state) => {
      const connected = !!state.isConnected && !!state.isInternetReachable;
      setIsConnected(connected);
      if (connected) {
        setShowOfflinePostsCount(false);
        loadHeader(true);
        loadPosts();
      } else {
        setShowOfflinePostsCount(true);
      }
    });

    const unsub = eventBus.on('profile:update', () => {
      loadHeader(true);
    });
    return () => {
      netSub.remove();
      unsub();
    };
  }, [authUser, loadHeader, loadCachedPostsCount, loadPosts]);

  useFocusEffect(
    useCallback(() => {
      if (authUser?._id) {
        loadPosts();
      }
    }, [authUser, loadPosts])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/auth_group/login');
  };

  const displayedPostsCount = showOfflinePostsCount ? cachedPostsCount : posts.length;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          headerLoading && !profile ? (
            <ProfileHeaderSkeleton />
          ) : (
            <View style={styles.header}>
              <View style={styles.headerTop}>
                {profile?.profilePicture ? (
                  <Avatar.Image size={80} source={{ uri: profile.profilePicture }} />
                ) : (
                  <Avatar.Text size={80} label={(profile?.name || profile?.username || 'U').slice(0,1).toUpperCase()} />
                )}
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Title>{displayedPostsCount}</Title>
                    <Paragraph>Posts</Paragraph>
                  </View>
                  <View style={styles.stat}><Title>{profile?.followers || 0}</Title><Paragraph>Followers</Paragraph></View>
                  <View style={styles.stat}><Title>{profile?.following || 0}</Title><Paragraph>Following</Paragraph></View>
                </View>
              </View>
              {showOfflinePostsCount || isConnected === false ? (
                <Paragraph style={styles.offlineText}>Network issue. Please check your internet connection.</Paragraph>
              ) : null}
              <View style={styles.info}>
                <Title>{profile?.name || profile?.username}</Title>
                <Paragraph>@{profile?.username}</Paragraph>
              </View>
              <View style={styles.buttonContainer}>
                <Button mode="outlined" onPress={() => router.push('/edit-profile')} style={styles.actionBtn}>Edit Profile</Button>
                <Button mode="outlined" onPress={handleLogout} style={styles.actionBtn}>Sign Out</Button>
              </View>
            </View>
          )
        }
        data={postsLoading && posts.length === 0 ? SKELETON_POSTS : posts}
        numColumns={3}
        keyExtractor={(item: any) => item._id || item.id}
        renderItem={({ item }) => (
          item.__skeleton ? (
            <View style={styles.postSkeleton} />
          ) : (
            <TouchableOpacity onPress={() => router.push({ pathname: '/post-details', params: { post: JSON.stringify(item) } })}>
              <Image source={{ uri: item.image }} style={styles.postImage} />
            </TouchableOpacity>
          )
        )}
        ListEmptyComponent={!postsLoading ? (
          <View style={styles.emptyWrap}>
            <Paragraph>{showOfflinePostsCount || isConnected === false ? 'Network issue. Please check your internet connection.' : 'No posts yet'}</Paragraph>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const SKELETON_POSTS = Array.from({ length: 12 }, (_, idx) => ({ id: `post-skeleton-${idx}`, __skeleton: true }));

function ProfileHeaderSkeleton() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.avatarSkeleton} />
        <View style={styles.stats}>
          <View style={styles.stat}><View style={styles.countSkeleton} /><View style={styles.labelSkeleton} /></View>
          <View style={styles.stat}><View style={styles.countSkeleton} /><View style={styles.labelSkeleton} /></View>
          <View style={styles.stat}><View style={styles.countSkeleton} /><View style={styles.labelSkeleton} /></View>
        </View>
      </View>
      <View style={styles.titleSkeleton} />
      <View style={styles.usernameSkeleton} />
      <View style={styles.buttonsSkeletonRow}>
        <View style={styles.buttonSkeleton} />
        <View style={styles.buttonSkeleton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', gap: 20 },
  stat: { alignItems: 'center' },
  info: { marginTop: 10 },
  offlineText: { marginTop: 8, color: '#b45309' },
  buttonContainer: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1 },
  postImage: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: '#fff' },
  postSkeleton: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: '#fff', backgroundColor: '#e5e7eb' },
  avatarSkeleton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e5e7eb' },
  countSkeleton: { width: 24, height: 18, borderRadius: 4, backgroundColor: '#e5e7eb', marginBottom: 6 },
  labelSkeleton: { width: 52, height: 12, borderRadius: 4, backgroundColor: '#e5e7eb' },
  titleSkeleton: { width: 150, height: 20, borderRadius: 5, backgroundColor: '#e5e7eb', marginTop: 12 },
  usernameSkeleton: { width: 110, height: 14, borderRadius: 5, backgroundColor: '#e5e7eb', marginTop: 8 },
  buttonsSkeletonRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  buttonSkeleton: { flex: 1, height: 36, borderRadius: 8, backgroundColor: '#e5e7eb' },
  emptyWrap: { width: '100%', paddingVertical: 24, alignItems: 'center' },
});
