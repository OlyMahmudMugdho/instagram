"use client";

import { useEffect } from "react";

export function LogoutTransition({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) {
      return;
    }

    window.location.assign("/login");
  }, [active]);

  return null;
}
