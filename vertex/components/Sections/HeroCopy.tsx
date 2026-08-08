export function HeroCopy() {
  return (
    <section id="top" className="relative h-[100dvh] w-full overflow-hidden">
      <div className="ghost-wordmark z-0" aria-hidden="true">
        VERTEX
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-14 pb-20 md:pb-24 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <span className="text-xs tracking-[0.35em] uppercase text-paper/60 mb-5 block">
            AI-инфраструктура нового поколения
          </span>
          <h1 className="font-display uppercase text-paper text-[15vw] md:text-[6.5vw] leading-[0.92] tracking-tight">
            Ядро для инференса
          </h1>
          <p className="mt-6 max-w-md text-paper/70 text-sm md:text-base">
            Один кластер, ноль простоя. VERTEX держит модель горячей и масштабируется
            быстрее, чем растёт очередь запросов.
          </p>
          <a
            href="#capabilities"
            className="mt-8 inline-flex items-center gap-3 bg-accent text-ink font-medium px-7 py-3 uppercase text-xs tracking-[0.2em] hover:brightness-110 transition"
          >
            Смотреть возможности
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 right-6 md:right-10 z-10 text-paper/50 text-[11px] tracking-[0.25em] uppercase pointer-events-none">
        Скролл ↓
      </div>
    </section>
  );
}
