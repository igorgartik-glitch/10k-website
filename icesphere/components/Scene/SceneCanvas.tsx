"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { config } from "@/lib/config";
import { BrickSphere } from "./BrickSphere";
import { CoreGlow } from "./CoreGlow";
import { Ground } from "./Ground";
import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { TransitionEffectMount } from "./TransitionEffectMount";

/**
 * Холст держит frameloop="always" (умолчание R3F) неизменным весь жизненный
 * цикл — переключение режима отрисовки на ходу заставляет canvas
 * перенастроиться и один кадр отрисовать со старым положением камеры,
 * что на экране читается как рывок в конце перехода.
 */
export function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: config.scroll.cameraPoints[0], fov: 45 }}
      dpr={[config.postprocessing.dprMin, config.postprocessing.dprMax]}
      shadows
    >
      <fog attach="fog" args={[config.fog.color, config.fog.near, config.fog.far]} />
      <color attach="background" args={[config.fog.color]} />

      <Lighting />
      <Ground />
      <BrickSphere />
      <CoreGlow />
      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={config.postprocessing.bloomIntensity}
          luminanceThreshold={config.postprocessing.bloomLuminanceThreshold}
          luminanceSmoothing={config.postprocessing.bloomLuminanceSmoothing}
        />
        <ChromaticAberration
          offset={[config.postprocessing.chromaticAberrationOffset, config.postprocessing.chromaticAberrationOffset]}
          blendFunction={BlendFunction.NORMAL}
        />
        <TransitionEffectMount />
      </EffectComposer>
    </Canvas>
  );
}
