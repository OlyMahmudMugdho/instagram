"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { http } from "@/lib/api/http";
import { Spin, Typography, Avatar } from "antd";

const { Title } = Typography;

export default function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get<{ success: boolean; message: { foundUser: any } }>(`/users/${id}`)
      .then(res => {
        if (res.success && res.message?.foundUser) setUser(res.message.foundUser);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin />;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ padding: 24 }}>
      <Avatar size={128} src={user.profilePicture} />
      <Title>{user.username}</Title>
      <p>{user.name}</p>
    </div>
  );
}
