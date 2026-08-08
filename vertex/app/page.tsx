"use client";

import { Header } from "@/components/Header/Header";
import { Experience } from "@/components/Experience/Experience";
import { HeroCopy } from "@/components/Sections/HeroCopy";
import { CapabilitiesCopy } from "@/components/Sections/CapabilitiesCopy";
import { FeaturesCopy } from "@/components/Sections/FeaturesCopy";
import { SpecsCopy } from "@/components/Sections/SpecsCopy";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function Home() {
  const reducedMotion = useReducedMotion();
  const progressRef = useScrollProgress(!reducedMotion);

  return (
    <>
      <Experience progressRef={progressRef} animate={!reducedMotion} />
      <Header />
      <main className="relative z-10">
        <HeroCopy />
        <CapabilitiesCopy />
        <FeaturesCopy />
        <SpecsCopy />
      </main>
    </>
  );
}
