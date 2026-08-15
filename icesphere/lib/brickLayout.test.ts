import { describe, expect, it } from "vitest";
import { Quaternion, Vector3 } from "three";
import { computeBrickLayout } from "./brickLayout";

// Значения раскладки заданы прямо в тесте (не из config.ts) — правка числа
// в конфиге не должна красить эти тесты.
const RINGS = 12;
const RADIUS = 4;
const HEIGHT_FILL = 0.86;
const WIDTH_FILL = 0.82;

describe("computeBrickLayout", () => {
  const bricks = computeBrickLayout(RINGS, RADIUS, HEIGHT_FILL, WIDTH_FILL);

  it("создаёт непустую раскладку", () => {
    expect(bricks.length).toBeGreaterThan(0);
  });

  it("все блоки лежат ровно на сфере заданного радиуса", () => {
    for (const brick of bricks) {
      const [x, y, z] = brick.position;
      const distance = Math.sqrt(x * x + y * y + z * z);
      expect(distance).toBeCloseTo(RADIUS, 6);
    }
  });

  it("кватернионы нормированы", () => {
    for (const brick of bricks) {
      const [x, y, z, w] = brick.quaternion;
      const length = Math.sqrt(x * x + y * y + z * z + w * w);
      expect(length).toBeCloseTo(1, 6);
    }
  });

  it("блоки не перекошены: локальная ось Z кватерниона совпадает с нормалью наружу", () => {
    // Регрессионный тест на баг «поворот из вектора в вектор»: если бы
    // ориентация строилась через setFromUnitVectors, эта проверка тоже
    // прошла бы (нормаль корректна) — крен был бы виден только по касательной
    // ниже. Проверяем обе оси, чтобы поймать именно некрепление крена.
    for (const brick of bricks) {
      const q = new Quaternion(...brick.quaternion);
      const localZ = new Vector3(0, 0, 1).applyQuaternion(q);
      const expectedNormal = new Vector3(...brick.position).normalize();
      expect(localZ.dot(expectedNormal)).toBeCloseTo(1, 5);
    }
  });

  it("блоки не перекошены: локальная ось X кватерниона совпадает с касательной вдоль кольца (не произвольный крен)", () => {
    for (const brick of bricks) {
      const q = new Quaternion(...brick.quaternion);
      const localX = new Vector3(1, 0, 0).applyQuaternion(q);
      const normal = new Vector3(...brick.position).normalize();

      // Аналитическая касательная: горизонтальна (без вертикальной
      // составляющей) и перпендикулярна нормали — именно это ломается,
      // если крен вокруг нормали не закреплён базисом.
      expect(localX.y).toBeCloseTo(0, 5);
      expect(localX.dot(normal)).toBeCloseTo(0, 5);
      expect(localX.length()).toBeCloseTo(1, 5);
    }
  });

  it("три оси базиса взаимно перпендикулярны (ортонормированный базис)", () => {
    const q = new Quaternion(...bricks[Math.floor(bricks.length / 2)].quaternion);
    const x = new Vector3(1, 0, 0).applyQuaternion(q);
    const y = new Vector3(0, 1, 0).applyQuaternion(q);
    const z = new Vector3(0, 0, 1).applyQuaternion(q);
    expect(x.dot(y)).toBeCloseTo(0, 5);
    expect(y.dot(z)).toBeCloseTo(0, 5);
    expect(x.dot(z)).toBeCloseTo(0, 5);
  });

  it("соседи внутри кольца не перекрываются: суммарная угловая ширина кирпичей кольца не превышает полный круг", () => {
    const byRing = new Map<number, typeof bricks>();
    for (const brick of bricks) {
      const y = brick.position[1];
      const key = Math.round((y / RADIUS) * 1000); // группировка по широте
      const list = byRing.get(key) ?? [];
      list.push(brick);
      byRing.set(key, list);
    }

    for (const ringBricks of byRing.values()) {
      const y = ringBricks[0].position[1];
      const sinTheta = Math.sqrt(Math.max(0, 1 - (y / RADIUS) ** 2));
      if (sinTheta < 1e-6) continue; // кольцо у полюса вырождено
      const ringRadius = RADIUS * sinTheta;
      const totalAngularWidth = ringBricks.reduce((sum, b) => sum + b.width / ringRadius, 0);
      expect(totalAngularWidth).toBeLessThanOrEqual(2 * Math.PI + 1e-6);
    }
  });

  it("высота кирпича не зависит от кольца (постоянный шаг по широте)", () => {
    const heights = new Set(bricks.map((b) => Math.round(b.height * 1e6)));
    expect(heights.size).toBe(1);
  });
});
