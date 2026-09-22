"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { CharacterModel } from "@/components/three/CharacterModel";
import type { Character } from "@/types/game";

interface CharacterViewerProps {
  character: Character;
  className?: string;
  spin?: boolean;
  controls?: boolean;
}

function Rig({ character, spin, controls }: { character: Character; spin: boolean; controls: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.9, 2.4]} fov={30} />
      <ambientLight intensity={0.55} />
      <spotLight position={[2, 3, 2]} angle={0.4} penumbra={0.6} intensity={50} castShadow color="#ffffff" />
      <spotLight position={[-2, 2, -1]} angle={0.5} penumbra={0.8} intensity={18} color="#14b8a6" />
      <CharacterModel character={character} spin={spin} />
      <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={3} blur={2} far={1.5} />
      <OrbitControls
        enabled={controls}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.55, 0]}
      />
    </>
  );
}

export function CharacterViewer({ character, className, spin = true, controls = true }: CharacterViewerProps) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 1.75]}>
        <color attach="background" args={["#050608"]} />
        <fog attach="fog" args={["#050608", 4, 8]} />
        <Suspense fallback={null}>
          <Rig character={character} spin={spin} controls={controls} />
        </Suspense>
      </Canvas>
    </div>
  );
}
