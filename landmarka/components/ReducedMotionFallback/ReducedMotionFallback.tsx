import { scenes } from "@/components/CameraJourney/scenes.config";
import { SceneFrameSequence } from "@/components/CameraJourney/SceneFrameSequence";
import { SceneOverlay } from "@/components/SceneOverlay/SceneOverlay";
import { PropertyStats } from "@/components/PropertyStats/PropertyStats";

/**
 * Renders the same scene data as CameraJourney but as an ordinary vertical stack —
 * no pinning, no scroll-scrubbed motion. Used whenever prefers-reduced-motion is set.
 */
export function ReducedMotionFallback() {
  return (
    <section id="journey" className="flex flex-col">
      {scenes
        .filter((scene) => !scene.isTransition)
        .map((scene) => (
          <div key={scene.id} className="relative min-h-[80vh] w-full">
            <SceneFrameSequence
              label={`Сцена ${String(scene.index).padStart(2, "0")} — рендер не сгенерирован`}
              accent={scene.accent}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/40" />
            <SceneOverlay scene={scene} />
            {scene.stats && <PropertyStats stats={scene.stats} position={scene.textPosition} />}
          </div>
        ))}
    </section>
  );
}
