"use client";

import { useEffect, useState } from "react";

export function Toast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must re-show on every new message, including repeats of the same text
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto rounded-full border border-border bg-surface-raised px-4 py-2.5 text-sm font-medium text-foreground shadow-lg shadow-black/10">
        {message}
      </div>
    </div>
  );
}
