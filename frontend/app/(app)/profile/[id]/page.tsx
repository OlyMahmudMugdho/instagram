"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { http } from "@/lib/api/http";
import { Spin, Typography, Avatar, Card, Space, Button } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { User } from "@/services/users";

const { Title, Text, Paragraph } = Typography;

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get<{ success: boolean; message: { foundUser: User } }>(`/users/${id}`)
      .then(res => {
        if (res.success && res.message?.foundUser) setUser(res.message.foundUser);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
      <Spin size="large" />
    </div>
  );
  if (!user) return <div style={{ textAlign: "center", marginTop: 40 }}>User not found</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Avatar size={80} src={user.profilePicture} icon={!user.profilePicture && <UserOutlined />} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <Space wrap>
              <Title level={4} style={{ margin: 0 }}>{user.username}</Title>
              <Button type="primary" icon={<UserAddOutlined />}>
                Follow
              </Button>
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
    </div>
  );
}
