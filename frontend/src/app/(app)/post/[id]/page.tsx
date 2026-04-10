"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Input, Image } from "antd";
import { HeartOutlined, HeartFilled, SendOutlined, UserOutlined } from "@ant-design/icons";
import { postsService, Post } from "@/services/posts";

const { Title, Text, Paragraph } = Typography;

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await postsService.getPost(postId);
      if (res.success && res.post) {
        setPost(res.post);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      if (post.isLiked) {
        await postsService.unlikePost(postId);
      } else {
        await postsService.likePost(postId);
      }
      setPost({ ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      // TODO: Implement comment service
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Avatar src={post.avatar} icon={!post.avatar && <UserOutlined />} />
          <Text strong>{post.username}</Text>
          <Text type="secondary">{new Date(post.createdAt).toLocaleDateString()}</Text>
        </div>

        {post.image && (
          <Image src={post.image} alt={post.title} style={{ width: "100%", borderRadius: 4 }} />
        )}

        <div style={{ marginTop: 16 }}>
          <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
          {post.description && <Paragraph>{post.description}</Paragraph>}
        </div>

        <Space style={{ marginTop: 12 }}>
          <Button
            type="text"
            icon={post.isLiked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
            onClick={handleLike}
          >
            {post.likes}
          </Button>
        </Space>
      </Card>

      <Card title="Comments" style={{ marginTop: 16 }}>
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text strong>{comment.username}</Text>
                <Text>{comment.text}</Text>
              </Space>
            </List.Item>
          )}
        />

        <Space.Compact style={{ width: "100%", marginTop: 16 }}>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onPressEnter={handleComment}
          />
          <Button icon={<SendOutlined />} onClick={handleComment} />
        </Space.Compact>
      </Card>
    </div>
  );
}