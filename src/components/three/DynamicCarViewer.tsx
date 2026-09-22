"use client";

import dynamic from "next/dynamic";

function ViewerLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  );
}

export const DynamicCarViewer = dynamic(
  () => import("@/components/three/CarViewer").then((m) => m.CarViewer),
  { ssr: false, loading: ViewerLoading },
);
