"use client";

import { Canvas } from "@react-three/fiber";
import { Core } from "./Core";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroScene() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="top" className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {/* z-0: diagonal accent wash, sits behind everything */}
      <div
        className="absolute inset-0 z-0 opacity-25 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, transparent 58%, var(--color-accent) 58%, var(--color-accent) 64%, transparent 64%)",
        }}
      />

      {/* z-10: giant ghost wordmark, behind the 3D object */}
      <div className="ghost-wordmark z-10" aria-hidden="true">
        VERTEX
      </div>

      {/* z-20: the 3D canvas — transparent background, so the layers below show through */}
      <div className="absolute inset-0 z-20">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.8]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 2]} intensity={1.4} color="#ff3b30" />
          <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#7a7a7a" />
          <directionalLight position={[0, 3, -4]} intensity={0.8} color="#f2f0eb" />
          <Core spin={!reducedMotion} />
        </Canvas>
      </div>

      {/* z-30: text content and CTA */}
      <div className="relative z-30 flex h-full flex-col justify-end px-6 md:px-14 pb-20 md:pb-24 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <span className="text-xs tracking-[0.35em] uppercase text-paper/60 mb-5 block">
            AI-инфраструктура нового поколения
          </span>
          <h1 className="font-display uppercase text-paper text-[15vw] md:text-[6.5vw] leading-[0.92] tracking-tight">
            Ядро для инференса
          </h1>
          <p className="mt-6 max-w-md text-paper/70 text-sm md:text-base">
            Один кластер, ноль простоя. VERTEX держит модель горячей и масштабируется
            быстрее, чем растёт очередь запросов.
          </p>
          <a
            href="#capabilities"
            className="mt-8 inline-flex items-center gap-3 bg-accent text-ink font-medium px-7 py-3 uppercase text-xs tracking-[0.2em] hover:brightness-110 transition"
          >
            Смотреть возможности
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 md:right-10 z-30 text-paper/50 text-[11px] tracking-[0.25em] uppercase">
        Скролл ↓
      </div>
    </section>
  );
}
