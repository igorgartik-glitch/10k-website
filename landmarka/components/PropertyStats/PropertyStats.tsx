import type { SceneStat, TextPosition } from "@/components/CameraJourney/scenes.config";

export function PropertyStats({
  stats,
  position,
}: {
  stats: SceneStat[];
  position: TextPosition;
}) {
  const align = position === "left" ? "right-6 md:right-14" : "left-6 md:left-14";

  return (
    <div
      className={`absolute top-24 md:top-28 z-10 ${align} hidden sm:flex flex-col gap-2 rounded-2xl border border-cream/15 bg-cream/5 backdrop-blur-md px-5 py-4`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-4 text-xs tracking-wide">
          <span className="text-cream/50 uppercase">{stat.label}</span>
          <span className="text-cream ml-auto font-medium">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
