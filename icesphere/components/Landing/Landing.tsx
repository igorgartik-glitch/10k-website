import { Hero } from "./Hero";
import { BrickDiagram } from "./BrickDiagram";
import { TrailDiagram } from "./TrailDiagram";
import { CameraPathDiagram } from "./CameraPathDiagram";
import { PerformanceSection } from "./PerformanceSection";

export function Landing() {
  return (
    <main className="bg-[var(--color-bg)]">
      <Hero />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <BrickDiagram />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--color-line)]">
        <TrailDiagram />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--color-line)]">
        <CameraPathDiagram />
      </section>

      <div className="border-t border-[var(--color-line)]">
        <PerformanceSection />
      </div>

      <footer className="mx-auto max-w-5xl px-6 py-16 border-t border-[var(--color-line)] flex flex-col sm:flex-row justify-between gap-4 text-sm text-[var(--color-ink-3)]">
        <span>Ледяная сфера — учебный проект об устройстве сцены.</span>
        <span>Next.js · React Three Fiber · Tailwind CSS</span>
      </footer>
    </main>
  );
}
