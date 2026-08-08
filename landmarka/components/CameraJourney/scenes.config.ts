export type SceneStat = {
  label: string;
  value: string;
};

export type TextPosition = "left" | "right" | "center-top";

export type Scene = {
  id: string;
  index: number;
  eyebrow: string;
  title: string;
  body: string;
  textPosition: TextPosition;
  accent: string;
  stats?: SceneStat[];
  /** Relative scroll weight in viewport-heights — longer scenes get more dwell time. */
  scroll?: number;
  /** Pure visual beat with no text overlay (the "through the threshold" cut). */
  isTransition?: boolean;
};

export const scenes: Scene[] = [
  {
    id: "approach",
    index: 1,
    eyebrow: "01 — Подъезд",
    title: "Фасад открывается навстречу",
    body: "Камера снижается над участком и идёт вперёд, к парадному входу.",
    textPosition: "right",
    accent: "#c98a4b",
    stats: [
      { label: "Участок", value: "14 соток" },
      { label: "Год постройки", value: "2025" },
    ],
    scroll: 1.3,
  },
  {
    id: "threshold",
    index: 2,
    eyebrow: "",
    title: "",
    body: "",
    textPosition: "center-top",
    accent: "#c98a4b",
    isTransition: true,
    scroll: 0.6,
  },
  {
    id: "great-room",
    index: 3,
    eyebrow: "03 — Гостиная",
    title: "Свет проходит сквозь весь дом",
    body: "Двусветное пространство и панорамное остекление стирают границу с садом.",
    textPosition: "left",
    accent: "#c98a4b",
    stats: [
      { label: "Площадь", value: "64 м²" },
      { label: "Высота потолков", value: "5.4 м" },
    ],
    scroll: 1.6,
  },
  {
    id: "kitchen",
    index: 4,
    eyebrow: "04 — Кухня",
    title: "Кухня как центр тяжести дома",
    body: "Остров из цельного камня, скрытая техника, вид на террасу.",
    textPosition: "right",
    accent: "#c98a4b",
    stats: [
      { label: "Столешница", value: "Керамогранит" },
      { label: "Техника", value: "Встроенная" },
    ],
    scroll: 1.4,
  },
  {
    id: "primary-suite",
    index: 5,
    eyebrow: "05 — Спальня",
    title: "Приватность на верхнем этаже",
    body: "Мастер-сюит с гардеробной и санузлом, выходящим на закрытую лоджию.",
    textPosition: "left",
    accent: "#c98a4b",
    stats: [
      { label: "Площадь", value: "38 м²" },
      { label: "Санузел", value: "Собственный" },
    ],
    scroll: 1.4,
  },
  {
    id: "terrace",
    index: 6,
    eyebrow: "06 — Терраса",
    title: "Дом продолжается в саду",
    body: "Камера выходит наружу — терраса, бассейн, вечерний свет.",
    textPosition: "center-top",
    accent: "#c98a4b",
    stats: [
      { label: "Бассейн", value: "12 × 4 м" },
      { label: "Ориентация", value: "Юго-запад" },
    ],
    scroll: 1.5,
  },
];
