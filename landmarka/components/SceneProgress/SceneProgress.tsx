import type { Scene } from "@/components/CameraJourney/scenes.config";

export function SceneProgress({
  scenes,
  activeIndex,
}: {
  scenes: Scene[];
  activeIndex: number;
}) {
  return (
    <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-end gap-3">
      {scenes.map((scene, i) => (
        <div key={scene.id} className="flex items-center gap-2">
          <span
            className={`text-[10px] tracking-[0.2em] tabular-nums transition-colors duration-300 ${
              i === activeIndex ? "text-cream" : "text-cream/30"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={`h-px transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-accent" : "w-3 bg-cream/25"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
