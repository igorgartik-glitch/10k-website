"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero "core" object: a distorted icosahedron that idles with a slow autorotate
 * and tilts toward the pointer for a subtle parallax feel. Distortion + emissive glow
 * read as "alive machinery" rather than a static logo.
 */
export function Core({ spin = true }: { spin?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!spin) return;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
    if (groupRef.current) {
      const targetX = state.pointer.y * 0.15;
      const targetY = state.pointer.x * 0.25;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.04);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      <Icosahedron ref={meshRef} args={[1.6, 6]}>
        <MeshDistortMaterial
          color="#2a2a2a"
          emissive="#ff3b30"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.35}
          distort={0.35}
          speed={spin ? 1.4 : 0}
        />
      </Icosahedron>
    </group>
  );
}
