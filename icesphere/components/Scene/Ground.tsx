"use client";

import { useMemo } from "react";
import { PlaneGeometry, RepeatWrapping, type Texture } from "three";
import { useTexture } from "@react-three/drei";
import { config } from "@/lib/config";
import { planeLocalToWorld, terrainHeight } from "@/lib/terrain";
import { useSnowTrailTexture } from "./useSnowTrailTexture";

/**
 * Реальные PBR-карты снега (ambientCG Snow005, CC0), см. scripts/fetch-textures.mjs.
 * Displacement из этого же материала сюда не идёт: слот displacementMap
 * материала уже занят динамической текстурой следов (useSnowTrailTexture) —
 * макро-форма рельефа задаётся напрямую вершинами геометрии через
 * terrainHeight, вторая статичная карта смещения конфликтовала бы с ней.
 */
function useGroundTextures() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/snow/color.webp",
    "/textures/snow/normal.webp",
    "/textures/snow/roughness.webp",
  ]);

  useMemo(() => {
    const repeats = config.terrain.size / config.terrain.textureRepeatMeters;
    for (const tex of [colorMap, normalMap, roughnessMap] as Texture[]) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(repeats, repeats);
      // Без anisotropy земля мылится под скользящим углом обзора камеры
      // независимо от разрешения самой карты — это первое, что проверять,
      // когда "текстуры 4K, а всё равно мыло" (см. спеку).
      tex.anisotropy = config.terrain.anisotropy;
    }
  }, [colorMap, normalMap, roughnessMap]);

  return { colorMap, normalMap, roughnessMap };
}

/**
 * Одна плоскость на всю сцену — не площадка в центре плюс дальняя равнина
 * вокруг. Две плоскости дают ровный шов на стыке, который не спрятать ничем.
 * Форма ландшафта строится один раз здесь через terrainHeight (единственный
 * источник истины, lib/terrain.ts) — не подглядывает в конфиг напрямую для
 * своей собственной формулы.
 */
export function Ground() {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(
      config.terrain.size,
      config.terrain.size,
      config.terrain.segments,
      config.terrain.segments,
    );
    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const localX = position.getX(i);
      const localY = position.getY(i);
      // Локальная ось Z геометрии (до поворота) — это будущая мировая
      // высота Y после rotation.x = -π/2. localX/localY -> мировые x/z идут
      // через planeLocalToWorld, а не напрямую — см. комментарий в terrain.ts.
      const { x, z } = planeLocalToWorld(localX, localY);
      position.setZ(i, terrainHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const trailTexture = useSnowTrailTexture();
  const { colorMap, normalMap, roughnessMap } = useGroundTextures();

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color={config.terrain.color}
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={config.terrain.roughness}
        metalness={config.terrain.metalness}
        displacementMap={trailTexture}
        // Отрицательный знак: след должен проседать В снег, а не выпирать
        // из него — displacementScale в config хранит величину проседания.
        displacementScale={-config.snowTrail.displacementScale}
      />
    </mesh>
  );
}
