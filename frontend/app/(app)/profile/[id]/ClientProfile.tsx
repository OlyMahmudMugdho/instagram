"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Typography, Avatar, Card, Space, Button, message, Tabs, List, Empty } from "antd";
import { UserOutlined, UserAddOutlined, UserDeleteOutlined, LockOutlined } from "@ant-design/icons";
import { User, usersService } from "@/services/users";
import { useAuth } from "@/lib/auth-context";
import { postsService, Post } from "@/services/posts";

const { Title, Text, Paragraph } = Typography;

interface ClientProfileProps {
  userId?: string;
}

export default function ClientProfile({ userId }: ClientProfileProps) {
  const { id } = useParams();
  const targetUserId = userId || (id as string);
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    try {
      const res = await usersService.getProfile(targetUserId);
      if (res.success && res.message?.foundUser) {
        setUser(res.message.foundUser);
        if (res.message.foundUser.isFriend) {
          fetchPosts();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!targetUserId) return;
    setPostsLoading(true);
    try {
      const res = await postsService.getUserPosts(targetUserId);
      if (res.success && res.posts) {
        setPosts(res.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [targetUserId]);

  const handleFollow = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const res = await usersService.follow(user.userID);
      if (res.success) {
        message.success("Followed successfully");
        fetchUser();
      }
    } catch (error) {
      message.error("Failed to follow");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const res = await usersService.unfollow(user.userID);
      if (res.success) {
        message.success("Unfollowed successfully");
        fetchUser();
      }
    } catch (error) {
      message.error("Failed to unfollow");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
      <Spin size="large" />
    </div>
  );
  if (!user) return <div style={{ textAlign: "center", marginTop: 40 }}>User not found</div>;

  const isOwnProfile = currentUser?._id === user.userID;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Avatar size={80} src={user.profilePicture} icon={!user.profilePicture && <UserOutlined />} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <Space wrap>
              <Title level={4} style={{ margin: 0 }}>{user.username}</Title>
              {!isOwnProfile && (
                user.isFollowing ? (
                  <Button 
                    icon={<UserDeleteOutlined />} 
                    onClick={handleUnfollow} 
                    loading={actionLoading}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={handleFollow} 
                    loading={actionLoading}
                  >
                    Follow
                  </Button>
                )
              )}
            </Space>
            <Paragraph style={{ margin: "8px 0" }}>{user.name}</Paragraph>
          </div>
        </div>

        <Space style={{ marginTop: 24 }} size="large">
          <div>
            <Text strong>{user.followers || 0}</Text>
            <Text type="secondary"> followers</Text>
          </div>
          <div>
            <Text strong>{user.following || 0}</Text>
            <Text type="secondary"> following</Text>
          </div>
        </Space>
      </Card>

      <Card style={{ marginTop: 16 }}>
        {user.isFriend || isOwnProfile ? (
          <Tabs
            defaultActiveKey="posts"
            items={[
              {
                key: "posts",
                label: "Posts",
                children: postsLoading ? (
                  <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
                ) : (
                  <List
                    grid={{ gutter: 8, column: 3 }}
                    dataSource={posts}
                    renderItem={(post) => (
                      <List.Item style={{ margin: 0 }}>
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            style={{ width: "100%", aspectRatio: 1, objectFit: "cover", cursor: "pointer" }}
                            onClick={() => router.push(`/post/${post._id}`)}
                          />
                        ) : (
                          <div 
                            style={{ width: "100%", aspectRatio: 1, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            onClick={() => router.push(`/post/${post._id}`)}
                          >
                            <Text type="secondary">No Image</Text>
                          </div>
                        )}
                      </List.Item>
                    )}
                  />
                ),
              },
            ]}
          />
        ) : (
          <Empty
            image={<LockOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />}
            description={
              <span>
                Account is Private. <br />
                <Text type="secondary">Become friends to see their posts.</Text>
              </span>
            }
          />
        )}
      </Card>
    </div>
  );
}
