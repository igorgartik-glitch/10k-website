// Скачивает PBR-карты снега (ambientCG, CC0) и конвертирует их в WebP для
// public/textures/snow/. Запуск: node scripts/fetch-textures.mjs
//
// Итоговые .webp закоммичены в репозиторий (см. комментарий в Ground.tsx) —
// этот скрипт нужен, чтобы пересобрать их при смене материала или качества
// сжатия, а не как обязательный шаг перед каждым build: статический хостинг
// GitHub Pages не может ничего скачать сам во время сборки, и если бы карты
// не лежали в public/ заранее, они бы просто 404-ились на живом сайте.
import { mkdir, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import AdmZip from "adm-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const tmpDir = path.join(root, ".tmp-textures");
const outDir = path.join(root, "public", "textures", "snow");

const ZIP_URL = "https://ambientcg.com/get?file=Snow005_1K-JPG.zip";

/**
 * Карта цвета в исходнике — фотография снега под студийным светом, в
 * среднем даёт около 148/255 (тусклый серый), а не почти-белый снег, каким
 * его нужно видеть на сцене (тон должен читаться заодно с fog.color и
 * transition.fillColor — оба почти-белые, см. config.ts). Поднимаем яркость
 * линейным гейном перед сохранением, а не полагаемся на color-множитель
 * материала: он и так уже занят под snowWhite-тонировку (config.terrain.color)
 * и повторное перемножение делает землю заметно темнее ожидаемого.
 */
const COLOR_GAIN = 1.55;

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
}

async function main() {
  await rm(tmpDir, { recursive: true, force: true });
  await mkdir(tmpDir, { recursive: true });
  await mkdir(outDir, { recursive: true });

  const zipPath = path.join(tmpDir, "Snow005_1K-JPG.zip");
  console.log("Скачиваю", ZIP_URL);
  await download(ZIP_URL, zipPath);

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tmpDir, true);

  // GL-вариант нормали, не DirectX — three.js ждёт OpenGL-конвенцию (see spec).
  const convert = [
    { src: "Snow005_1K-JPG_Color.jpg", dst: "color.webp", quality: 88, gain: COLOR_GAIN },
    { src: "Snow005_1K-JPG_NormalGL.jpg", dst: "normal.webp", quality: 95 },
    { src: "Snow005_1K-JPG_Roughness.jpg", dst: "roughness.webp", quality: 85 },
  ];

  for (const { src, dst, quality, gain } of convert) {
    const inPath = path.join(tmpDir, src);
    const outPath = path.join(outDir, dst);
    let pipeline = sharp(inPath);
    if (gain) pipeline = pipeline.linear(gain, 0);
    await pipeline.webp({ quality }).toFile(outPath);
    console.log("→", dst);
  }

  // Displacement сознательно не используется: слот displacementMap в
  // Ground.tsx уже занят динамической текстурой следов на снегу
  // (useSnowTrailTexture.ts) — статичная макро-форма рельефа уже задаётся
  // напрямую через вершины геометрии (terrainHeight), вторая карта
  // смещения конфликтовала бы с этим, а не дополняла.

  await rm(tmpDir, { recursive: true, force: true });
  console.log("Готово:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
