"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth";

const { Title, Text } = Typography;

export default function VerifyCodePage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const onFinish = async (values: { code: string }) => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await authService.verifyCode(email, values.code);
      if (res.success) {
        message.success("Code verified successfully");
        router.push("/reset-password");
      } else {
        message.error(res.message || "Invalid code");
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5", padding: 16 }}>
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>Verify Code</Title>
          <Text type="secondary">Enter the 6-digit code sent to <b>{email}</b></Text>
        </div>

        <Form
          name="verify-code"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="code"
            rules={[{ required: true, message: "Please input the code" }]}
          >
            <Input prefix={<SafetyOutlined />} placeholder="Verification Code" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Verify Code
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <a href="/forgot-password" onClick={(e) => {
              e.preventDefault();
              router.push("/forgot-password");
            }}>Resend Code</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
