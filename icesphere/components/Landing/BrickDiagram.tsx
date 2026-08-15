"use client";

import { useEffect, useRef, useState } from "react";
import { computeBrickLayout } from "@/lib/brickLayout";
import { config } from "@/lib/config";

/**
 * Схема кладки: та же computeBrickLayout, что и сцена. Ползунок меняет
 * rings и вызывает ровно ту же функцию раскладки — иллюстрация не может
 * разойтись с тем, что она иллюстрирует.
 */
export function BrickDiagram() {
  const [rings, setRings] = useState<number>(config.brick.rings);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvasSize, minRings, maxRings, projectionRadius } = config.landing.brickDiagram;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;

    const bricks = computeBrickLayout(rings, projectionRadius, config.brick.heightFill, config.brick.widthFill);

    // Только ближняя полусфера (z >= 0) — вид спереди без наложения дальних
    // кирпичей на ближние, иначе плоская проекция читается как каша.
    const visible = bricks.filter((b) => b.position[2] >= 0).sort((a, b) => a.position[2] - b.position[2]);

    for (const brick of visible) {
      const [x, y, z] = brick.position;
      const shade = 0.35 + 0.65 * (z / projectionRadius);
      ctx.fillStyle = `rgba(47, 111, 158, ${shade.toFixed(3)})`;
      const w = Math.max(2, brick.width * 0.82);
      const h = Math.max(2, brick.height * 0.82);
      ctx.beginPath();
      const rx = cx + x;
      const ry = cy - y;
      const r = Math.min(w, h) * 0.25;
      ctx.roundRect(rx - w / 2, ry - h / 2, w, h, r);
      ctx.fill();
    }
  }, [rings, canvasSize, projectionRadius]);

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <canvas
        ref={canvasRef}
        width={config.landing.brickDiagram.canvasSize}
        height={config.landing.brickDiagram.canvasSize}
        className="w-full max-w-sm mx-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]"
      />
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-3)]">01 · Кладка</span>
        <h2 className="mt-4 text-3xl font-semibold">Постоянная ширина кирпича</h2>
        <p className="mt-4 text-[var(--color-ink-2)] leading-relaxed">
          Кирпичей в кольце: <code className="text-[var(--color-ink-1)]">round(2 · rings · sin θ)</code>.
          Окружность кольца сжимается к полюсу пропорционально sin θ — и число кирпичей
          сжимается в той же пропорции, поэтому плечо кирпича остаётся почти постоянным
          от полюса до экватора.
        </p>
        <label className="mt-8 block">
          <span className="text-sm text-[var(--color-ink-2)]">
            rings: <span className="text-[var(--color-ink-1)] font-medium">{rings}</span>
          </span>
          <input
            type="range"
            min={minRings}
            max={maxRings}
            value={rings}
            onChange={(e) => setRings(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-accent)]"
          />
        </label>
      </div>
    </div>
  );
}
