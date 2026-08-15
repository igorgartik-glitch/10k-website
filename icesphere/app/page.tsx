import { SceneSection } from "@/components/Scene/SceneSection";
import { Landing } from "@/components/Landing/Landing";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <>
      <SceneSection />
      {/* Нахлёст на хвост сцены (см. lib/scroll.ts::landingCoverProgress) — иначе
          после отыгранного перехода зритель ещё какое-то время смотрит на
          кадр, залитый ровным цветом. */}
      <div style={{ marginTop: `-${config.scroll.landingOverlapVh}vh` }} className="relative z-10">
        <Landing />
      </div>
    </>
  );
}
