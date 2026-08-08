"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`. Starts `false` (SSR-safe default) and syncs to the
 * real value on mount, so the camera-journey scrub only ever runs on the client where
 * we know the user's preference.
 */
function getInitialReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(getInitialReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
