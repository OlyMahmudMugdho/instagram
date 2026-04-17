import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button, Title, ActivityIndicator } from 'react-native-paper';
import { postsService } from '../src/services/posts';
import { useRouter } from 'expo-router';

export default function Create() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const pickImage = async () => {
    try {
      // dynamic import to avoid bundling issues
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Permission to access photos is required to add images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (!result.canceled) {
        // @ts-ignore
        const uri = result.assets?.[0]?.uri || (result as any).uri;
        if (uri) setImages(prev => [...prev, uri]);
      }
    } catch (err) {
      console.error('Image pick error', err);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handlePost = async () => {
    if (images.length === 0) {
      Alert.alert('Validation', 'Please select at least one image');
      return;
    }
    setSaving(true);
    try {
      const res = await postsService.createPost(images, content);
      if (res.success) {
        Alert.alert('Success', 'Post created');
        // reset form so user can create another post
        setContent('');
        setImages([]);
      } else {
        Alert.alert('Error', String(res.message || 'Failed to create post'));
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Title style={styles.title}>Create Post</Title>

        <View style={styles.imageContainer}>
          {images.map((uri, i) => (
            <View key={i} style={styles.thumbContainer}>
              <Image source={{ uri }} style={styles.thumb} />
              <Button mode="outlined" onPress={() => removeImage(i)} compact style={styles.removeBtn}>Remove</Button>
            </View>
          ))}
        </View>

        <Button mode="outlined" onPress={pickImage} style={styles.addBtn}>Add Photo</Button>

        <TextInput
          label="What's on your mind?"
          mode="outlined"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
        />

        <Button mode="contained" onPress={handlePost} loading={saving} disabled={saving} style={styles.postBtn}>
          Post
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
  thumbContainer: { marginRight: 8, marginBottom: 8 },
  thumb: { width: 100, height: 100, borderRadius: 6 },
  removeBtn: { marginTop: 4 },
  addBtn: { marginBottom: 12 },
  input: { minHeight: 100, marginBottom: 12 },
  postBtn: { marginTop: 8 },
});
