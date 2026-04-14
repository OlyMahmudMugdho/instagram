"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/api/http";
import { List, Avatar, Button, Typography, message } from "antd";

const { Title } = Typography;

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    http.get<{ success: boolean; requests: any[] }>("/friends/requests")
      .then(res => {
        if (res.success) setRequests(res.requests);
      });
  }, []);

  const acceptRequest = async (senderId: string) => {
    const res = await http.post<{ success: boolean }>("/friends/accept", { body: { sender: senderId } });
    if (res.success) {
      message.success("Request accepted");
      setRequests(requests.filter(req => req.sender.userID !== senderId));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Friend Requests</Title>
      <List
        dataSource={requests}
        renderItem={(req) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => acceptRequest(req.sender.userID)}>Accept</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={req.sender.profilePicture} />}
              title={req.sender.username}
              description={req.sender.name}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
