import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, Title, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { postsService } from '../src/services/posts';

export default function EditPost() {
  const { post: postParam } = useLocalSearchParams();
  const post = useMemo(() => {
    if (!postParam || Array.isArray(postParam)) return null;
    return JSON.parse(postParam);
  }, [postParam]);
  const router = useRouter();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post) {
      setContent(post.title || post.content || '');
      setLoading(false);
    }
  }, [post]);

  const handleSave = async () => {
    if (!post) return;
    if (!content.trim()) {
      Alert.alert('Validation', 'Content cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const res = await postsService.editPost(post.userId, post.postId, { content });
      if (res.success) {
        Alert.alert('Success', 'Post updated');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', String(res.message || 'Failed to update'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title}>Edit Post</Title>

        {post?.image ? (
          Array.isArray(post.image) ? (
            <View style={styles.imageContainer}>
              {post.image.map((uri: string, i: number) => (
                <Image key={i} source={{ uri }} style={styles.thumb} />
              ))}
            </View>
          ) : (
            <Image source={{ uri: post.image }} style={{ width: '100%', height: 200, marginBottom: 12 }} />
          )
        ) : null}

        <TextInput
          label="Content"
          mode="outlined"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.postBtn}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 640 },
  title: { marginBottom: 12 },
  imageContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  thumb: { width: 100, height: 100, borderRadius: 6, marginRight: 8, marginBottom: 8 },
  input: { minHeight: 100, marginBottom: 12 },
  postBtn: { marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
