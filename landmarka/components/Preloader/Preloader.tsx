"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap } from "@/lib/gsap";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete,
        });
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => setProgress(Math.round(counter.value)),
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-ink text-cream"
    >
      <span className="text-xs tracking-[0.3em] uppercase text-cream/50 mb-4">LandMarka</span>
      <span className="font-display text-6xl md:text-8xl tabular-nums">{progress}</span>
    </div>
  );
}
