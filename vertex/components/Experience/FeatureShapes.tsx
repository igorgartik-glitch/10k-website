"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STATIONS } from "./stations";
import { localProgress } from "@/hooks/useScrollProgress";

const SHAPES: { geometry: "box" | "octahedron" | "torus" | "cone"; angle: number; radius: number; zOffset: number }[] = [
  { geometry: "box", angle: 0, radius: 2.6, zOffset: 1.5 },
  { geometry: "octahedron", angle: Math.PI / 2, radius: 2.6, zOffset: -1.5 },
  { geometry: "torus", angle: Math.PI, radius: 2.6, zOffset: 1.5 },
  { geometry: "cone", angle: (3 * Math.PI) / 2, radius: 2.6, zOffset: -1.5 },
];

function ShapeMesh({ shape, spin }: { shape: (typeof SHAPES)[number]; spin: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const x = Math.cos(shape.angle) * shape.radius;
  const y = Math.sin(shape.angle) * shape.radius * 0.6;

  useFrame((_, delta) => {
    if (!spin || !ref.current) return;
    ref.current.rotation.x += delta * 0.25;
    ref.current.rotation.y += delta * 0.35;
  });

  return (
    <mesh ref={ref} position={[x, y, STATIONS.features.z + shape.zOffset]}>
      {shape.geometry === "box" && <boxGeometry args={[1.1, 1.1, 1.1]} />}
      {shape.geometry === "octahedron" && <octahedronGeometry args={[0.9, 0]} />}
      {shape.geometry === "torus" && <torusGeometry args={[0.7, 0.28, 16, 48]} />}
      {shape.geometry === "cone" && <coneGeometry args={[0.8, 1.4, 32]} />}
      <meshStandardMaterial color="#1c1c1c" emissive="#ff3b30" emissiveIntensity={0.35} roughness={0.35} metalness={0.5} />
    </mesh>
  );
}

/** Four module shapes flanking the flight path — the camera flies through the middle of them. */
export function FeatureShapes({
  progressRef,
  spin = true,
}: {
  progressRef: RefObject<{ value: number }>;
  spin?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shapes = useMemo(() => SHAPES, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const [start, end] = STATIONS.features.band;
    const t = localProgress(progressRef.current.value, start, end);
    const scale = THREE.MathUtils.lerp(0.4, 1, t);
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <ShapeMesh key={i} shape={shape} spin={spin} />
      ))}
    </group>
  );
}
