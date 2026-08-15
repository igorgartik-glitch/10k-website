"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";
import { useScrollStore } from "@/lib/store";
import { computeCameraPose } from "@/lib/scroll";
import { config } from "@/lib/config";

/**
 * Ведёт камеру по кривой Катмулла-Рома (lib/scroll.ts::computeCameraPose) в
 * прогресс прокрутки из zustand-стора. Прогресс читается через getState()
 * внутри useFrame, а не через хук-подписку — иначе каждый тик прокрутки
 * перерендеривал бы React-дерево вместо того, чтобы просто подвинуть камеру.
 */
export function CameraRig() {
  const smoothedPosition = useRef(new Vector3(...config.scroll.cameraPoints[0]));
  const smoothedTarget = useRef(new Vector3(...config.scroll.targetPoints[0]));

  useFrame(({ camera }, delta) => {
    const progress = useScrollStore.getState().progress;
    const { position, target } = computeCameraPose(progress);
    const lambda = config.scroll.cameraDamping;

    smoothedPosition.current.x = MathUtils.damp(smoothedPosition.current.x, position.x, lambda, delta);
    smoothedPosition.current.y = MathUtils.damp(smoothedPosition.current.y, position.y, lambda, delta);
    smoothedPosition.current.z = MathUtils.damp(smoothedPosition.current.z, position.z, lambda, delta);

    smoothedTarget.current.x = MathUtils.damp(smoothedTarget.current.x, target.x, lambda, delta);
    smoothedTarget.current.y = MathUtils.damp(smoothedTarget.current.y, target.y, lambda, delta);
    smoothedTarget.current.z = MathUtils.damp(smoothedTarget.current.z, target.z, lambda, delta);

    camera.position.copy(smoothedPosition.current);
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
