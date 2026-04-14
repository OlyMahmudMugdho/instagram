"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography, Spin, Grid } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/lib/auth-context";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { LogoutTransition } from "@/components/auth/logout-transition";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: "/feed", icon: <HomeOutlined />, label: "Feed" },
  { key: "/posts/create", icon: <PlusOutlined />, label: "Create" },
  { key: "/profile", icon: <UserOutlined />, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const screens = useBreakpoint();
  const [logoutPending, setLogoutPending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
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
    setLogoutPending(true);
  };

  const userMenu: MenuProps = {
    items: [
      { key: "profile", label: "My Profile" },
      { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
    ],
    onClick: ({ key }) => {
      if (key === "profile") {
        router.push("/profile");
      }
      if (key === "logout") {
        void handleLogout();
      }
    },
  };

  return (
    <AntdRegistry>
      <ConfigProvider>
        <LogoutTransition active={logoutPending} />
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ 
            position: 'fixed', 
            zIndex: 1001, 
            width: '100%',
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "0 16px", 
            background: "#fff", 
            borderBottom: "1px solid #f0f0f0", 
            flexWrap: "wrap" 
          }}>
            <Text strong style={{ fontSize: 18, cursor: "pointer" }} onClick={() => router.push("/feed")}>
              Instagram
            </Text>
            
            {!screens.md && (
               <Dropdown menu={userMenu} placement="bottomRight">
                 <Avatar style={{ cursor: "pointer" }} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
               </Dropdown>
            )}

            {screens.md && (
              <Space size={16}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/posts/create")}>
                  New Post
                </Button>
                <Dropdown menu={userMenu} placement="bottomRight">
                  <Avatar style={{ cursor: "pointer" }} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
                </Dropdown>
              </Space>
            )}
          </Header>

          <Layout style={{ marginTop: 64 }}>
            {screens.md && (
              <Sider 
                width={200} 
                style={{ 
                  overflow: 'auto',
                  height: 'calc(100vh - 64px)',
                  position: 'fixed',
                  left: 0,
                  top: 64,
                  bottom: 0,
                  background: "#fff", 
                  paddingTop: 16,
                  borderRight: "1px solid #f0f0f0"
                }}
              >
                <Menu
                  mode="inline"
                  selectedKeys={[pathname]}
                  items={[
                    { key: "/feed", icon: <HomeOutlined />, label: "Feed" },
                    { key: "/posts/create", icon: <PlusOutlined />, label: "Create" },
                    { key: "/profile", icon: <UserOutlined />, label: "Profile" },
                  ]}
                  onClick={({ key }) => handleMenuClick(key)}
                  style={{ borderRight: 0 }}
                />
              </Sider>
            )}

            <Layout style={{ 
              padding: screens.md ? "24px 16px" : "16px",
              marginLeft: screens.md ? 200 : 0,
              minHeight: 'calc(100vh - 64px)'
            }}>
              <Content style={{ background: "#fff", padding: screens.md ? 24 : 12, minHeight: 280 }}>
                {children}
              </Content>
            </Layout>
          </Layout>
          
          {!screens.md && (
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "#fff", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-around", padding: "10px 0", zIndex: 1000 }}>
              {menuItems.map(item => (
                <div key={item.key} onClick={() => handleMenuClick(item.key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: pathname === item.key ? "#1890ff" : "#595959" }}>
                   <span style={{ fontSize: 18 }}>{item.icon}</span>
                   <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </Layout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
