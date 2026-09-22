"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import type { Group } from "three";

interface CarModelProps {
  color: string;
  performance: number; // 0-100, widens stance / adds spoiler above ~70
  spin?: boolean;
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <Cylinder args={[0.34, 0.34, 0.22, 24]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </Cylinder>
      <Cylinder args={[0.18, 0.18, 0.24, 20]} castShadow>
        <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
      </Cylinder>
    </group>
  );
}

export function CarModel({ color, performance, spin = true }: CarModelProps) {
  const group = useRef<Group>(null);
  const sporty = performance >= 65;
  const hyper = performance >= 92;

  useFrame((_, delta) => {
    if (spin && group.current) {
      group.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* Lower body / chassis */}
      <RoundedBox args={[2.5, 0.5, 1.15]} radius={0.16} smoothness={4} position={[0, 0.35, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>

      {/* Cabin */}
      <RoundedBox
        args={[sporty ? 1.15 : 1.35, 0.42, 1.0]}
        radius={0.14}
        smoothness={4}
        position={[sporty ? -0.05 : 0, 0.72, 0]}
        castShadow
      >
        <meshPhysicalMaterial color="#0d1016" metalness={0.3} roughness={0.1} transmission={0.55} thickness={0.4} />
      </RoundedBox>

      {/* Nose taper */}
      <RoundedBox args={[0.5, 0.42, 1.05]} radius={0.14} smoothness={4} position={[1.35, 0.4, 0]} castShadow>
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.28} clearcoat={1} />
      </RoundedBox>

      {/* Headlights */}
      <mesh position={[1.58, 0.42, 0.38]}>
        <boxGeometry args={[0.06, 0.1, 0.22]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[1.58, 0.42, -0.38]}>
        <boxGeometry args={[0.06, 0.1, 0.22]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.52, 0.42, 0.4]}>
        <boxGeometry args={[0.05, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-1.52, 0.42, -0.4]}>
        <boxGeometry args={[0.05, 0.1, 0.2]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>

      {/* Spoiler for high-performance cars */}
      {sporty && (
        <group position={[-1.3, 0.78, 0]}>
          <mesh position={[0, 0, 0.45]} castShadow>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <mesh position={[0, 0, -0.45]} castShadow>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <RoundedBox args={[0.28, 0.05, 1.05]} radius={0.02} position={[0, 0.16, 0]} castShadow>
            <meshPhysicalMaterial color={hyper ? "#111318" : color} metalness={0.5} roughness={0.3} />
          </RoundedBox>
        </group>
      )}

      {/* Wheels */}
      <Wheel position={[0.85, 0.05, 0.62]} />
      <Wheel position={[0.85, 0.05, -0.62]} />
      <Wheel position={[-0.85, 0.05, 0.62]} />
      <Wheel position={[-0.85, 0.05, -0.62]} />
    </group>
  );
}
