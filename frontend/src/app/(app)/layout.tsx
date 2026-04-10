"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography, Spin } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/auth-context";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "/feed", icon: <HomeOutlined />, label: "Feed" },
  { key: "/profile", icon: <UserOutlined />, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return null;

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userMenu = {
    items: [
      { key: "profile", label: "My Profile", onClick: () => router.push("/profile") },
      { key: "logout", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout },
    ],
  };

  return (
    <AntdRegistry>
      <ConfigProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
            <Space size={20}>
              <Text strong style={{ fontSize: 18, cursor: "pointer" }} onClick={() => router.push("/feed")}>
                Instagram
              </Text>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/posts/create")}>
                New Post
              </Button>
            </Space>

            <Space size={16}>
              <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar style={{ cursor: "pointer" }} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
              </Dropdown>
            </Space>
          </Header>

          <Layout>
            <Sider width={200} style={{ background: "#fff", paddingTop: 16 }}>
              <Menu
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItems}
                onClick={({ key }) => handleMenuClick(key)}
                style={{ borderRight: 0 }}
              />
            </Sider>

            <Layout style={{ padding: "24px" }}>
              <Content style={{ background: "#fff", padding: 24, minHeight: 280 }}>
                {children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  );
}