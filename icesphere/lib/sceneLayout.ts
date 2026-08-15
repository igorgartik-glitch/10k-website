import { config } from "./config";
import { terrainHeight } from "./terrain";

/**
 * Высота центра сферы по Y — единственное место, где она считается. Сфера,
 * свечение внутри нёе и точечный свет обязаны брать именно это значение
 * (не 0, не свои копии формулы) — иначе, например, свет окажется в центре
 * мира, а не в центре парящей сферы. Вынесено из config.ts, чтобы не
 * заводить циклический импорт (terrainHeight сам зависит от config).
 */
export const sphereCenterY = terrainHeight(0, 0) + config.brick.sphereRadius + config.brick.groundClearance;
