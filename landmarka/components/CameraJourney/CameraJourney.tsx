"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap } from "@/lib/gsap";
import { scenes } from "./scenes.config";
import { PropertyScene } from "@/components/PropertyScene/PropertyScene";
import { SceneProgress } from "@/components/SceneProgress/SceneProgress";

/**
 * Pins the whole journey for the duration of its combined scroll weight, then scrubs
 * a master timeline that crossfades between stacked scene panels and drifts each
 * panel's background slightly to read as a continuous camera move. Every scene panel
 * is absolutely positioned and stacked on top of each other (see PropertyScene) — the
 * timeline is what makes them read as one flight instead of a slideshow.
 */
export function CameraJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const gsap = ensureGsap();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".camera-scene");
      const weights = scenes.map((scene) => scene.scroll ?? 1);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);

      gsap.set(panels, { opacity: 0 });
      gsap.set(panels[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWeight * window.innerHeight}`,
          scrub: 0.6,
          pin: true,
          onUpdate: (self) => {
            const idx = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
            setActiveIndex(idx);
          },
        },
      });

      let cursor = 0;
      panels.forEach((panel, i) => {
        const weight = weights[i];

        if (i > 0) {
          tl.to(panels[i - 1], { opacity: 0, duration: weight * 0.3 }, cursor);
          tl.fromTo(
            panel,
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: weight * 0.35 },
            cursor,
          );
        }

        const placeholder = panel.querySelector(".scene-placeholder");
        if (placeholder) {
          tl.fromTo(
            placeholder,
            { scale: 1 },
            { scale: 1.12, duration: weight, ease: "none" },
            cursor,
          );
        }

        cursor += weight;
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-ink"
    >
      {scenes.map((scene) => (
        <PropertyScene key={scene.id} scene={scene} className="camera-scene absolute inset-0" />
      ))}
      <SceneProgress scenes={scenes} activeIndex={activeIndex} />
    </section>
  );
}
