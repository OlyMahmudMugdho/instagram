import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Button, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Create() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create</Title>
      <Paragraph style={{ marginBottom: 12 }}>Create a new post (image, caption).</Paragraph>
      <Button mode="contained" onPress={() => router.push('/create-post')}>Start</Button>
      {/* If `/create-post` doesn't exist yet, this is a placeholder action. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  title: { marginBottom: 8 },
});
