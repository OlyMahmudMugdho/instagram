"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Upload, message, Image } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { postsService } from "@/services/posts";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreatePostPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");

  const onFinish = async (values: { title: string; description: string }) => {
    setLoading(true);
    try {
      await postsService.createPost({ ...values, image: imageUrl });
      message.success("Post created successfully");
      router.push("/feed");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card title="Create New Post">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter post title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter description (optional)" />
          </Form.Item>

          <Form.Item label="Image">
            {imageUrl ? (
              <div>
                <Image src={imageUrl} style={{ maxWidth: 200 }} />
                <Button type="link" onClick={() => setImageUrl("")}>
                  Remove
                </Button>
              </div>
            ) : (
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = () => setImageUrl(reader.result as string);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}