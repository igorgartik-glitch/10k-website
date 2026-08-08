"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Tracks scroll progress (0 -> 1) across the entire document height into a ref, so the
 * persistent 3D scene can read it inside useFrame without React re-rendering on every
 * scroll tick. Disabled under prefers-reduced-motion — the camera then just sits still.
 */
export function useScrollProgress(enabled: boolean) {
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (!enabled) return;

    ensureGsap();
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current.value = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [enabled]);

  return progressRef;
}

/** Remaps a global 0..1 progress into a local 0..1 progress within [start, end], clamped. */
export function localProgress(global: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (global - start) / (end - start)));
}
