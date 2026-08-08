"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { ParticleField } from "./ParticleField";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CapabilitiesScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Skip the scroll-scrub entirely — land straight on the assembled shape.
      progressRef.current.value = 1;
      return;
    }

    const gsap = ensureGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current.value = self.progress;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className={`relative w-full bg-ink-soft ${reducedMotion ? "" : "h-[160vh]"}`}
    >
      <div className={`${reducedMotion ? "h-[100dvh]" : "sticky top-0 h-[100dvh]"} w-full overflow-hidden`}>
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.8]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[4, 4, 4]} intensity={1} color="#ff3b30" />
            <ParticleField progressRef={progressRef} spin={!reducedMotion} />
          </Canvas>
        </div>
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-14 pointer-events-none">
          <div className="max-w-lg pointer-events-auto">
            <span className="text-xs tracking-[0.3em] uppercase text-accent mb-4 block">
              02 — Как это работает
            </span>
            <h2 className="font-display uppercase text-paper text-4xl md:text-6xl leading-tight mb-4">
              Рассеивается и собирается заново
            </h2>
            <p className="text-paper/70 text-sm md:text-base max-w-md">
              Каждый узел кластера — точка в облаке. Скролл управляет тем, как плотно
              они держат форму: от хаоса простоя до идеальной решётки под нагрузкой.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
