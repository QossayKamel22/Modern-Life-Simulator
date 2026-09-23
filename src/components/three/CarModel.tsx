"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import type { VehicleBodyStyle } from "@/types/game";

interface CarModelProps {
  color: string;
  performance: number; // 0-100
  bodyStyle?: VehicleBodyStyle;
  spin?: boolean;
}

interface StyleConfig {
  // Body silhouette extents (X = length, Y = height above ground).
  noseX: number;
  tailX: number;
  bottomY: number;
  beltlineY: number;
  boxy: boolean; // straighter panel lines (SUV) vs swoopy curves
  // Cabin greenhouse.
  cabinX: number;
  cabinLength: number;
  cabinHeight: number;
  cabinWidth: number;
  // Wheels — the wheel center sits at Y = wheelRadius so the tire always touches
  // local Y = 0 (the showroom floor); bottomY above only shapes the body shell.
  wheelRadius: number;
  trackZ: number; // half-width of the wheel track
  axleX: number; // distance from center to each axle
  // Extras.
  hasSpoiler: boolean;
}

const STYLE_CONFIG: Record<VehicleBodyStyle, StyleConfig> = {
  sedan: {
    noseX: 1.5,
    tailX: -1.35,
    bottomY: 0.08,
    beltlineY: 0.56,
    boxy: false,
    cabinX: 0.0,
    cabinLength: 1.05,
    cabinHeight: 0.4,
    cabinWidth: 1.0,
    wheelRadius: 0.33,
    trackZ: 0.61,
    axleX: 0.92,
    hasSpoiler: false,
  },
  suv: {
    noseX: 1.5,
    tailX: -1.45,
    bottomY: 0.22,
    beltlineY: 0.78,
    boxy: true,
    cabinX: -0.05,
    cabinLength: 1.55,
    cabinHeight: 0.5,
    cabinWidth: 1.06,
    wheelRadius: 0.4,
    trackZ: 0.66,
    axleX: 0.98,
    hasSpoiler: false,
  },
  coupe: {
    noseX: 1.65,
    tailX: -1.25,
    bottomY: 0.06,
    beltlineY: 0.48,
    boxy: false,
    cabinX: -0.15,
    cabinLength: 0.9,
    cabinHeight: 0.32,
    cabinWidth: 1.0,
    wheelRadius: 0.34,
    trackZ: 0.64,
    axleX: 0.95,
    hasSpoiler: true,
  },
  hypercar: {
    noseX: 1.7,
    tailX: -1.4,
    bottomY: 0.04,
    beltlineY: 0.38,
    boxy: false,
    cabinX: 0.05,
    cabinLength: 0.75,
    cabinHeight: 0.24,
    cabinWidth: 1.02,
    wheelRadius: 0.36,
    trackZ: 0.7,
    axleX: 1.05,
    hasSpoiler: true,
  },
};

function useBodyGeometry(style: StyleConfig) {
  return useMemo(() => {
    const { noseX, tailX, bottomY, beltlineY, boxy, trackZ } = style;
    const shape = new THREE.Shape();
    const bumperH = bottomY + (beltlineY - bottomY) * 0.35;

    shape.moveTo(tailX - 0.05, bottomY);
    if (boxy) {
      shape.lineTo(tailX - 0.08, beltlineY - 0.05);
      shape.lineTo(tailX + 0.05, beltlineY);
      shape.lineTo(noseX - 0.1, beltlineY);
      shape.lineTo(noseX + 0.05, beltlineY - 0.06);
      shape.lineTo(noseX + 0.08, bumperH);
      shape.lineTo(noseX + 0.02, bottomY);
    } else {
      shape.lineTo(tailX - 0.1, bumperH);
      shape.quadraticCurveTo(tailX - 0.12, beltlineY - 0.18, tailX + 0.2, beltlineY - 0.06);
      shape.quadraticCurveTo(tailX + 0.5, beltlineY, tailX + 0.85, beltlineY + 0.02);
      shape.lineTo(noseX - 0.85, beltlineY + 0.02);
      shape.quadraticCurveTo(noseX - 0.5, beltlineY, noseX - 0.2, beltlineY - 0.1);
      shape.quadraticCurveTo(noseX + 0.02, beltlineY - 0.24, noseX + 0.07, bumperH);
      shape.quadraticCurveTo(noseX + 0.09, bottomY + 0.04, noseX, bottomY);
    }
    shape.lineTo(tailX - 0.05, bottomY);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: trackZ * 2 + 0.1,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.04,
      bevelSegments: 4,
      curveSegments: 12,
    });
    geometry.translate(0, 0, -(trackZ * 2 + 0.1) / 2);
    geometry.computeVertexNormals();
    return geometry;
  }, [style]);
}

