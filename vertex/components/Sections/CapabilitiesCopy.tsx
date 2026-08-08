export function CapabilitiesCopy() {
  return (
    <section
      id="capabilities"
      className="relative h-[100dvh] w-full flex items-center px-6 md:px-14 pointer-events-none"
    >
      <div className="max-w-lg pointer-events-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-accent mb-4 block">
          02 — Как это работает
        </span>
        <h2 className="font-display uppercase text-paper text-4xl md:text-6xl leading-tight mb-4">
          Рассеивается и собирается заново
        </h2>
        <p className="text-paper/70 text-sm md:text-base max-w-md">
          Каждый узел кластера — точка в облаке. Скролл управляет тем, как плотно они
          держат форму: от хаоса простоя до идеальной решётки под нагрузкой.
        </p>
      </div>
    </section>
  );
}
