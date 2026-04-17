import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Avatar, Button, Card, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { friendsService } from '../src/services/friends';
import { useFocusEffect } from '@react-navigation/native';

export default function Explore() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [requesting, setRequesting] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await friendsService.getSuggestions();
    if (res.success && res.data) {
      const ids: string[] = res.data.userIDs || [];
      const usernames: string[] = res.data.usernames || [];
      const names: string[] = res.data.names || [];
      const items = ids.map((id, i) => ({ userID: id, username: usernames[i], name: names[i] }));
      setSuggestions(items);
    } else {
      Alert.alert('Error', String(res.message || 'Failed to load suggestions'));
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const handleSend = async (userID: string) => {
    setRequesting(prev => ({ ...prev, [userID]: true }));
    const res = await friendsService.sendRequest(userID);
    if (res.success) {
      Alert.alert('Success', 'Friend request sent');
      setSuggestions(prev => prev.filter(user => user.userID !== userID));
    } else {
      Alert.alert('Error', String(res.message || 'Failed to send request'));
    }
    setRequesting(prev => ({ ...prev, [userID]: false }));
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    const q = text.trim();
    if (!q) {
      // reload suggestions
      load();
      return;
    }

    // don't hide existing list while searching; show inline spinner
    setSearching(true);
    const res = await friendsService.searchProfiles(q);
    if (res.success) {
      setSuggestions(res.data || []);
    } else {
      Alert.alert('Error', String(res.message || 'Search failed'));
    }
    setSearching(false);
  };

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
          <Card style={styles.card}>
            <Card.Title
              title={item.name || item.username}
              subtitle={`@${item.username}`}
              left={(props) => <Avatar.Text {...props} label={(item.name || item.username || 'U').slice(0,1).toUpperCase()} />}
              right={() => (
                <Button mode="contained" onPress={() => handleSend(item.userID)} loading={!!requesting[item.userID]} disabled={!!requesting[item.userID]} style={styles.followBtn}>
                  Follow
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
