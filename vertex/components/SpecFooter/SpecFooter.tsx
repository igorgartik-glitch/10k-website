const specs = [
  { label: "Latency (p99)", value: "180 мс" },
  { label: "Пропускная способность", value: "12 000 ток/с на узел" },
  { label: "Холодный старт", value: "0 — веса всегда в памяти" },
  { label: "SLA", value: "99.95%" },
];

export function SpecFooter() {
  return (
    <footer id="specs" className="relative bg-ink-soft px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase text-paper/50">Спецификация</span>
        <h2 className="font-display uppercase text-paper text-4xl md:text-6xl mt-4 mb-14">
          Цифры, а не обещания
        </h2>
        <div className="flex flex-col gap-4 mb-16">
          {specs.map((spec) => (
            <div key={spec.label} className="spec-row text-paper/70">
              <span className="text-paper/50 uppercase">{spec.label}</span>
              <span className="spec-fill" />
              <span className="text-paper">{spec.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-paper/10 pt-8">
          <span className="font-display uppercase text-paper tracking-[0.2em]">Vertex</span>
          <a
            href="#top"
            className="bg-accent text-ink font-medium px-7 py-3 uppercase text-xs tracking-[0.2em] hover:brightness-110 transition"
          >
            Запросить доступ
          </a>
        </div>
      </div>
    </footer>
  );
}
