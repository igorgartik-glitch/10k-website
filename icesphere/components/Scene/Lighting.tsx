"use client";

import { useMemo } from "react";
import { config } from "@/lib/config";
import { sphereCenterY } from "@/lib/sceneLayout";

const DEG = Math.PI / 180;

/**
 * Свет и земля принципиально не разводятся по слоям (scene layers): слой
 * источника света в three.js сверяется со слоями КАМЕРЫ, а не объектов —
 * источник, помещённый на слой, невидимый камере, гаснет целиком, а не
 * просто перестаёт светить один объект. Пересвет снега точечным светом
 * лечится понижением отражаемости земли (см. config.terrain.roughness),
 * а не слоями.
 */
export function Lighting() {
  const sunPosition = useMemo<[number, number, number]>(() => {
    const elevation = config.lighting.sunElevationDeg * DEG;
    const azimuth = config.lighting.sunAzimuthDeg * DEG;
    const distance = 60;
    return [
      Math.cos(elevation) * Math.cos(azimuth) * distance,
      Math.sin(elevation) * distance,
      Math.cos(elevation) * Math.sin(azimuth) * distance,
    ];
  }, []);

  return (
    <>
      <ambientLight color={config.lighting.ambientColor} intensity={config.lighting.ambientIntensity} />

      {/* Внутри сферы. Свет выходит через щели между кирпичами — поэтому
          нижние грани кирпичей ярче верхних, и глаз сразу читает, что
          внутри сферы что-то светится. Дальность обязательно ограничена
          (distance/decay) — без этого свет достаёт до снега и выбивает
          под сферой белое пятно. */}
      <pointLight
        position={[0, sphereCenterY, 0]}
        color={config.lighting.pointColor}
        intensity={config.lighting.pointIntensity}
        distance={config.lighting.pointDistance}
        decay={config.lighting.pointDecay}
      />

      {/* Низкое солнце: скользящий свет цепляется за неровности рельефа,
          холмы читаются сами, без добавления геометрии. */}
      <directionalLight
        position={sunPosition}
        color={config.lighting.sunColor}
        intensity={config.lighting.sunIntensity}
      />
    </>
  );
}
