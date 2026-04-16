"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Tabs } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/auth-context";
import { postsService, Post } from "@/services/posts";

const { Title, Text, Paragraph } = Typography;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    refreshUser();
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await postsService.getUserPosts();
      if (res.success && res.posts) {
        setPosts(res.posts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Avatar size={80} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <Space wrap>
              <Title level={4} style={{ margin: 0 }}>{user.username}</Title>
              <Button icon={<EditOutlined />} onClick={() => router.push("/profile/edit")}>
                Edit Profile
              </Button>
            </Space>
            <Paragraph style={{ margin: "8px 0" }}>{user.name}</Paragraph>
            <Text type="secondary">{user.email}</Text>
          </div>
        </div>

        <Space style={{ marginTop: 24 }} size="large">
          <div>
            <Text strong>{posts.length}</Text>
            <Text type="secondary"> posts</Text>
          </div>
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
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
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
      </Card>
    </div>
  );
}