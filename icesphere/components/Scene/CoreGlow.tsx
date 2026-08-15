"use client";

import { config } from "@/lib/config";
import { sphereCenterY } from "@/lib/sceneLayout";

/**
 * Самосветящийся шарик внутри кирпичной сферы. Ничего не освещает (не
 * point light) — виден только через щели между кирпичами и в ореоле
 * постобработки (bloom). Главный безопасный рычаг яркости: в отличие от
 * point light, его интенсивность не высветляет снег.
 */
export function CoreGlow() {
  return (
    <mesh position={[0, sphereCenterY, 0]}>
      <sphereGeometry args={[config.core.radius, 24, 24]} />
      <meshStandardMaterial
        color={config.core.color}
        emissive={config.core.color}
        emissiveIntensity={config.core.emissiveIntensity}
        toneMapped={false}
      />
    </mesh>
  );
}
