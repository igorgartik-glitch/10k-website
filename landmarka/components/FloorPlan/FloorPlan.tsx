export function FloorPlan() {
  return (
    <section id="floor-plan" className="relative bg-ink-soft px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-cream/50">План этажей</span>
        <h2 className="font-display text-cream text-4xl md:text-6xl mt-4 mb-12 max-w-2xl">
          От первого этажа до мансарды
        </h2>
        <div
          className="scene-placeholder relative aspect-16/10 rounded-3xl"
          data-label="Топ-даун план — рендер не сгенерирован"
        />
      </div>
    </section>
  );
}
