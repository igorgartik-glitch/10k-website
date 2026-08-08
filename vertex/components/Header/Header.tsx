export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md bg-ink/50 border-b border-white/10">
      <a href="#top" className="font-display uppercase text-sm tracking-[0.3em] text-paper">
        Vertex
      </a>
      <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-paper/60">
        <a href="#capabilities" className="hover:text-paper transition-colors">
          01 · Как устроено
        </a>
        <a href="#features" className="hover:text-paper transition-colors">
          02 · Модули
        </a>
        <a href="#specs" className="hover:text-paper transition-colors">
          03 · Спецификация
        </a>
      </nav>
      <a
        href="#specs"
        className="border border-paper/30 text-paper text-xs tracking-[0.2em] uppercase px-4 py-2 hover:border-accent hover:text-accent transition-colors"
      >
        Запросить доступ
      </a>
    </header>
  );
}
