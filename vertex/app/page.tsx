import { Header } from "@/components/Header/Header";
import { HeroScene } from "@/components/HeroScene/HeroScene";
import { CapabilitiesScene } from "@/components/CapabilitiesScene/CapabilitiesScene";
import { Features } from "@/components/Features/Features";
import { SpecFooter } from "@/components/SpecFooter/SpecFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroScene />
        <CapabilitiesScene />
        <Features />
        <SpecFooter />
      </main>
    </>
  );
}
