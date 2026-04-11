"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Empty, Image } from "antd";
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { postsService, Post } from "@/services/posts";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await postsService.getFeed(page);
      if (res.success && res.posts) {
        setPosts(prev => page === 1 ? res.posts! : [...prev, ...res.posts!]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postUserId: string, postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await postsService.unlikePost(postUserId, postId);
      } else {
        await postsService.likePost(postUserId, postId);
      }
      setPosts(posts.map(p => 
        p.postId === postId 
          ? { ...p, isLiked: !isLiked, likes: isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  if (loading && page === 1) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (posts.length === 0) {
    return <Empty description="No posts yet" />;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <List
        dataSource={posts}
        loading={loading}
        loadMore={
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button onClick={() => setPage(page + 1)}>Load More</Button>
          </div>
        }
        renderItem={(post) => (
          <Card
            style={{ marginBottom: 16 }}
            hoverable
            onClick={() => router.push(`/post/${post._id}`)}
          >
            <Meta
              avatar={<Avatar src={post.avatar} icon={!post.avatar && <UserOutlined />} />}
              title={post.username}
              description={new Date(post.createdAt).toLocaleDateString()}
            />
            
            {post.image && (
              <div style={{ margin: "12px 0" }}>
                <Image 
                  src={post.image} 
                  alt={post.title}
                  style={{ width: "100%", borderRadius: 4 }}
                  preview={false}
                />
              </div>
            )}
            
            <div style={{ marginTop: 12 }}>
              <Title level={5} style={{ margin: 0 }}>{post.title}</Title>
              {post.description && (
                <Paragraph style={{ marginTop: 8 }}>{post.description}</Paragraph>
              )}
            </div>
            
            <Space style={{ marginTop: 12 }}>
              <Button 
                type="text" 
                icon={post.isLiked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.userId, post.postId, !!post.isLiked);
                }}
              >
                {post.likes}
              </Button>
              <Button 
                type="text" 
                icon={<MessageOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleComment(post._id);
                }}
              >
                {post.comments}
              </Button>
            </Space>
          </Card>
        )}
      />
    </div>
  );
}