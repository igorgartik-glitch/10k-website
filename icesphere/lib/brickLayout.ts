import { Matrix4, Quaternion, Vector3 } from "three";

export type BrickPlacement = {
  position: [number, number, number];
  /** Кватернион [x, y, z, w] из полного базиса — см. computeBrickLayout. */
  quaternion: [number, number, number, number];
  width: number;
  height: number;
};

/**
 * Раскладка кирпичей по сфере. Чистая функция без сцены и рендера — её же
 * вызывает интерактивная схема кладки на лендинге (тем же аргументами, тем
 * же результатом), поэтому иллюстрация не может разойтись со сценой.
 *
 * Кольца режутся по широте θ от 0 до π (полюс — полюс) с одинаковым шагом.
 * Число кирпичей в кольце: round(2 · rings · sin θ) — окружность кольца
 * пропорциональна sin θ, и плечи сокращаются в той же пропорции, так что
 * ширина кирпича вдоль широты остаётся почти постоянной.
 *
 * Разворот каждого кирпича — полный базис из трёх осей (нормаль наружу,
 * касательная вдоль кольца, их векторное произведение), а НЕ поворот
 * «из вектора в вектор» (THREE.Quaternion.setFromUnitVectors). У поворота
 * между двумя векторами вращение вокруг самой нормали не закреплено ничем:
 * каждый кирпич технически развёрнут «правильно» (нормаль смотрит наружу),
 * но крен вокруг неё независим от соседей — кладка кренится, хотя сфера
 * собирается. Полный базис фиксирует все три оси сразу.
 */
export function computeBrickLayout(
  rings: number,
  radius: number,
  heightFill: number,
  widthFill: number,
): BrickPlacement[] {
  const bricks: BrickPlacement[] = [];
  const ringHeight = (Math.PI * radius) / rings;
  const brickHeight = ringHeight * heightFill;

  for (let ringIndex = 0; ringIndex < rings; ringIndex++) {
    const theta = ((ringIndex + 0.5) / rings) * Math.PI;
    const sinTheta = Math.sin(theta);
    const count = Math.round(2 * rings * sinTheta);
    if (count < 1) continue;

    const cosTheta = Math.cos(theta);
    const ringCircumference = 2 * Math.PI * radius * sinTheta;
    const brickWidth = (ringCircumference / count) * widthFill;

    for (let j = 0; j < count; j++) {
      const phi = ((j + 0.5) / count) * 2 * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Точка на единичной сфере (θ от полюса +Y, φ — азимут вокруг Y).
      const normal = new Vector3(sinTheta * cosPhi, cosTheta, sinTheta * sinPhi);

      // Касательная вдоль кольца — производная позиции по φ, нормированная.
      // sinTheta уже сокращается: |d/dφ| = sinTheta, поэтому итог не зависит
      // от широты и остаётся единичным без деления на sinTheta напрямую
      // (что обнулялось бы у полюса).
      const tangent = new Vector3(-sinPhi, 0, cosPhi);

      // Третья ось — векторное произведение, а не ещё один independent выбор.
      const bitangent = new Vector3().crossVectors(normal, tangent).normalize();

      const basis = new Matrix4().makeBasis(tangent, bitangent, normal);
      const quaternion = new Quaternion().setFromRotationMatrix(basis);

      const position = normal.clone().multiplyScalar(radius);

      bricks.push({
        position: [position.x, position.y, position.z],
        quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
        width: brickWidth,
        height: brickHeight,
      });
    }
  }

  return bricks;
}
