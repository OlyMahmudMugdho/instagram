import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { useAuth } from '../src/lib/auth-context';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={72} label={(user?.name || user?.username || 'U').slice(0,1).toUpperCase()} />
        <Title style={styles.title}>{user?.name || user?.username}</Title>
        <Paragraph style={styles.subtitle}>{user?.email}</Paragraph>
      </View>

      <View style={styles.actions}>
        <Button mode="contained" onPress={() => router.push('/edit-profile')} style={{ marginBottom: 12 }}>
          Edit Profile
        </Button>
        <Button mode="outlined" onPress={handleLogout}>
          Sign Out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { alignItems: 'center', marginTop: 20 },
  title: { marginTop: 8 },
  subtitle: { color: '#6b7280' },
  actions: { marginTop: 32 },
});
