import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Avatar, Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { friendsService } from '../src/services/friends';
import { useFocusEffect } from '@react-navigation/native';

export default function FriendRequests() {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    const res = await friendsService.getRequests();
    if (res.success && res.requests) {
      setRequests(res.requests);
    } else {
      Alert.alert('Error', String(res.message || 'Failed to load requests'));
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const handleAccept = async (senderID: string) => {
    setProcessing(prev => ({ ...prev, [senderID]: true }));
    const res = await friendsService.acceptRequest(senderID);
    if (res.success) {
      Alert.alert('Success', 'Request accepted');
      setRequests(prev => prev.filter(r => r.sender.userID !== senderID));
    } else {
      Alert.alert('Error', String(res.message || 'Failed to accept'));
      setProcessing(prev => ({ ...prev, [senderID]: false }));
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No friend requests</Text>
        <Text style={{ marginTop: 8, color: '#666' }}>When people send you requests, they will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.sender.name || item.sender.username}
              subtitle={`@${item.sender.username}`}
              left={(props) => item.sender.profilePicture ? <Avatar.Image {...props} source={{ uri: item.sender.profilePicture }} /> : <Avatar.Text {...props} label={(item.sender.name || item.sender.username || 'U').slice(0,1).toUpperCase()} />}
            />
            <Card.Actions style={styles.cardActions}>
              <Button mode="contained" onPress={() => handleAccept(item.sender.userID)} loading={!!processing[item.sender.userID]} disabled={!!processing[item.sender.userID]} style={styles.acceptBtn}>
                Accept
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, paddingTop: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginVertical: 6 },
  cardActions: { justifyContent: 'flex-end' },
  acceptBtn: { borderRadius: 6 },
});
