import type { Scene, TextPosition } from "@/components/CameraJourney/scenes.config";

const positionClasses: Record<TextPosition, string> = {
  left: "items-start text-left left-6 md:left-14",
  right: "items-end text-right right-6 md:right-14",
  "center-top": "items-center text-center inset-x-0",
};

export function SceneOverlay({ scene }: { scene: Scene }) {
  return (
    <div
      className={`absolute bottom-16 md:bottom-24 z-10 flex flex-col ${positionClasses[scene.textPosition]} max-w-md px-6 md:px-0`}
    >
      <span className="text-xs tracking-[0.3em] uppercase text-cream/60 mb-3">
        {scene.eyebrow}
      </span>
      <h2 className="font-display text-cream text-3xl md:text-5xl leading-tight mb-3">
        {scene.title}
      </h2>
      <p className="text-cream/70 text-sm md:text-base">{scene.body}</p>
    </div>
  );
}
