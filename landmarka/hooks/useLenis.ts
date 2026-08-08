"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { bridgeLenisToScrollTrigger } from "@/lib/scroll-bridge";

/**
 * Mounts Lenis smooth scroll and bridges it to ScrollTrigger while `enabled` is true.
 * Pass false (e.g. during the preloader, or under prefers-reduced-motion) to leave
 * native scrolling untouched.
 */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const gsap = ensureGsap();
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    bridgeLenisToScrollTrigger(lenis);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [enabled]);
}
