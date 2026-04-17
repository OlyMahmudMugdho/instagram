import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Image, Dimensions } from 'react-native';
import { Title, Paragraph, Button, Avatar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../src/lib/auth-context';
import { useRouter } from 'expo-router';
import { usersService } from '../src/services/users';
import { postsService } from '../src/services/posts';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?._id) {
      loadData();
    }
  }, [authUser]);

  const loadData = async () => {
    setLoading(true);
    const [profileRes, postsRes] = await Promise.all([
      usersService.getProfile(authUser._id),
      postsService.getUserPosts(authUser._id)
    ]);
    if (profileRes.success && profileRes.message?.foundUser) setProfile(profileRes.message.foundUser);
    if (postsRes.success) setPosts(postsRes.posts || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth_group/login');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {profile?.profilePicture ? (
                <Avatar.Image size={80} source={{ uri: profile.profilePicture }} />
              ) : (
                <Avatar.Text size={80} label={(profile?.name || profile?.username || 'U').slice(0,1).toUpperCase()} />
              )}
              <View style={styles.stats}>
                <View style={styles.stat}><Title>{posts.length}</Title><Paragraph>Posts</Paragraph></View>
                <View style={styles.stat}><Title>{profile?.followers || 0}</Title><Paragraph>Followers</Paragraph></View>
                <View style={styles.stat}><Title>{profile?.following || 0}</Title><Paragraph>Following</Paragraph></View>
              </View>
            </View>
            <View style={styles.info}>
              <Title>{profile?.name || profile?.username}</Title>
              <Paragraph>@{profile?.username}</Paragraph>
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => {}} style={styles.actionBtn}>Edit Profile</Button>
              <Button mode="outlined" onPress={handleLogout} style={styles.actionBtn}>Sign Out</Button>
            </View>
          </View>
        }
        data={posts}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', gap: 20 },
  stat: { alignItems: 'center' },
  info: { marginTop: 10 },
  buttonContainer: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1 },
  postImage: { width: ITEM_SIZE, height: ITEM_SIZE, borderWidth: 1, borderColor: '#fff' },
});
