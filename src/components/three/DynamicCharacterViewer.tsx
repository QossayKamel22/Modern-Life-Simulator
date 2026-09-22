"use client";

import dynamic from "next/dynamic";

function ViewerLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  );
}

export const DynamicCharacterViewer = dynamic(
  () => import("@/components/three/CharacterViewer").then((m) => m.CharacterViewer),
  { ssr: false, loading: ViewerLoading },
);
