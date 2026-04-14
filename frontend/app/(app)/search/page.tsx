"use client";

import { SearchBar } from "@/components/search/SearchBar";
import { Suggestions } from "@/components/home/Suggestions";
import { Divider, Button } from "antd";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Explore</h2>
      <SearchBar />
      <Divider />
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={() => router.push('/friends/requests')}>View Friend Requests</Button>
      </div>
      <Suggestions />
    </div>
  );
}
