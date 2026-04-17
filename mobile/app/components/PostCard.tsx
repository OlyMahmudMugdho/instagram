import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar, IconButton, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { interactionService } from '../../src/services/interactions';

interface PostCardProps {
  post: any;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = React.useState(!!post.isLiked);
  const [likesCount, setLikesCount] = React.useState(Number(post.likes) || 0);

  // Initialize liked status
  React.useEffect(() => {
    const checkStatus = async () => {
      const status = await interactionService.isLiked(post.userId, post.postId);
      setLiked(status);
    };
    checkStatus();
  }, [post.userId, post.postId]);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    
    if (newLiked) {
      await interactionService.likePost(post.userId, post.postId);
    } else {
      await interactionService.unlikePost(post.userId, post.postId);
    }
  };

  const handlePress = () => {
    router.push({
      pathname: '/post-details',
      params: { post: JSON.stringify({ ...post, isLiked: liked, likes: likesCount }) }
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card style={styles.card} elevation={2}>
        <Card.Title
          title={<Text>{post.username || 'Unknown'}</Text>}
          left={(props) => (
            post.avatar || post.profilePicture ? 
              <Avatar.Image {...props} source={{ uri: post.avatar || post.profilePicture }} /> :
              <Avatar.Text {...props} label={(post.username || 'U').slice(0, 1).toUpperCase()} />
          )}
        />
        {post.image ? <Card.Cover source={{ uri: post.image }} /> : null}
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium">{post.title}</Text>
        </Card.Content>
        <Card.Actions>
          <View style={styles.actionRow}>
            <IconButton icon={liked ? "heart" : "heart-outline"} iconColor={liked ? "red" : undefined} onPress={handleLike} />
            <Text variant="bodyMedium">{likesCount}</Text>
          </View>
          <View style={styles.actionRow}>
            <IconButton icon="comment-outline" onPress={handlePress} />
            <Text variant="bodyMedium">{post.comments || 0}</Text>
          </View>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginVertical: 8 },
  content: { marginTop: 8 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
});
