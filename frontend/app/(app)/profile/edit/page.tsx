"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message, Avatar } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/auth-context";

const { Title, Text } = Typography;

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const onFinish = async (values: { name: string; email: string }) => {
    setLoading(true);
    try {
      message.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: 16, background: "#f5f5f5" }}>
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Edit Profile</Title>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar size={80} src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
          <div style={{ marginTop: 8 }}>
            <Button icon={<UploadOutlined />}>Change Photo</Button>
          </div>
        </div>

        <Form
          name="edit"
          initialValues={{
            username: user?.username,
            name: user?.name,
            email: user?.email
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}