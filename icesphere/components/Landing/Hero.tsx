export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 text-center">
      <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-ink-3)]">
        Как устроена сцена
      </span>
      <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight text-[var(--color-ink-1)]">
        Кирпич за кирпичом
      </h1>
      <p className="mt-6 text-lg text-[var(--color-ink-2)] leading-relaxed">
        То, что вы только что видели — не видео и не рендер. Ледяная сфера,
        рельеф под курсором и след на снегу собраны из нескольких чистых
        функций и трёх правил, каждое из которых один раз нарушили и
        поплатились. Дальше — как это устроено, с работающими схемами, а не
        картинками.
      </p>
    </section>
  );
}
