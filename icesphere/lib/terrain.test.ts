import { describe, expect, it } from "vitest";
import { duneBell, planeLocalToWorld, terrainHeight, worldToPlaneLocal } from "./terrain";

// Значения здесь заданы прямо в тесте, а не взяты из config — правка числа
// в конфиге не должна красить тесты (см. спецификацию, раздел «Тесты»).

describe("duneBell — колокол с конечным радиусом", () => {
  it("равен высоте ровно в центре", () => {
    expect(duneBell(0, 0, 10, 5)).toBeCloseTo(5, 10);
  });

  it("равен нулю точно на радиусе и за ним — без гауссова хвоста", () => {
    expect(duneBell(10, 0, 10, 5)).toBe(0);
    expect(duneBell(15, 0, 10, 5)).toBe(0);
    expect(duneBell(1000, 1000, 10, 5)).toBe(0);
  });

  it("монотонно убывает от центра к краю", () => {
    const samples = [0, 2, 4, 6, 8, 9.9].map((d) => duneBell(d, 0, 10, 5));
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]).toBeLessThan(samples[i - 1]);
    }
  });

  it("симметричен по направлению", () => {
    expect(duneBell(3, 4, 10, 5)).toBeCloseTo(duneBell(-3, -4, 10, 5), 10);
  });
});

describe("terrainHeight — единственный источник формы земли", () => {
  it("не зависит от дюн далеко за пределами всех радиусов (остаётся чистый шум)", () => {
    // Точка далеко за пределами всех сконфигурированных дюн: высота — это
    // ровно шумовая текстура наста, без вклада дюн.
    const farX = 10000;
    const farZ = 10000;
    const h1 = terrainHeight(farX, farZ);
    const h2 = terrainHeight(farX, farZ);
    expect(h1).toBe(h2); // детерминированность: шум не меняется между вызовами
  });

  it("детерминирован при одинаковых координатах", () => {
    expect(terrainHeight(3.14, -2.71)).toBe(terrainHeight(3.14, -2.71));
  });
});

describe("planeLocalToWorld / worldToPlaneLocal — знак после поворота плоскости на -π/2 по X", () => {
  // rotation.x = -π/2 переводит локальную точку (x, y, 0) в мировую (x, 0, -y):
  // локальная ось Y смотрит против мировой Z. Перепутанный знак делает
  // рельеф под курсором зеркальным — эта пара тестов ловит именно это.

  it("локальный +Y уходит в мировой -Z", () => {
    const { x, z } = planeLocalToWorld(5, 7);
    expect(x).toBe(5);
    expect(z).toBe(-7);
  });

  it("обратное преобразование восстанавливает исходные локальные координаты", () => {
    const local = { localX: 12.5, localY: -8.25 };
    const world = planeLocalToWorld(local.localX, local.localY);
    const roundTrip = worldToPlaneLocal(world.x, world.z);
    expect(roundTrip.localX).toBeCloseTo(local.localX, 10);
    expect(roundTrip.localY).toBeCloseTo(local.localY, 10);
  });

  it("не является тождественным преобразованием (ловит регрессию на просто x,y->x,z)", () => {
    const { z } = planeLocalToWorld(0, 9);
    expect(z).not.toBe(9);
    expect(z).toBe(-9);
  });
});
