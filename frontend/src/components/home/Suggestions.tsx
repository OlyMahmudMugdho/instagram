import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Typography, List } from 'antd';
import { usersService, User } from '@/services/users';

const { Title } = Typography;

export const Suggestions = () => {
  const [suggested, setSuggested] = useState<User[]>([]);

  useEffect(() => {
    usersService.getSuggestions().then((res) => {
      if (res.success) setSuggested(res.suggested);
    });
  }, []);

  return (
    <div className="suggestions-container">
      <Title level={4} style={{ marginBottom: '16px' }}>Suggestions for You</Title>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={suggested}
        renderItem={(user) => (
          <List.Item>
            <Card 
              size="small" 
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                <Avatar size={64} src={user.profilePicture}>{user.username[0].toUpperCase()}</Avatar>
                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{user.name}</div>
                <Button 
                  type="primary" 
                  size="small" 
                  style={{ marginTop: '8px', width: '100%' }}
                  onClick={() => usersService.follow(user.userID).then(() => window.location.reload())}
                >
                  Follow
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
