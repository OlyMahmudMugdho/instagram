import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUri = Array.isArray(post.imageUrl) && post.imageUrl.length > 0 ? post.imageUrl[0] : null;

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Title
        title={post.author || 'Unknown'}
        subtitle={new Date(post.date).toLocaleString()}
        left={(props) => <Avatar.Text {...props} label={(post.author || 'U').slice(0, 1).toUpperCase()} />}
      />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : null}
      <Card.Content>
        <Text style={styles.contentText}>{post.content}</Text>
      </Card.Content>
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
  contentText: { marginTop: 8, color: '#111827' },
  actions: { justifyContent: 'space-between', paddingHorizontal: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 4, color: '#6b7280' },
});
