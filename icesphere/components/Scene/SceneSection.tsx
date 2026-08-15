"use client";

import { useRef } from "react";
import { SceneCanvas } from "./SceneCanvas";
import { useSceneScrollProgress } from "@/hooks/useSceneScrollProgress";
import { config } from "@/lib/config";

/**
 * Блок со сценой высотой в четыре экрана; холст внутри прилипает к верху
 * (position: sticky), пока секция прокручивается вокруг него. Прогресс
 * прокрутки — единственное, что уходит из этого компонента в сцену.
 */
export function SceneSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useSceneScrollProgress(sectionRef);

  return (
    <section ref={sectionRef} style={{ height: `${config.scroll.sectionHeightVh}vh` }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <SceneCanvas />
      </div>
    </section>
  );
}
