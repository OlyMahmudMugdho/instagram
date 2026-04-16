"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Avatar, Button, Space, Typography, Spin, List, Tabs } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/auth-context";
import { postsService, Post } from "@/services/posts";

const { Title, Text, Paragraph } = Typography;

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await postsService.getFeed(1, 20);
      if (res.success && res.posts) {
        setPosts(res.posts.filter(p => p.userId === user?._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

        <Space style={{ marginTop: 24 }}>
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
              children: (
                <List
                  grid={{ gutter: 8, column: 3 }}
                  dataSource={posts}
                  renderItem={(post) => (
                    post.image && (
                      <List.Item>
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{ width: "100%", aspectRatio: 1, objectFit: "cover", cursor: "pointer" }}
                          onClick={() => router.push(`/post/${post._id}`)}
                        />
                      </List.Item>
                    )
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