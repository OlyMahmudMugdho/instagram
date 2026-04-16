"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { http } from "@/lib/api/http";
import { Spin, Typography, Avatar, Card, Space, Button, message } from "antd";
import { UserOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { User, usersService } from "@/services/users";
import { useAuth } from "@/lib/auth-context";

const { Title, Text, Paragraph } = Typography;

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await http.get<{ success: boolean; message: { foundUser: User } }>(`/users/${id}`);
      if (res.success && res.message?.foundUser) setUser(res.message.foundUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

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
    </div>
  );
}
