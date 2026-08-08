"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Flies the camera forward along -Z as global scroll progress goes 0 -> 1, passing each
 * station in turn (they sit at fixed world positions — see stations.ts). Adds a small
 * pointer-parallax tilt on top, same idle-camera feel as the old per-section scenes.
 */
export function CameraRig({
  progressRef,
  flightRange,
  fly = true,
}: {
  progressRef: RefObject<{ value: number }>;
  flightRange: [number, number];
  fly?: boolean;
}) {
  const { camera } = useThree();
  const smoothed = useRef(0);

  /* eslint-disable react-hooks/immutability -- R3F's canonical pattern: mutate the
     three.js camera object in place every frame instead of triggering a React
     re-render per frame. The immutability rule doesn't know about this contract. */
  useFrame((state, delta) => {
    if (fly) {
      const [start, end] = flightRange;
      const targetZ = THREE.MathUtils.lerp(start, end, progressRef.current.value);
      smoothed.current = THREE.MathUtils.damp(smoothed.current, targetZ, 4, delta);
      camera.position.z = smoothed.current;
    }

    const tiltX = state.pointer.y * 0.08;
    const tiltY = state.pointer.x * 0.12;
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, tiltX, 0.05);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, tiltY, 0.05);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}
