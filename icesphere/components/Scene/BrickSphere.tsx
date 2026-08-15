"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { config } from "@/lib/config";
import { computeBrickLayout } from "@/lib/brickLayout";
import { sphereCenterY } from "@/lib/sceneLayout";

/**
 * Сфера из кирпичей. Раскладка — та же чистая функция, что рисует
 * интерактивную схему кладки на лендинге (components/Landing/BrickDiagram),
 * поэтому иллюстрация не может разойтись со сценой.
 */
export function BrickSphere() {
  const bricks = useMemo(
    () =>
      computeBrickLayout(
        config.brick.rings,
        config.brick.sphereRadius,
        config.brick.heightFill,
        config.brick.widthFill,
      ),
    [],
  );

  return (
    <group position={[0, sphereCenterY, 0]}>
      {bricks.map((brick, i) => (
        <RoundedBox
          key={i}
          args={[brick.width, brick.height, config.brick.depth]}
          radius={config.brick.bevelRadius}
          smoothness={config.brick.bevelSegments}
          position={brick.position}
          quaternion={brick.quaternion}
        >
          <meshPhysicalMaterial
            color={config.brick.color}
            roughness={config.brick.roughness}
            metalness={config.brick.metalness}
            sheen={config.brick.sheen}
            sheenColor={config.brick.sheenColor}
            sheenRoughness={config.brick.sheenRoughness}
          />
        </RoundedBox>
      ))}
    </group>
  );
}
