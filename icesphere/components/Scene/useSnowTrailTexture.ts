"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, Raycaster, RepeatWrapping } from "three";
import { config } from "@/lib/config";
import { raymarchTerrain } from "@/lib/raymarch";
import { worldToTrailUv } from "@/lib/terrain";

/**
 * Холст следов на снегу: под курсором рисуется пятно, каждый кадр всё
 * полотно заливается почти прозрачной чёрной краской — так след затягивается
 * сам собой, без таймеров и списка точек. Чёрный = нулевое смещение (снег не
 * тронут), белое пятно = footprint. Карта отдаётся материалу земли как
 * displacementMap (см. Ground.tsx — знак смещения там отрицательный: след
 * должен проседать в снег, а не выпирать).
 */
export function useSnowTrailTexture() {
  const size = config.snowTrail.canvasSize;

  const { ctx, texture } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);

    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return { canvas, ctx, texture };
  }, [size]);

  const raycaster = useRef(new Raycaster());
  const frameCount = useRef(0);

  const { camera, pointer } = useThree();

  /* eslint-disable react-hooks/immutability -- холст и текстура — это
     императивные Canvas2D/WebGL-объекты, а не React-состояние: мутировать
     ctx и дёргать texture.needsUpdate каждый кадр — единственный способ
     их использовать, альтернативы «неизменяемо» здесь не существует. */
  useFrame(() => {
    // Затухание следа: заливка почти прозрачной чёрной краской каждый кадр.
    ctx.globalAlpha = config.snowTrail.fadeAlpha;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 1;

    raycaster.current.setFromCamera(pointer, camera);
    const hit = raymarchTerrain(raycaster.current.ray.origin, raycaster.current.ray.direction);

    if (hit) {
      const { u, v } = worldToTrailUv(hit.x, hit.z, config.terrain.size);
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
        const px = u * size;
        // Canvas Y растёт вниз, UV.v — вверх (стандартная конвенция WebGL-текстур).
        const py = (1 - v) * size;
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, config.snowTrail.brushRadiusPx);
        gradient.addColorStop(0, "rgba(255,255,255,0.9)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, config.snowTrail.brushRadiusPx, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    frameCount.current++;
    if (frameCount.current % config.snowTrail.uploadEveryNFrames === 0) {
      texture.needsUpdate = true;
    }
  });
  /* eslint-enable react-hooks/immutability */

  return texture;
}
