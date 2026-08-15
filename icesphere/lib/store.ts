import { create } from "zustand";

type ScrollState = {
  /** 0..1 — прогресс прокрутки внутри секции сцены. Единственное, от чего зависит сцена. */
  progress: number;
  setProgress: (progress: number) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));
