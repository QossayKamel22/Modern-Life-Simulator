"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Character } from "@/types/game";

interface CharacterModelProps {
  character: Character;
  spin?: boolean;
}

const HAIR_COLORS: Record<string, string> = {
  black: "#1c1712",
  brown: "#4a3222",
  blonde: "#d9b565",
  red: "#8a3a24",
  gray: "#9a9691",
};

const CLOTHING_COLORS: Record<string, string> = {
  casual: "#3a6ea8",
  business: "#22262f",
  streetwear: "#151517",
  sportswear: "#c8912f",
};

const SKIN_TONE = "#e0ad86";

function bodyScale(bodyType: string): [number, number, number] {
  switch (bodyType) {
    case "slim":
      return [0.85, 1.03, 0.85];
    case "athletic":
      return [1.08, 1.05, 1.05];
    case "heavy":
      return [1.25, 0.98, 1.15];
    default:
      return [1, 1, 1];
  }
}

export function CharacterModel({ character, spin = true }: CharacterModelProps) {
  const group = useRef<Group>(null);
  const [sx, sy, sz] = bodyScale(character.bodyType);
  const hairColor = HAIR_COLORS[character.hairColor] ?? HAIR_COLORS.black;
  const clothingColor = CLOTHING_COLORS[character.clothing] ?? CLOTHING_COLORS.casual;
  const hipWidth = character.gender === "female" ? 0.98 : 1.05;

  useFrame((_, delta) => {
    if (spin && group.current) group.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={group} position={[0, -0.95, 0]} scale={[sx, sy, sz]}>
      {/* Legs */}
      <mesh position={[-0.16, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.14, 0.62, 4, 12]} />
        <meshStandardMaterial color="#242730" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.14, 0.62, 4, 12]} />
        <meshStandardMaterial color="#242730" roughness={0.7} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.16, 0.08, 0.06]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.32]} />
        <meshStandardMaterial color="#111214" roughness={0.6} />
      </mesh>
      <mesh position={[0.16, 0.08, 0.06]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.32]} />
        <meshStandardMaterial color="#111214" roughness={0.6} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.78, 0]} scale={[hipWidth, 1, 1]} castShadow>
        <capsuleGeometry args={[0.22, 0.12, 4, 12]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.5, 4, 12]} />
        <meshStandardMaterial color={clothingColor} roughness={0.55} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.42, 1.15, 0]} rotation={[0, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.1, 0.55, 4, 10]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.42, 1.15, 0]} rotation={[0, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.1, 0.55, 4, 10]} />
        <meshStandardMaterial color={clothingColor} roughness={0.6} />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.48, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={SKIN_TONE} roughness={0.6} />
      </mesh>
      <mesh position={[0.48, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={SKIN_TONE} roughness={0.6} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.1, 12]} />
        <meshStandardMaterial color={SKIN_TONE} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.64, 0]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color={SKIN_TONE} roughness={0.55} />
      </mesh>

      {/* Beard */}
      {character.beard !== "none" && (
        <mesh position={[0, 1.57, 0.1]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
      )}

      {/* Hair */}
      {character.hairstyle !== "bald" && (
        <mesh position={[0, 1.73, character.hairstyle === "long" ? -0.02 : 0]} castShadow>
          <sphereGeometry
            args={[
              character.hairstyle === "long" ? 0.21 : character.hairstyle === "buzz" ? 0.185 : 0.2,
              16,
              16,
              0,
              Math.PI * 2,
              0,
              character.hairstyle === "long" ? Math.PI * 0.75 : Math.PI * 0.55,
            ]}
          />
          <meshStandardMaterial color={hairColor} roughness={0.85} />
        </mesh>
      )}
    </group>
  );
}
