import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Text, IconButton, Avatar, Button, List } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { interactionService } from '../src/services/interactions';

interface PostComment {
  _id: string;
  commentID: string;
  username: string;
  text: string;
  createdAt?: string;
}

export default function PostDetails() {
  const { post: postParam } = useLocalSearchParams();
  const post = JSON.parse(postParam as string);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const [isLiked, fetchedComments] = await Promise.all([
      interactionService.isLiked(post.userId, post.postId),
      interactionService.getComments(post.userId, post.postId)
    ]);
    setLiked(isLiked);
    setComments(fetchedComments);
  };

  const handleLike = async () => {
    if (liked) {
      await interactionService.unlikePost(post.userId, post.postId);
      setLiked(false);
    } else {
      await interactionService.likePost(post.userId, post.postId);
      setLiked(true);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const success = await interactionService.addComment(post.userId, post.postId, comment);
    if (success) {
      setComment('');
      loadStatus();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title 
            title={post.username} 
            left={(props) => (
              post.avatar || post.profilePicture ? 
                <Avatar.Image {...props} source={{ uri: post.avatar || post.profilePicture }} /> :
                <Avatar.Text {...props} label={post.username[0]} />
            )} 
          />
          <Card.Content style={styles.content}>
            <Text variant="titleMedium">{post.title}</Text>
          </Card.Content>
          {post.image ? <Card.Cover source={{ uri: post.image }} /> : null}
          <Card.Actions style={styles.actions}>
            <View style={styles.leftAction}>
              <IconButton icon={liked ? "heart" : "heart-outline"} iconColor={liked ? "red" : undefined} onPress={handleLike} />
              <Text>{post.likes || 0}</Text>
            </View>
            <View style={styles.rightAction}>
              <IconButton icon="comment-outline" onPress={() => {}} />
              <Text>{comments.length}</Text>
            </View>
          </Card.Actions>
        </Card>
        
        <List.Section title="Comments">
          {comments.map((c, index: number) => (
            <Card key={index} style={styles.commentCard}>
              <Card.Title 
                title={c.username || 'Unknown'} 
                subtitle={c.text}
              />
            </Card>
          ))}
        </List.Section>
        <View style={{ height: 100 }} />
      </ScrollView>
      
      <View style={styles.commentInputContainer}>
        <TextInput 
          placeholder="Add a comment..." 
          style={styles.input} 
          value={comment} 
          onChangeText={setComment} 
        />
        <Button onPress={handleComment}>Post</Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContainer: { padding: 10, paddingTop: 40 },
  content: { paddingVertical: 15 },
  actions: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftAction: { flexDirection: 'row', alignItems: 'center' },
  rightAction: { flexDirection: 'row', alignItems: 'center' },
  commentInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff', paddingBottom: 60 },
  input: { flex: 1 },
  commentCard: { marginVertical: 5 },
});
