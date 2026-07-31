import React, { useCallback, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title, Paragraph, Button, Avatar, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../src/lib/auth-context';
import { usersService } from '../../src/services/users';
import { postsService } from '../../src/services/posts';
import { friendsService } from '../../src/services/friends';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

export default function UserProfile() {
  const { userID } = useLocalSearchParams<{ userID: string }>();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingFollow, setUpdatingFollow] = useState(false);

  const isSelf = authUser?._id === userID;
  const canViewPosts = isSelf || !!profile?.isFriend;

  const loadData = useCallback(async () => {
    if (!userID) return;
    setLoading(true);
    const profileRes = await usersService.getProfile(userID);
    if (profileRes.success && profileRes.message?.foundUser) {
      const found = profileRes.message.foundUser;
      setProfile(found);

      if (authUser?._id === userID || found.isFriend) {
        const postsRes = await postsService.getUserPosts(userID);
        if (postsRes.success) {
          const userPosts = postsRes.posts || [];
          setPosts(userPosts);
          setPostsCount(userPosts.length);
        } else {
          setPosts([]);
          setPostsCount(0);
        }
      } else {
        const publicCountRes = await postsService.getPublicPostCount(userID);
        setPostsCount(publicCountRes.count || 0);
        setPosts([]);
      }
    }
    setLoading(false);
  }, [authUser?._id, userID]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleFollowToggle = async () => {
    if (!userID || isSelf) return;
    setUpdatingFollow(true);
    const res = profile?.isFollowing
      ? await friendsService.unfollow(userID)
      : await friendsService.follow(userID);
    if (res.success) {
      await loadData();
    }
    setUpdatingFollow(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={(
          loading ? (
            <UserProfileHeaderSkeleton />
          ) : (
            <View style={styles.header}>
              <View style={styles.headerTop}>
                {profile?.profilePicture ? (
                  <Avatar.Image size={80} source={{ uri: profile.profilePicture }} />
                ) : (
                  <Avatar.Text size={80} label={(profile?.name || profile?.username || 'U').slice(0, 1).toUpperCase()} />
                )}
                <View style={styles.stats}>
                  <View style={styles.stat}><Title>{postsCount}</Title><Paragraph>Posts</Paragraph></View>
                  <View style={styles.stat}><Title>{profile?.followers || 0}</Title><Paragraph>Followers</Paragraph></View>
                  <View style={styles.stat}><Title>{profile?.following || 0}</Title><Paragraph>Following</Paragraph></View>
                </View>
              </View>
              <View style={styles.info}>
                <Title>{profile?.name || profile?.username}</Title>
                <Paragraph>@{profile?.username}</Paragraph>
              </View>
              {!isSelf ? (
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    buttonColor={profile?.isFollowing ? '#ef4444' : undefined}
                    textColor={profile?.isFollowing ? '#ffffff' : undefined}
                    onPress={handleFollowToggle}
                    loading={updatingFollow}
                    disabled={updatingFollow}
                    style={styles.actionBtn}
                  >
                    {profile?.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </View>
              ) : null}
              {!canViewPosts ? (
                <Text style={styles.privateNotice}>You must be friends with this user to view posts.</Text>
              ) : null}
            </View>
          )
        )}
        data={loading ? SKELETON_POSTS : (canViewPosts ? posts : [])}
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
      />
    </SafeAreaView>
  );
}

const SKELETON_POSTS = Array.from({ length: 12 }, (_, idx) => ({ id: `user-post-skeleton-${idx}`, __skeleton: true }));

function UserProfileHeaderSkeleton() {
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
      <View style={styles.buttonSkeleton} />
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
  buttonContainer: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1 },
  postImage: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: '#fff' },
  postSkeleton: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: '#fff', backgroundColor: '#e5e7eb' },
  avatarSkeleton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e5e7eb' },
  countSkeleton: { width: 24, height: 18, borderRadius: 4, backgroundColor: '#e5e7eb', marginBottom: 6 },
  labelSkeleton: { width: 52, height: 12, borderRadius: 4, backgroundColor: '#e5e7eb' },
  titleSkeleton: { width: 140, height: 20, borderRadius: 5, backgroundColor: '#e5e7eb', marginTop: 12 },
  usernameSkeleton: { width: 110, height: 14, borderRadius: 5, backgroundColor: '#e5e7eb', marginTop: 8 },
  buttonSkeleton: { marginTop: 15, height: 36, borderRadius: 8, backgroundColor: '#e5e7eb' },
  privateNotice: { marginTop: 12, color: '#6b7280' },
});
