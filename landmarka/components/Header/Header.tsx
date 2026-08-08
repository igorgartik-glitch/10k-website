import { SoundControl } from "@/components/SoundControl/SoundControl";

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md bg-ink/30 border-b border-cream/10">
      <a href="#top" className="font-display text-sm tracking-[0.25em] uppercase text-cream">
        LandMarka
      </a>
      <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-cream/70">
        <a href="#journey" className="hover:text-cream transition-colors">
          Дом
        </a>
        <a href="#floor-plan" className="hover:text-cream transition-colors">
          План
        </a>
        <a href="#amenities" className="hover:text-cream transition-colors">
          Инфраструктура
        </a>
        <a href="#contact" className="hover:text-cream transition-colors">
          Контакты
        </a>
      </nav>
      <SoundControl />
    </header>
  );
}
