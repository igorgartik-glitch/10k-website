"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";
import { HeroObject } from "./HeroObject";
import { ParticleField } from "./ParticleField";
import { FeatureShapes } from "./FeatureShapes";
import { SpecMonolith } from "./SpecMonolith";
import { STATIONS } from "./stations";

/**
 * The single persistent 3D scene behind the entire page. Fixed full-viewport, sits below
 * all DOM content (z-0). The camera flies forward through every station as the page
 * scrolls — this is what makes the whole site 3D, not just isolated per-section canvases.
 */
export function Experience({
  progressRef,
  animate = true,
}: {
  progressRef: RefObject<{ value: number }>;
  animate?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, STATIONS.cameraStart], fov: 50 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={1.4} color="#ff3b30" />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#7a7a7a" />
        <directionalLight position={[0, 3, -4]} intensity={0.8} color="#f2f0eb" />
        <pointLight position={[0, 0, STATIONS.specs.z + 3]} intensity={1.2} color="#ff3b30" />

        <HeroObject spin={animate} />
        <ParticleField progressRef={progressRef} spin={animate} />
        <FeatureShapes progressRef={progressRef} spin={animate} />
        <SpecMonolith progressRef={progressRef} spin={animate} />

        <CameraRig
          progressRef={progressRef}
          flightRange={[STATIONS.cameraStart, STATIONS.cameraEnd]}
          fly={animate}
        />
      </Canvas>
    </div>
  );
}
