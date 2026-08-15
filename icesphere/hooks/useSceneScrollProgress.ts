"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { useScrollStore } from "@/lib/store";

/**
 * Превращает положение прокрутки внутри секции сцены в число 0..1 и кладёт
 * в zustand-стор. Больше сцена ни от чего не зависит — камера, переход,
 * анимации кирпичей читают только это число (через computeCameraPose /
 * transitionIntensity из lib/scroll.ts).
 */
export function useSceneScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const setProgress = useScrollStore((s) => s.setProgress);

  useEffect(() => {
    let rafId = 0;

    function update() {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollableHeight = el.offsetHeight - window.innerHeight;
        const scrolledIntoSection = -rect.top;
        const progress = scrollableHeight > 0 ? scrolledIntoSection / scrollableHeight : 0;
        setProgress(Math.min(1, Math.max(0, progress)));
      }
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [sectionRef, setProgress]);
}
