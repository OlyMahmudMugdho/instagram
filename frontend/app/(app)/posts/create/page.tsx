"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Upload, message, Image } from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { endpoints } from "@/lib/api/endpoints";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = async (values: { content: string }) => {
    if (fileList.length === 0) {
      message.error("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", values.content);
      
      fileList.forEach((file) => {
        formData.append("image", file.originFileObj);
      });

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://instagram-38a4.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}${endpoints.posts.create}`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const res = await response.json();

      if (res.success || res.sucess) { // Backend has a typo "sucess"
        message.success("Post created successfully");
        router.push("/feed");
      } else {
        message.error(res.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      message.error("An error occurred while creating the post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ fileList: newFileList }: any) => setFileList(newFileList);

  return (
    <div style={{ maxWidth: 600, margin: "24px auto", padding: "0 16px" }}>
      <Card title={<Title level={4} style={{ margin: 0 }}>Create New Post</Title>}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="content"
            label="Caption"
            rules={[{ required: true, message: "Please enter a caption" }]}
          >
            <TextArea rows={4} placeholder="Write something..." />
          </Form.Item>

          <Form.Item label="Images" required>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false} // Prevent automatic upload
              accept="image/*"
              multiple
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Share Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}