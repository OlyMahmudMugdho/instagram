"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(values.email);
      if (res.success) {
        message.success("Reset code sent to your email");
        // Store email in sessionStorage to use in the next steps
        sessionStorage.setItem("resetEmail", values.email);
        router.push("/verify-code");
      } else {
        message.error(res.message || "Failed to send reset code");
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
          <Title level={3}>Forgot Password</Title>
          <Text type="secondary">Enter your email to receive a reset code</Text>
        </div>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Send Code
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <a href="/login">Back to Login</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
