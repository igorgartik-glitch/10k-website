/**
 * Placeholder stand-in for the real image-sequence canvas scrubber described in the
 * LandMarka plan. There are no rendered camera-flight frames or real photography for
 * this property yet (that requires either a photo shoot or a paid generation pipeline —
 * see the scroll-world skill), so this renders a labeled placeholder panel instead —
 * same pattern as .media-slot in the other projects in this repo.
 *
 * Swap-in path: once frames exist, replace the div below with a <canvas> that scrubs
 * `public/frames/<scene>/NNNN.jpg` by scroll progress. CameraJourney and PropertyScene
 * don't need to change — they only care that this element has class "scene-placeholder"
 * to participate in the crossfade/scale timeline.
 */
export function SceneFrameSequence({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="scene-placeholder absolute inset-0"
      data-label={label}
      style={{ ["--scene-accent" as string]: accent }}
    />
  );
}
