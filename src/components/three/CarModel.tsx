"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

interface CarModelProps {
  color: string;
  performance: number; // 0-100, widens stance / adds spoiler above ~70
  spin?: boolean;
}

// Side-profile silhouette of the car body (X = length, Y = height), extruded
// along Z (width) and beveled so it reads as a sculpted shell rather than a box.
function useBodyGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.3, 0.06);
    shape.lineTo(-1.4, 0.18);
    shape.quadraticCurveTo(-1.42, 0.32, -1.35, 0.4);
    shape.quadraticCurveTo(-1.22, 0.48, -1.05, 0.5);
    shape.quadraticCurveTo(-0.82, 0.54, -0.65, 0.58);
    shape.lineTo(0.55, 0.58);
    shape.quadraticCurveTo(0.78, 0.55, 0.95, 0.5);
    shape.quadraticCurveTo(1.18, 0.44, 1.35, 0.38);
    shape.quadraticCurveTo(1.48, 0.32, 1.55, 0.22);
    shape.quadraticCurveTo(1.57, 0.12, 1.5, 0.06);
    shape.lineTo(-1.3, 0.06);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 1.24,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.04,
      bevelSegments: 4,
      curveSegments: 12,
    });
    geometry.translate(0, 0, -0.62);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <Cylinder args={[0.34, 0.34, 0.24, 24]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </Cylinder>
      <Cylinder args={[0.185, 0.185, 0.26, 6]} castShadow>
        <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.27, 12]} castShadow>
        <meshStandardMaterial color="#e7e9ed" metalness={0.95} roughness={0.15} />
      </Cylinder>
    </group>
  );
}

export function CarModel({ color, performance, spin = true }: CarModelProps) {
  const group = useRef<Group>(null);
  const bodyGeometry = useBodyGeometry();
  const sporty = performance >= 65;
  const hyper = performance >= 92;

  useFrame((_, delta) => {
    if (spin && group.current) {
      group.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={group} position={[0, -0.06, 0]}>
      {/* Sculpted body shell */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} metalness={0.65} roughness={0.25} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>

      {/* Glass greenhouse (roof / windows) */}
      <RoundedBox args={[1.02, 0.4, 1.0]} radius={0.15} smoothness={4} position={[0.02, 0.78, 0]} castShadow>
        <meshPhysicalMaterial color="#0a0d13" metalness={0.2} roughness={0.08} transmission={0.5} thickness={0.4} />
      </RoundedBox>

      {/* Side mirrors */}
      <mesh position={[0.42, 0.62, 0.64]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.42, 0.62, -0.64]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front grille */}
      <mesh position={[1.5, 0.22, 0]}>
        <boxGeometry args={[0.04, 0.16, 0.46]} />
        <meshStandardMaterial color="#0c0d10" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.53, 0.32, 0.36]}>
        <boxGeometry args={[0.06, 0.09, 0.2]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[1.53, 0.32, -0.36]}>
        <boxGeometry args={[0.06, 0.09, 0.2]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-1.36, 0.34, 0.38]}>
        <boxGeometry args={[0.05, 0.1, 0.19]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-1.36, 0.34, -0.38]}>
        <boxGeometry args={[0.05, 0.1, 0.19]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>

      {/* Spoiler for high-performance cars */}
      {sporty && (
        <group position={[-1.15, 0.62, 0]}>
          <mesh position={[0, 0, 0.42]} castShadow>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <mesh position={[0, 0, -0.42]} castShadow>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <RoundedBox args={[0.26, 0.045, 1.0]} radius={0.02} position={[0, 0.16, 0]} castShadow>
            <meshPhysicalMaterial color={hyper ? "#111318" : color} metalness={0.5} roughness={0.3} />
          </RoundedBox>
        </group>
      )}

      {/* Wheels */}
      <Wheel position={[0.92, 0.05, 0.64]} />
      <Wheel position={[0.92, 0.05, -0.64]} />
      <Wheel position={[-0.92, 0.05, 0.64]} />
      <Wheel position={[-0.92, 0.05, -0.64]} />
    </group>
  );
}
