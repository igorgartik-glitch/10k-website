"use client";

import { useEffect, useRef } from "react";
import { config } from "@/lib/config";

/**
 * Разрез следа на снегу: яркость пикселя холста следов (0 = нетронуто, 1 =
 * центр следа) напрямую становится глубиной просадки через
 * displacementScale материала земли — тот же коэффициент, что в сцене.
 * Никакого отдельного пересчёта здесь нет, только его визуализация.
 */
export function TrailDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height, sampleCount } = config.landing.trailDiagram;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const barTop = 0;
    const barHeight = 28;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "white");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, barTop, width, barHeight);

    const plotTop = barHeight + 16;
    const plotHeight = height - plotTop - 8;

    ctx.strokeStyle = "rgba(22,32,42,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, plotTop);
    ctx.lineTo(width, plotTop);
    ctx.stroke();

    ctx.strokeStyle = "#2f6f9e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= sampleCount; i++) {
      const brightness = i / sampleCount;
      const depth = brightness * config.snowTrail.displacementScale;
      const px = brightness * width;
      const py = plotTop + (depth / config.snowTrail.displacementScale) * plotHeight;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, [width, height, sampleCount]);

  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-3)]">03 · Следы</span>
        <h2 className="mt-4 text-3xl font-semibold">Яркость — это глубина</h2>
        <p className="mt-4 text-[var(--color-ink-2)] leading-relaxed">
          Обычный 2D-холст: под курсором рисуется мягкое пятно, а всё полотно
          каждый кадр заливается почти прозрачной чёрной краской — след
          затухает сам, без таймеров и списков точек. Картинка идёт в
          материал земли как displacementMap: чёрный пиксель — снег не
          тронут, белый — центр следа проседает на {config.snowTrail.displacementScale} м.
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2"
      />
    </div>
  );
}
