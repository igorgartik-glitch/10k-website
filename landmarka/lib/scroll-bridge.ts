"use client";

import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Wires Lenis's inertial scroll position into GSAP ScrollTrigger's scroller proxy,
 * so ScrollTrigger reads/writes scroll through Lenis instead of the native scrollTop.
 */
export function bridgeLenisToScrollTrigger(lenis: Lenis) {
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value as number, { immediate: true });
        return;
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  lenis.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", () => lenis.resize());
  ScrollTrigger.refresh();
}
