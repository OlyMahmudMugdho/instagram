"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/login");
    }
  }, [router, pathname]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Spin size="large" />
    </div>
  );
}