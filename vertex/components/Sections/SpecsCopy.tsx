const specs = [
  { label: "Latency (p99)", value: "180 мс" },
  { label: "Пропускная способность", value: "12 000 ток/с на узел" },
  { label: "Холодный старт", value: "0 — веса всегда в памяти" },
  { label: "SLA", value: "99.95%" },
];

export function SpecsCopy() {
  return (
    <section
      id="specs"
      className="relative min-h-[100dvh] w-full flex flex-col justify-center px-6 md:px-14 py-24 pointer-events-none"
    >
      <div className="max-w-xl pointer-events-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-paper/50">Спецификация</span>
        <h2 className="font-display uppercase text-paper text-4xl md:text-6xl mt-4 mb-10">
          Цифры, а не обещания
        </h2>
        <div className="flex flex-col gap-4 mb-14">
          {specs.map((spec) => (
            <div key={spec.label} className="spec-row text-paper/70">
              <span className="text-paper/50 uppercase">{spec.label}</span>
              <span className="spec-fill" />
              <span className="text-paper">{spec.value}</span>
            </div>
          ))}
        </div>
        <a
          href="#top"
          className="inline-flex bg-accent text-ink font-medium px-7 py-3 uppercase text-xs tracking-[0.2em] hover:brightness-110 transition"
        >
          Запросить доступ
        </a>
      </div>
      <div className="pointer-events-auto mt-24 pt-8 border-t border-paper/10 flex items-center justify-between text-paper/40 text-xs tracking-[0.2em] uppercase">
        <span>Vertex</span>
        <span>© 2026</span>
      </div>
    </section>
  );
}