function Wheel({ position, radius }: { position: [number, number, number]; radius: number }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <Cylinder args={[radius, radius, 0.24, 24]} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
      </Cylinder>
      <Cylinder args={[radius * 0.56, radius * 0.56, 0.26, 6]} castShadow>
        <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
      </Cylinder>
      <Cylinder args={[radius * 0.18, radius * 0.18, 0.27, 12]} castShadow>
        <meshStandardMaterial color="#e7e9ed" metalness={0.95} roughness={0.15} />
      </Cylinder>
    </group>
  );
}

export function CarModel({ color, performance, bodyStyle = "sedan", spin = true }: CarModelProps) {
  const group = useRef<Group>(null);
  const style = STYLE_CONFIG[bodyStyle];
  const bodyGeometry = useBodyGeometry(style);
  const hyper = bodyStyle === "hypercar";
  const showSpoiler = style.hasSpoiler && performance >= 65;

  useFrame((_, delta) => {
    if (spin && group.current) group.current.rotation.y += delta * 0.45;
  });

  const cabinY = style.beltlineY + style.cabinHeight / 2;

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Sculpted body shell */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} metalness={0.65} roughness={0.25} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>

      {/* Glass greenhouse (roof / windows) */}
      <RoundedBox
        args={[style.cabinLength, style.cabinHeight, style.cabinWidth]}
        radius={0.13}
        smoothness={4}
        position={[style.cabinX, cabinY, 0]}
        castShadow
      >
        <meshPhysicalMaterial color="#0a0d13" metalness={0.2} roughness={0.08} transmission={0.5} thickness={0.4} />
      </RoundedBox>

      {/* Side mirrors */}
      <mesh position={[style.cabinX + style.cabinLength / 2 - 0.1, cabinY - 0.05, style.trackZ + 0.03]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[style.cabinX + style.cabinLength / 2 - 0.1, cabinY - 0.05, -style.trackZ - 0.03]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.05]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front grille */}
      <mesh position={[style.noseX, style.beltlineY * 0.45, 0]}>
        <boxGeometry args={[0.04, style.beltlineY * 0.35, style.trackZ * 0.8]} />
        <meshStandardMaterial color="#0c0d10" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Headlights */}
      <mesh position={[style.noseX + 0.03, style.beltlineY * 0.55, style.trackZ * 0.6]}>
        <boxGeometry args={[0.06, 0.09, 0.2]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[style.noseX + 0.03, style.beltlineY * 0.55, -style.trackZ * 0.6]}>
        <boxGeometry args={[0.06, 0.09, 0.2]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={1.4} />
      </mesh>

      {/* Taillights */}
      <mesh position={[style.tailX - 0.02, style.beltlineY * 0.6, style.trackZ * 0.62]}>
        <boxGeometry args={[0.05, 0.1, 0.19]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[style.tailX - 0.02, style.beltlineY * 0.6, -style.trackZ * 0.62]}>
        <boxGeometry args={[0.05, 0.1, 0.19]} />
        <meshStandardMaterial color="#ff2e2e" emissive="#ff2e2e" emissiveIntensity={1.2} />
      </mesh>

      {/* Spoiler for coupes/hypercars at high performance */}
      {showSpoiler && (
        <group position={[style.tailX + 0.2, style.beltlineY + 0.2, 0]}>
          <mesh position={[0, 0, style.trackZ * 0.68]} castShadow>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <mesh position={[0, 0, -style.trackZ * 0.68]} castShadow>
            <boxGeometry args={[0.05, 0.16, 0.05]} />
            <meshStandardMaterial color="#111318" />
          </mesh>
          <RoundedBox args={[0.26, 0.045, style.trackZ * 1.6]} radius={0.02} position={[0, 0.16, 0]} castShadow>
            <meshPhysicalMaterial color={hyper ? "#111318" : color} metalness={0.5} roughness={0.3} />
          </RoundedBox>
        </group>
      )}

      {/* Wheels */}
      <Wheel position={[style.axleX, style.wheelRadius, style.trackZ]} radius={style.wheelRadius} />
      <Wheel position={[style.axleX, style.wheelRadius, -style.trackZ]} radius={style.wheelRadius} />
      <Wheel position={[-style.axleX, style.wheelRadius, style.trackZ]} radius={style.wheelRadius} />
      <Wheel position={[-style.axleX, style.wheelRadius, -style.trackZ]} radius={style.wheelRadius} />
    </group>
  );
}
