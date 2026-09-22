"use client";

import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled } from "@/lib/audio/sfx";

export function useSound(): { enabled: boolean; toggle: () => void } {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a per-browser preference on mount
    setEnabled(isSoundEnabled());
  }, []);

  function toggle() {
    setEnabled((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }

  return { enabled, toggle };
}
