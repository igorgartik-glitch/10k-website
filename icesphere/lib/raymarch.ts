import { Vector3 } from "three";
import { terrainHeight } from "./terrain";
import { config } from "./config";

/**
 * Точка под курсором ищется лучом по terrainHeight, а не пересечением с
 * геометрией земли: под ландшафтом сотни тысяч треугольников, перебирать их
 * каждый кадр слишком дорого. Луч идёт вперёд шагами ~raymarchStep метров,
 * сравнивая свою высоту Y с высотой снега в той же точке (x,z); как только
 * луч оказывается НИЖЕ снега — пересечение произошло на прошлом шаге,
 * уточняем его делением отрезка пополам. Итого ~raymarchMaxSteps грубых
 * шагов (обычно меньше — выходим сразу при пересечении) плюс bisectionSteps
 * уточнений, вместо перебора всех треугольников меша.
 */
export function raymarchTerrain(origin: Vector3, direction: Vector3): Vector3 | null {
  const step = config.snowTrail.raymarchStep;
  const maxSteps = config.snowTrail.raymarchMaxSteps;
  const bisectionSteps = config.snowTrail.bisectionSteps;

  const point = origin.clone();
  const delta = direction.clone().normalize().multiplyScalar(step);

  const prevPoint = point.clone();
  let hit = false;

  for (let i = 0; i < maxSteps; i++) {
    point.add(delta);
    const ground = terrainHeight(point.x, point.z);
    if (point.y <= ground) {
      hit = true;
      break;
    }
    prevPoint.copy(point);
  }

  if (!hit) return null;

  // Деление отрезка [prevPoint, point] пополам: уточняем, где луч пересёк
  // высоту снега, не делая шаг мельче на всём пути.
  let lo = prevPoint.clone();
  let hi = point.clone();
  for (let i = 0; i < bisectionSteps; i++) {
    const mid = lo.clone().lerp(hi, 0.5);
    const ground = terrainHeight(mid.x, mid.z);
    if (mid.y <= ground) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  const result = lo.clone().lerp(hi, 0.5);
  result.y = terrainHeight(result.x, result.z);
  return result;
}
