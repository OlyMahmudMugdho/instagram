import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../src/lib/auth-context';
import { useRouter } from 'expo-router';

export default function Index() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Hello, {user.name || user.username}</Title>
      <Paragraph style={styles.subtitle}>Welcome to the app.</Paragraph>
      <Button mode="contained" onPress={() => router.push('/profile') } style={styles.button}>
        View Profile
      </Button>
      <Button mode="outlined" onPress={async () => { await logout(); router.replace('/login'); }} style={styles.button}>
        Sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 20, color: '#6b7280' },
  button: { marginBottom: 12 },
});
