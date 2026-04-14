"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Input, Dropdown, MenuProps, Modal, message } from "antd";
import { HeartOutlined, HeartFilled, SendOutlined, UserOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { postsService, Post, Comment, commentsService } from "@/services/posts";
import { useAuth } from "@/lib/auth-context";

const { Title, Text, Paragraph } = Typography;

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await postsService.getPost(postId);
      if (res.success && res.post) {
        setPost(res.post);
        loadComments(res.post.userId, res.post.postId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (userId: string, postId: string) => {
    try {
      const res = await commentsService.getComments(userId, postId);
      if (res.success && res.comments) {
        setComments(res.comments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      if (post.isLiked) {
        await postsService.unlikePost(post.userId, post.postId);
      } else {
        await postsService.likePost(post.userId, post.postId);
      }
      setPost({ ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !post) return;
    try {
      const res = await commentsService.addComment(post.userId, post.postId, newComment);
      if (res.success) {
        setNewComment("");
        loadComments(post.userId, post.postId);
        setPost({ ...post, comments: (post.comments || 0) + 1 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    if (!post) return;
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
            router.push("/feed");
          } else {
            message.error(res.message || "Failed to delete post");
          }
        } catch (error) {
          message.error("Failed to delete post");
        }
      },
    });
  };

  const handleEdit = () => {
    if (!post) return;
    setEditContent(post.title);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!post) return;
    try {
      const res = await postsService.editPost(post.userId, post.postId, { content: editContent });
      if (res.success) {
        message.success("Post updated successfully");
        setPost({ ...post, title: editContent });
        setEditModalVisible(false);
      } else {
        message.error(res.message || "Failed to update post");
      }
    } catch (error) {
      message.error("Failed to update post");
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

  const isOwner = user?._id === post.userId;
  const menuItems: MenuProps['items'] = [
    { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
    { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Avatar src={post.avatar} icon={!post.avatar && <UserOutlined />} />
            <div>
              <Text strong style={{ display: 'block' }}>{post.username}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{new Date(post.createdAt).toLocaleDateString()}</Text>
            </div>
          </Space>
          
          {isOwner && (
            <Dropdown 
              menu={{ 
                items: menuItems,
                onClick: ({ key }) => {
                  if (key === 'edit') handleEdit();
                  if (key === 'delete') handleDelete();
                }
              }} 
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Paragraph style={{ fontSize: 18, margin: 0 }}>{post.title}</Paragraph>
        </div>

        {post.image && (
          <div style={{ margin: "16px -24px" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", display: "block" }} />
          </div>
        )}

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

      <Card title="Comments" style={{ marginTop: 16 }}>
        <List
          dataSource={comments}
          renderItem={(comment: Comment) => (
            <List.Item>
              <Space align="start">
                <Avatar size="small" icon={<UserOutlined />} />
                <div>
                  <Text strong>{comment.username}</Text>
                  <Paragraph style={{ margin: 0 }}>{comment.text}</Paragraph>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </div>
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
