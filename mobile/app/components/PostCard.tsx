import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUri = post.image;

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Title
        title={post.username || 'Unknown'}
        subtitle={post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Invalid Date'}
        left={(props) => <Avatar.Text {...props} label={(post.username || 'U').slice(0, 1).toUpperCase()} />}
      />
      <Card.Content>
        <Text style={styles.contentText}>{post.title}</Text>
      </Card.Content>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : null}
      <Card.Actions style={styles.actions}>
        <View style={styles.row}>
          <IconButton icon="heart-outline" size={20} />
          <Text style={styles.metaText}>{post.likes || 0}</Text>
        </View>
        <View style={styles.row}>
          <IconButton icon="comment-outline" size={20} />
          <Text style={styles.metaText}>{post.comments || 0}</Text>
        </View>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginVertical: 8, borderRadius: 12, overflow: 'hidden' },
  image: { width: '100%', height: 300, backgroundColor: '#f3f4f6' },
  contentText: { marginVertical: 8, color: '#111827' },
  actions: { justifyContent: 'space-between', paddingHorizontal: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 4, color: '#6b7280' },
});
