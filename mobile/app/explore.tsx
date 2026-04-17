import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Avatar, Button, Card, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { friendsService } from '../src/services/friends';
import { usersService } from '../src/services/users';
import { useFocusEffect } from '@react-navigation/native';

export default function Explore() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [requesting, setRequesting] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const profileCacheRef = React.useRef<Record<string, any>>({});
  const searchSeqRef = React.useRef(0);
  const prevQueryRef = React.useRef('');

  const enrichUsers = React.useCallback(async (items: any[]) => {
    const detailed = await Promise.all(items.map(async (item) => {
      const cached = profileCacheRef.current[item.userID];
      if (cached) {
        return {
          ...item,
          name: cached.name || item.name,
          username: cached.username || item.username,
          profilePicture: cached.profilePicture || null,
          isFollowing: !!cached.isFollowing,
        };
      }

      const profileRes = await usersService.getProfile(item.userID);
      const foundUser = profileRes.message?.foundUser || null;
      if (foundUser) {
        profileCacheRef.current[item.userID] = foundUser;
      }
      return {
        ...item,
        name: foundUser?.name || item.name,
        username: foundUser?.username || item.username,
        profilePicture: foundUser?.profilePicture || null,
        isFollowing: !!foundUser?.isFollowing,
      };
    }));
    setSuggestions(detailed);
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await friendsService.getSuggestions();
    if (res.success && res.data) {
      const ids: string[] = res.data.userIDs || [];
      const usernames: string[] = res.data.usernames || [];
      const names: string[] = res.data.names || [];
      const items = ids.map((id, i) => ({ userID: id, username: usernames[i], name: names[i] }));
      await enrichUsers(items);
    } else {
      Alert.alert('Error', String(res.message || 'Failed to load suggestions'));
    }
    setLoading(false);
  }, [enrichUsers]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [load])
  );

  const handleFollowToggle = async (item: any) => {
    const userID = item.userID;
    setRequesting(prev => ({ ...prev, [userID]: true }));
    const res = item.isFollowing ? await friendsService.unfollow(userID) : await friendsService.follow(userID);
    if (res.success) {
      profileCacheRef.current[userID] = {
        ...(profileCacheRef.current[userID] || {}),
        isFollowing: !item.isFollowing,
      };
      setSuggestions(prev => prev.map(user => (
        user.userID === userID ? { ...user, isFollowing: !item.isFollowing } : user
      )));
    } else {
      Alert.alert('Error', String(res.message || 'Failed to update follow status'));
    }
    setRequesting(prev => ({ ...prev, [userID]: false }));
  };

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  React.useEffect(() => {
    const q = query.trim();
    const prev = prevQueryRef.current.trim();
    prevQueryRef.current = query;

    if (!q) {
      setSearching(false);
      if (!prev) return;
      const seq = ++searchSeqRef.current;
      (async () => {
        await load();
        if (seq !== searchSeqRef.current) return;
      })();
      return;
    }

    setSearching(true);
    const seq = ++searchSeqRef.current;
    const timer = setTimeout(async () => {
      const res = await friendsService.searchProfiles(q);
      if (seq !== searchSeqRef.current) return;
      if (res.success) {
        await enrichUsers(res.data || []);
      } else {
        Alert.alert('Error', String(res.message || 'Search failed'));
      }
      setSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query, load, enrichUsers]);

  // only show full-screen loader when initial load and no data
  if (loading && suggestions.length === 0) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Searchbar placeholder="Search users" value={query} onChangeText={handleSearch} style={styles.search} />
        {searching ? <ActivityIndicator size="small" style={{ marginLeft: 8 }} /> : (
          <Button mode="outlined" onPress={() => router.push('/friend-requests')} style={styles.requestsBtn}>Requests</Button>
        )}
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/user/${item.userID}`)}>
            <Card.Title
              title={item.name || item.username}
              subtitle={`@${item.username}`}
              left={(props) => (
                item.profilePicture
                  ? <Avatar.Image {...props} source={{ uri: item.profilePicture }} />
                  : <Avatar.Text {...props} label={(item.name || item.username || 'U').slice(0,1).toUpperCase()} />
              )}
              right={() => (
                <Button
                  mode="contained"
                  buttonColor={item.isFollowing ? '#ef4444' : undefined}
                  textColor={item.isFollowing ? '#ffffff' : undefined}
                  onPress={() => handleFollowToggle(item)}
                  loading={!!requesting[item.userID]}
                  disabled={!!requesting[item.userID]}
                  style={styles.followBtn}
                >
                  {item.isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, paddingTop: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginVertical: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  search: { flex: 1 },
  requestsBtn: { marginLeft: 8 },
  followBtn: { borderRadius: 6 },
});
