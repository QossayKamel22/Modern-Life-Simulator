"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshReflectorMaterial, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { CarModel } from "@/components/three/CarModel";

interface CarViewerProps {
  color: string;
  performance: number;
  className?: string;
  spin?: boolean;
  /** Multiplier on the default camera distance — use >1 for a wide, pulled-back hero shot. */
  zoom?: number;
  controls?: boolean;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.29, 0]} receiveShadow>
      <planeGeometry args={[16, 16]} />
      <MeshReflectorMaterial
        blur={[300, 80]}
        resolution={1024}
        mixBlur={1}
        mixStrength={35}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#050608"
        metalness={0.6}
      />
    </mesh>
  );
}

function Rig({
  performance,
  color,
  spin,
  zoom,
  controls,
}: {
  performance: number;
  color: string;
  spin: boolean;
  zoom: number;
  controls: boolean;
}) {
  const base: [number, number, number] = [3.6, 1.5, 3.6];
  const position: [number, number, number] = [base[0] * zoom, base[1] * zoom, base[2] * zoom];

  return (
    <>
      <PerspectiveCamera makeDefault position={position} fov={32} />
      <ambientLight intensity={0.35} />
      <spotLight position={[4, 6, 2]} angle={0.35} penumbra={0.6} intensity={80} castShadow color="#ffffff" />
      <spotLight position={[-4, 4, -3]} angle={0.4} penumbra={0.8} intensity={30} color="#5b8cff" />
      <pointLight position={[0, 1.5, -3]} intensity={12} color="#ff6bd6" />
      <CarModel color={color} performance={performance} spin={spin} />
      <ContactShadows position={[0, -0.28, 0]} opacity={0.65} scale={8} blur={2.2} far={2} />
      <Floor />
      {/* Always mounted so the camera orients toward the car even when user interaction is disabled. */}
      <OrbitControls
        enabled={controls}
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={2.6}
        maxDistance={9}
        autoRotate={false}
      />
    </>
  );
}

export function CarViewer({ color, performance, className, spin = true, zoom = 1, controls = true }: CarViewerProps) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
        <color attach="background" args={["#050608"]} />
        <fog attach="fog" args={["#050608", 6, 14]} />
        <Suspense fallback={null}>
          <Rig performance={performance} color={color} spin={spin} zoom={zoom} controls={controls} />
        </Suspense>
      </Canvas>
    </div>
  );
}
