"use client";

import { useEffect } from "react";

export function LogoutTransition({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) {
      return;
    }

    window.location.href = "/login";
  }, [active]);

  return null;
}
