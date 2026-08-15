"use client";

import { useEffect, useRef } from "react";
import { computeCameraPose } from "@/lib/scroll";
import { config } from "@/lib/config";

/**
 * Траектория камеры сверху (x,z) — та же computeCameraPose, что ведёт
 * камеру в сцене, просто просэмплированная во много точек вместо одной.
 */
export function CameraPathDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { size, sampleCount } = config.landing.cameraPathDiagram;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const scale = 16;

    // Сфера как ориентир масштаба.
    ctx.strokeStyle = "rgba(22,32,42,0.15)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, config.brick.sphereRadius * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#2f6f9e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      const { position } = computeCameraPose(t);
      const px = cx + position.x * scale;
      const py = cy + position.z * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const start = computeCameraPose(0).position;
    const end = computeCameraPose(1).position;
    ctx.fillStyle = "#2f6f9e";
    ctx.beginPath();
    ctx.arc(cx + start.x * scale, cy + start.z * scale, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#16202a";
    ctx.beginPath();
    ctx.arc(cx + end.x * scale, cy + end.z * scale, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [size, sampleCount]);

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div className="order-2 md:order-1">
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-3)]">04 · Камера</span>
        <h2 className="mt-4 text-3xl font-semibold">Одна кривая на всё</h2>
        <p className="mt-4 text-[var(--color-ink-2)] leading-relaxed">
          Прогресс прокрутки ведёт камеру и цель взгляда по кривым
          Катмулла-Рома через четыре опорные точки каждая — вид сверху,
          светлая точка — начало, тёмная — конец. Больше сцена ни от чего
          не зависит: ни таймеров, ни отдельного стейта для «текущей сцены».
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="order-1 md:order-2 w-full max-w-sm mx-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]"
      />
    </div>
  );
}
