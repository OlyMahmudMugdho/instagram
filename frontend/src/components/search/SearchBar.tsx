import React, { useState } from 'react';
import { Input, List, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { usersService } from '@/services/users';
import { useRouter } from 'next/navigation';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const router = useRouter();

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length > 1) {
      const res = await usersService.searchUsers(q);
      if (res.success && res.result) setResults(res.result);
      else setResults(null);
    } else {
      setResults(null);
    }
  };

  return (
    <div className="search-bar" style={{ marginBottom: '24px' }}>
      <Input
        size="large"
        placeholder="Search users..."
        prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      />
      {results && (
        <List
          style={{ marginTop: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0' }}
          dataSource={results.usernames}
          renderItem={(item: string, i: number) => (
            <List.Item 
              onClick={() => router.push(`/profile?userID=${results.userIDs[i]}`)}
              style={{ padding: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
              className="search-item"
            >
              <List.Item.Meta
                avatar={<Avatar>{item[0].toUpperCase()}</Avatar>}
                title={item}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
