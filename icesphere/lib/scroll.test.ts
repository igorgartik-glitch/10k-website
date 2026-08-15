import { describe, expect, it } from "vitest";
import { computeCameraPose, landingCoverProgress, transitionIntensity } from "./scroll";
import { config } from "./config";

// Значения — прямо в тесте, не из config.ts.

describe("landingCoverProgress", () => {
  it("считает порог по формуле 1 - overlap/(height-100)", () => {
    expect(landingCoverProgress(400, 60)).toBeCloseTo(0.8, 10);
    expect(landingCoverProgress(300, 40)).toBeCloseTo(0.8, 10);
  });

  it("больший нахлёст сдвигает порог закрытия раньше", () => {
    const smallOverlap = landingCoverProgress(400, 30);
    const bigOverlap = landingCoverProgress(400, 90);
    expect(bigOverlap).toBeLessThan(smallOverlap);
  });
});

describe("transitionIntensity", () => {
  it("равна 0 до start и 1 после end", () => {
    expect(transitionIntensity(0.1, 0.5, 0.8)).toBe(0);
    expect(transitionIntensity(0.9, 0.5, 0.8)).toBe(1);
  });

  it("линейна между start и end", () => {
    expect(transitionIntensity(0.65, 0.5, 0.8)).toBeCloseTo(0.5, 10);
  });

  it("не выходит за границы [0,1] на самих концах", () => {
    expect(transitionIntensity(0.5, 0.5, 0.8)).toBe(0);
    expect(transitionIntensity(0.8, 0.5, 0.8)).toBe(1);
  });
});

// Свои опорные точки, а не config.scroll.cameraPoints — правка камеры в
// конфиге не должна красить этот тест (см. spec, раздел «Тесты»).
const testCameraPoints: [number, number, number][] = [
  [0, 1, 20],
  [5, 4, 10],
  [2, 6, -6],
  [0, 2, -10],
];
const testTargetPoints: [number, number, number][] = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 2, 0],
  [0, 1, 1],
];

describe("computeCameraPose", () => {
  it("в начале и конце совпадает с первой/последней опорной точкой кривой", () => {
    const start = computeCameraPose(0, testCameraPoints, testTargetPoints);
    const end = computeCameraPose(1, testCameraPoints, testTargetPoints);
    expect(start.position.x).toBeCloseTo(0, 5);
    expect(start.position.y).toBeCloseTo(1, 5);
    expect(start.position.z).toBeCloseTo(20, 5);
    expect(end.position.y).toBeCloseTo(2, 5);
    expect(end.position.z).toBeCloseTo(-10, 5);
  });

  it("зажимает прогресс вне [0,1]", () => {
    const under = computeCameraPose(-0.5, testCameraPoints, testTargetPoints);
    const atZero = computeCameraPose(0, testCameraPoints, testTargetPoints);
    const over = computeCameraPose(1.5, testCameraPoints, testTargetPoints);
    const atOne = computeCameraPose(1, testCameraPoints, testTargetPoints);
    expect(under.position.equals(atZero.position)).toBe(true);
    expect(over.position.equals(atOne.position)).toBe(true);
  });

  it("по умолчанию читает точки из config (используется в CameraRig без аргументов)", () => {
    const viaDefault = computeCameraPose(0);
    expect(viaDefault.position.x).toBeCloseTo(config.scroll.cameraPoints[0][0], 5);
    expect(viaDefault.position.y).toBeCloseTo(config.scroll.cameraPoints[0][1], 5);
    expect(viaDefault.position.z).toBeCloseTo(config.scroll.cameraPoints[0][2], 5);
  });
});
