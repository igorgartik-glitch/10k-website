"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STATIONS } from "./stations";
import { localProgress } from "@/hooks/useScrollProgress";

const ORBITERS = 5;

/** A glowing monolith that grows into view as the camera arrives, ringed by orbiting sparks. */
export function SpecMonolith({
  progressRef,
  spin = true,
}: {
  progressRef: RefObject<{ value: number }>;
  spin?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Mesh>(null);
  const orbiterRefs = useRef<(THREE.Mesh | null)[]>([]);
  const orbiters = useMemo(() => Array.from({ length: ORBITERS }, (_, i) => i), []);

  useFrame((state) => {
    const [start, end] = STATIONS.specs.band;
    const t = localProgress(progressRef.current.value, start, end);

    if (barRef.current) {
      const height = THREE.MathUtils.lerp(0.4, 5, t);
      barRef.current.scale.y = height;
    }

    if (spin) {
      orbiterRefs.current.forEach((mesh, i) => {
        if (!mesh) return;
        const angle = state.clock.elapsedTime * 0.4 + (i / ORBITERS) * Math.PI * 2;
        const radius = 1.8;
        mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 0.8, Math.sin(angle) * radius);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, STATIONS.specs.z]}>
      <mesh ref={barRef}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#141414" emissive="#ff3b30" emissiveIntensity={0.6} roughness={0.2} metalness={0.6} />
      </mesh>
      {orbiters.map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            orbiterRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}
