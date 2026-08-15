const costs = [
  { label: "Хроматическая аберрация + зерно", ms: "≈ 8 мс" },
  { label: "Bloom (свечение)", ms: "≈ 7 мс" },
  { label: "Шейдер перехода", ms: "≈ 5 мс" },
  { label: "Глубина резкости", ms: "≈ 12 мс — выключена" },
];

export function PerformanceSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-3)]">05 · Честно о цене</span>
      <h2 className="mt-4 text-3xl font-semibold">Сколько стоит каждый эффект</h2>
      <p className="mt-4 max-w-2xl text-[var(--color-ink-2)] leading-relaxed">
        Главный рычаг — количество пикселей, а не полигонов: вся геометрия
        сцены (сотни тысяч треугольников земли, десятки кирпичей, тени, туман)
        укладывается в бюджет 60 кадров сама по себе. Расход делают
        полноэкранные эффекты постобработки, которым всё равно, что в кадре.
        Порядок цен ниже — не сумма, важен именно порядок: интуиция
        обманывает (тени оказались почти бесплатны, а понижение разрешения
        bloom вчетверо дало 0.7 мс).
      </p>

      <dl className="mt-10 grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)]">
        {costs.map((cost) => (
          <div key={cost.label} className="bg-[var(--color-surface)] p-6">
            <dt className="text-sm text-[var(--color-ink-2)]">{cost.label}</dt>
            <dd className="mt-2 text-2xl font-semibold font-[family-name:var(--font-mono)]">{cost.ms}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm text-[var(--color-ink-3)] leading-relaxed max-w-2xl">
        Замеры — только на собранной версии (<code>next build</code>). Dev-сервер
        вдвое медленнее: 42 мс против 23 на кадр на одном и том же железе — судить
        о плавности по нему нельзя. Плотность пикселей на Retina ограничена
        (config.postprocessing.dprMin/dprMax): при 4.5 Мпикс — 30 кадров, при 2 — 60.
      </p>
    </section>
  );
}
