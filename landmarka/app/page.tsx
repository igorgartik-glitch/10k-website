"use client";

import { useState } from "react";
import { Preloader } from "@/components/Preloader/Preloader";
import { Header } from "@/components/Header/Header";
import { HeroScene } from "@/components/HeroScene/HeroScene";
import { CameraJourney } from "@/components/CameraJourney/CameraJourney";
import { ReducedMotionFallback } from "@/components/ReducedMotionFallback/ReducedMotionFallback";
import { FloorPlan } from "@/components/FloorPlan/FloorPlan";
import { Amenities } from "@/components/Amenities/Amenities";
import { ContactCTA } from "@/components/ContactCTA/ContactCTA";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();
  useLenis(!loading && !reducedMotion);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Header />
      <main>
        <HeroScene />
        {reducedMotion ? <ReducedMotionFallback /> : <CameraJourney />}
        <FloorPlan />
        <Amenities />
        <ContactCTA />
      </main>
    </>
  );
}
