"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Visual mute toggle only — there's no ambient audio track wired up yet (no asset
 * exists for one). When there is, mount an <audio loop> here and drive it from this
 * same `muted` state instead of adding a second source of truth.
 */
export function SoundControl() {
  const [muted, setMuted] = useState(true);

  return (
    <button
      type="button"
      aria-pressed={!muted}
      aria-label={muted ? "Включить фоновый звук" : "Выключить фоновый звук"}
      onClick={() => setMuted((m) => !m)}
      className="p-2 rounded-full border border-cream/25 text-cream hover:border-cream/60 transition-colors"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
