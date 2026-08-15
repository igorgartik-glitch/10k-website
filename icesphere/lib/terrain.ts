import { createNoise2D } from "simplex-noise";
import { config } from "./config";

/**
 * Детерминированный PRNG (mulberry32), чтобы шум был одинаковым на сервере,
 * на клиенте и в тестах — обычный Math.random внутри createNoise2D даёт
 * разные ландшафты при каждой перезагрузке и ломает гидратацию.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 1337;
const noise2D = createNoise2D(mulberry32(SEED));

/**
 * У повёрнутой на -π/2 по X плоскости локальная ось Y геометрии становится
 * мировой −Z (проверка: rotation.x=-π/2 переводит точку (x,y,0) в (x,0,-y)).
 * Все три потребителя высоты — земля, туман, курсор — обязаны идти через
 * эти две функции, а не пересчитывать знак каждый в своём углу; именно
 * рассинхрон знака когда-то сделал рельеф под курсором зеркальным.
 */
export function planeLocalToWorld(localX: number, localY: number): { x: number; z: number } {
  return { x: localX, z: -localY };
}

export function worldToPlaneLocal(x: number, z: number): { localX: number; localY: number } {
  return { localX: x, localY: -z };
}

/**
 * Мировые координаты в UV холста следов на снегу (0..1), тем же знаком
 * localY, что и planeLocalToWorld — PlaneGeometry по умолчанию кладёт
 * u вдоль local X, v вдоль local Y, поэтому и здесь используется
 * worldToPlaneLocal, а не независимый пересчёт.
 */
export function worldToTrailUv(x: number, z: number, size: number): { u: number; v: number } {
  const { localX, localY } = worldToPlaneLocal(x, z);
  return {
    u: localX / size + 0.5,
    v: localY / size + 0.5,
  };
}

function fractalNoise(x: number, z: number): number {
  let sum = 0;
  for (const octave of config.terrain.noiseOctaves) {
    sum += noise2D(x * octave.frequency, z * octave.frequency) * octave.amplitude;
  }
  return sum;
}

/**
 * Колокол с конечным радиусом (квартичный спад), а не гауссова кривая.
 * У гауссианы бесконечный хвост: гора в сотне метров всё равно чуть
 * приподнимает землю, и объект в центре сцены однажды почти утонул в снегу
 * из-за дюны, поставленной далеко на фоне. Здесь высота ровно 0 на радиусе
 * и за ним — никакого хвоста.
 */
export function duneBell(dx: number, dz: number, radius: number, height: number): number {
  const d = Math.sqrt(dx * dx + dz * dz);
  if (d >= radius) return 0;
  const t = 1 - (d / radius) ** 2;
  return t * t * height;
}

/**
 * Единственный источник истины о форме земли. Используется:
 * 1) геометрией плоскости (Ground.tsx) — строит меш;
 * 2) туманом у земли (если понадобится стелющийся туман) — ложится по рельефу;
 * 3) курсором (SnowTrail.tsx) — луч находит точку под указателем.
 * Если формула переедет внутрь компонента земли, эти трое разойдутся.
 */
export function terrainHeight(x: number, z: number): number {
  let height = fractalNoise(x, z);
  for (const dune of config.terrain.dunes) {
    height += duneBell(x - dune.x, z - dune.z, dune.radius, dune.height);
  }
  return height;
}
