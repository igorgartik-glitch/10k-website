import { CatmullRomCurve3, Vector3 } from "three";
import { config } from "./config";

/**
 * Нахлёст лендинга (отрицательный margin-top в vh) съедает прокрутку с
 * конца: страница начинает закрывать кадр не на progress=1, а раньше —
 * ровно на этой отметке. Если сдвинуть нахлёст или высоту секции, не
 * пересчитав это, лендинг залезет поверх недоигранного перехода. Поэтому
 * порог вычисляется здесь, а не хранится вторым числом в конфиге.
 */
export function landingCoverProgress(sectionHeightVh: number, landingOverlapVh: number): number {
  return 1 - landingOverlapVh / (sectionHeightVh - 100);
}

type Point3 = readonly [number, number, number];

/**
 * Поза камеры (позиция + цель взгляда) на кривых Катмулла-Рома в progress
 * [0..1]. Опорные точки — параметры со значениями по умолчанию из config,
 * а не жёстко зашитый config.scroll внутри функции: тест гоняет свои
 * точки, не заглядывая в config.ts, поэтому правка числа в конфиге эту
 * функцию не красит (см. spec, раздел «Тесты»); в CameraRig.tsx вызывается
 * просто computeCameraPose(progress) — дефолты те же самые, что в сцене.
 */
export function computeCameraPose(
  progress: number,
  cameraPoints: readonly Point3[] = config.scroll.cameraPoints,
  targetPoints: readonly Point3[] = config.scroll.targetPoints,
): { position: Vector3; target: Vector3 } {
  const t = Math.min(1, Math.max(0, progress));
  const cameraCurve = new CatmullRomCurve3(cameraPoints.map((p) => new Vector3(...p)));
  const targetCurve = new CatmullRomCurve3(targetPoints.map((p) => new Vector3(...p)));
  return {
    position: cameraCurve.getPoint(t),
    target: targetCurve.getPoint(t),
  };
}

/** Интенсивность перехода (0..1) из прогресса прокрутки — плато вне [start,end]. */
export function transitionIntensity(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= start ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

if (process.env.NODE_ENV !== "production") {
  const coverAt = landingCoverProgress(config.scroll.sectionHeightVh, config.scroll.landingOverlapVh);
  if (config.scroll.transitionEnd > coverAt) {
    console.warn(
      `[scroll] transitionEnd (${config.scroll.transitionEnd}) наступает позже, чем лендинг ` +
        `начинает закрывать сцену (${coverAt.toFixed(3)}) — переход будет доигрывать под лендингом. ` +
        `Сдвиньте transitionEnd в config.ts ниже этого значения.`,
    );
  }
}
