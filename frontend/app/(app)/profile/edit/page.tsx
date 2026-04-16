"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message, Avatar, Spin, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { http } from "@/lib/api/http";
import { endpoints } from "@/lib/api/endpoints";

interface UserData {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
}

const { Title } = Typography;

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUser = async () => {
    try {
      const res = await http.get<{ success: boolean; user: UserData }>(endpoints.users.me);
      if (res.success && res.user) {
        setUserData(res.user);
        form.setFieldsValue({
          username: res.user.username,
          name: res.user.name,
          email: res.user.email
        });
      } else {
        message.error("Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      message.error("An error occurred while loading profile data");
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [form]);

  if (userLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Use standard fetch for multipart/form-data as our http helper might not be configured for it
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://instagram-38a4.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}${endpoints.users.profilePicture}`, {
        method: 'PUT',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const res = await response.json();

      if (res.success) {
        message.success("Profile picture updated");
        fetchUser(); // Refresh user data
      } else {
        message.error(res.message || "Failed to upload picture");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const onFinish = async (values: { name: string; email: string }) => {
    setLoading(true);
    try {
      const res = await http.put<{ success: boolean; message: string }>(endpoints.users.edit, {
        body: {
          name: values.name,
          email: values.email
        }
      });

      if (res.success) {
        message.success(res.message || "Profile updated successfully");
        router.push("/profile");
      } else {
        message.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
          <Avatar size={80} src={userData?.avatar} icon={!userData?.avatar && <UserOutlined />} />
          <div style={{ marginTop: 8 }}>
            <Upload 
              beforeUpload={handleUpload} 
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} loading={uploading}>Change Photo</Button>
            </Upload>
          </div>
        </div>

        <Form
          form={form}
          name="edit"
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
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input />
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