"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { ensureGsap } from "@/lib/gsap";

export function HeroScene() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const gsap = ensureGsap();
    const split = new SplitType(headingRef.current, { types: "lines,words" });

    gsap.set(split.words, { yPercent: 120, opacity: 0 });
    gsap.to(split.words, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.04,
      delay: 0.3,
      ease: "power4.out",
    });

    return () => split.revert();
  }, []);

  return (
    <section id="top" className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      <div
        className="scene-placeholder absolute inset-0"
        data-label="Аэросъёмка — рендер не сгенерирован"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/60" />
      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-14 pb-20 md:pb-24">
        <span className="text-xs tracking-[0.35em] uppercase text-cream/60 mb-5">
          Приватная резиденция · Рижское взморье
        </span>
        <h1
          ref={headingRef}
          className="font-display text-cream text-[13vw] md:text-[7vw] leading-[0.95] max-w-4xl"
        >
          Дом, снятый одним непрерывным кадром
        </h1>
        <p className="mt-6 max-w-md text-cream/70 text-sm md:text-base">
          Прокрутите — камера пролетит сквозь фасад, комнаты и сад, не разрывая кадр ни разу.
        </p>
      </div>
      <div className="absolute bottom-8 right-6 md:right-10 z-10 text-cream/50 text-[11px] tracking-[0.25em] uppercase">
        Скролл ↓
      </div>
    </section>
  );
}
