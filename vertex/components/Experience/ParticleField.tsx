"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STATIONS } from "./stations";
import { localProgress } from "@/hooks/useScrollProgress";

const COUNT = 2000;

function randomInSphere(radius: number) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  );
}

function torusKnotPoint(t: number) {
  const p = 2;
  const q = 3;
  const scale = 1.6;
  const radius = 0.9;
  const angle = t * Math.PI * 2;
  const r = Math.cos(q * angle) + 2;
  return new THREE.Vector3(
    scale * r * Math.cos(p * angle) * radius,
    scale * r * Math.sin(p * angle) * radius,
    scale * Math.sin(q * angle) * radius,
  );
}

/**
 * A point cloud that idles as a random scatter and assembles into a torus-knot lattice
 * as the camera passes through this station. Reads global scroll progress from a ref
 * (no React re-renders) and remaps it to this station's own local 0..1 band.
 */
export function ParticleField({
  progressRef,
  spin = true,
}: {
  progressRef: RefObject<{ value: number }>;
  spin?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { scattered, assembled } = useMemo(() => {
    const scatteredPositions = new Float32Array(COUNT * 3);
    const assembledPositions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const s = randomInSphere(3.2);
      scatteredPositions[i * 3] = s.x;
      scatteredPositions[i * 3 + 1] = s.y;
      scatteredPositions[i * 3 + 2] = s.z;

      const a = torusKnotPoint(i / COUNT);
      assembledPositions[i * 3] = a.x;
      assembledPositions[i * 3 + 1] = a.y;
      assembledPositions[i * 3 + 2] = a.z;
    }

    return { scattered: scatteredPositions, assembled: assembledPositions };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const [start, end] = STATIONS.particles.band;
    const t = localProgress(progressRef.current.value, start, end);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const targetX = THREE.MathUtils.lerp(scattered[ix], assembled[ix], t);
      const targetY = THREE.MathUtils.lerp(scattered[ix + 1], assembled[ix + 1], t);
      const targetZ = THREE.MathUtils.lerp(scattered[ix + 2], assembled[ix + 2], t);
      array[ix] = THREE.MathUtils.lerp(array[ix], targetX, 0.08);
      array[ix + 1] = THREE.MathUtils.lerp(array[ix + 1], targetY, 0.08);
      array[ix + 2] = THREE.MathUtils.lerp(array[ix + 2], targetZ, 0.08);
    }

    positions.needsUpdate = true;
    if (spin) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, STATIONS.particles.z]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[scattered, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ff3b30" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}
