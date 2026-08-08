import type { Scene } from "@/components/CameraJourney/scenes.config";
import { SceneFrameSequence } from "@/components/CameraJourney/SceneFrameSequence";
import { SceneOverlay } from "@/components/SceneOverlay/SceneOverlay";
import { PropertyStats } from "@/components/PropertyStats/PropertyStats";

export function PropertyScene({
  scene,
  className = "",
}: {
  scene: Scene;
  className?: string;
}) {
  return (
    <div className={`${className} bg-ink`}>
      <SceneFrameSequence
        label={
          scene.isTransition
            ? "Переходный кадр — рендер не сгенерирован"
            : `Сцена ${String(scene.index).padStart(2, "0")} — рендер не сгенерирован`
        }
        accent={scene.accent}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/50" />
      {!scene.isTransition && (
        <>
          <SceneOverlay scene={scene} />
          {scene.stats && <PropertyStats stats={scene.stats} position={scene.textPosition} />}
        </>
      )}
    </div>
  );
}
