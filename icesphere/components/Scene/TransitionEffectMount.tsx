"use client";

import { forwardRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { TransitionEffect } from "./TransitionEffect";
import { useScrollStore } from "@/lib/store";
import { transitionIntensity } from "@/lib/scroll";
import { config } from "@/lib/config";

/**
 * Смонтирован в цепочке постобработки один раз и навсегда — эффект нельзя
 * ни добавлять/убирать по ходу прокрутки (библиотека пересобирает цепочку и
 * падает на сериализации объектов сцены), ни включать/выключать «режимом
 * пропуска» (обратно шейдер уже не соберётся, переход просто не наступит).
 * Вместо этого он всегда в дереве и сам крутит свой uniform intensity.
 */
export const TransitionEffectMount = forwardRef<TransitionEffect>((_props, ref) => {
  const effect = useMemo(() => new TransitionEffect(), []);

  useFrame(() => {
    const progress = useScrollStore.getState().progress;
    effect.setIntensity(
      transitionIntensity(progress, config.scroll.transitionStart, config.scroll.transitionEnd),
    );
  });

  return <primitive ref={ref} object={effect} />;
});

TransitionEffectMount.displayName = "TransitionEffectMount";
