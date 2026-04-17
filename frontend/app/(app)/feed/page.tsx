"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Empty, Dropdown, MenuProps, Modal, Input, message } from "antd";
import { HeartOutlined, HeartFilled, MessageOutlined, UserOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { postsService, Post } from "@/services/posts";
import { useAuth } from "@/lib/auth-context";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState("");

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
    router.push(`/post?postID=${postId}`);
  };

  const handleDelete = (post: Post) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const res = await postsService.deletePost(post.userId, post.postId);
          if (res.success) {
            message.success("Post deleted successfully");
            setPosts(posts.filter(p => p.postId !== post.postId));
          } else {
            message.error(res.message || "Failed to delete post");
          }
        } catch (error) {
          message.error("Failed to delete post");
        }
      },
    });
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditContent(post.title); // title is actually content in our mapping
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    try {
      const res = await postsService.editPost(editingPost.userId, editingPost.postId, { content: editContent });
      if (res.success) {
        message.success("Post updated successfully");
        setPosts(posts.map(p => p.postId === editingPost.postId ? { ...p, title: editContent } : p));
        setEditModalVisible(false);
      } else {
        message.error(res.message || "Failed to update post");
      }
    } catch (error) {
      message.error("Failed to update post");
    }
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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
      <List
        dataSource={posts}
        loading={loading}
        loadMore={
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button onClick={() => setPage(page + 1)}>Load More</Button>
          </div>
        }
        renderItem={(post) => {
          const isOwner = user?._id === post.userId;
          const menuItems: MenuProps['items'] = [
            { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
            { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
          ];

          return (
            <Card
              style={{ marginBottom: 16, width: "100%" }}
              hoverable
              onClick={() => router.push(`/post?postID=${post._id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Meta
                  avatar={<Avatar src={post.avatar} icon={!post.avatar && <UserOutlined />} />}
                  title={post.username}
                  description={new Date(post.createdAt).toLocaleDateString()}
                  style={{ flex: 1 }}
                />
                {isOwner && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown 
                      menu={{ 
                        items: menuItems,
                        onClick: ({ key }) => {
                          if (key === 'edit') handleEdit(post);
                          if (key === 'delete') handleDelete(post);
                        }
                      }} 
                      trigger={['click']}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                )}
              </div>
              
              <div style={{ marginTop: 12 }}>
                <Paragraph style={{ fontSize: 16, margin: 0 }}>{post.title}</Paragraph>
              </div>
              
              {post.image && (
                <div style={{ margin: "12px 0" }}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    style={{ width: "100%", borderRadius: 4, display: "block" }}
                  />
                </div>
              )}
              
              <Space style={{ marginTop: 8 }}>
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
          );
        }}
      />

      <Modal
        title="Edit Post"
        open={editModalVisible}
        onOk={saveEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="Save"
      >
        <Input.TextArea
          rows={4}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="What's on your mind?"
        />
      </Modal>
    </div>
  );
}
