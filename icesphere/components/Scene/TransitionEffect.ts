import { Effect } from "postprocessing";
import { Color, Uniform } from "three";
import { config } from "@/lib/config";

/**
 * Единственный самописный шейдер в проекте. Делает две вещи: смаз лучами к
 * центру кадра (имитация резкого наезда камеры) и заливку снизу с
 * наклонённой, изломанной шумом границей — цвет заливки совпадает с фоном
 * лендинга (config.transition.fillColor), поэтому стык между сценой и
 * лендингом не виден.
 *
 * Готовый «glitch»-эффект не подошёл: он рвёт кадр на прямоугольники и
 * читается как потеря телесигнала, а не как наезд камеры. CSS-переход даёт
 * равномерное размытие, а нужен именно лучевой смаз.
 */
const fragmentShader = /* glsl */ `
  uniform float intensity;
  uniform float smearStrength;
  uniform float wipeNoiseScale;
  uniform float wipeAngle;
  uniform float wipeSoftness;
  uniform vec3 fillColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 smeared = inputColor;

    if (intensity > 0.0001) {
      vec4 sum = vec4(0.0);
      const int SAMPLES = ${config.transition.smearSamples};
      for (int i = 0; i < SAMPLES; i++) {
        float t = float(i) / float(SAMPLES - 1);
        vec2 sampleUv = mix(uv, vec2(0.5), t * smearStrength * intensity);
        sum += texture2D(inputBuffer, sampleUv);
      }
      smeared = sum / float(SAMPLES);
    }

    // Граница залива: наклон + слом шумом, ползёт снизу вверх с ростом intensity.
    float tiltedY = uv.y + (uv.x - 0.5) * tan(wipeAngle);
    float n = (valueNoise(uv * wipeNoiseScale) - 0.5) * 0.4;
    float edge = tiltedY + n - (intensity * 1.6 - 0.3);
    float fill = smoothstep(-wipeSoftness, wipeSoftness, -edge) * step(0.0001, intensity);

    outputColor = mix(smeared, vec4(fillColor, 1.0), fill);
  }
`;

export class TransitionEffect extends Effect {
  constructor() {
    super("TransitionEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["intensity", new Uniform(0)],
        ["smearStrength", new Uniform(config.transition.smearStrength)],
        ["wipeNoiseScale", new Uniform(config.transition.wipeNoiseScale)],
        ["wipeAngle", new Uniform(config.transition.wipeAngle)],
        ["wipeSoftness", new Uniform(config.transition.wipeSoftness)],
        ["fillColor", new Uniform(new Color(config.transition.fillColor))],
      ]),
    });
  }

  setIntensity(value: number) {
    const uniform = this.uniforms.get("intensity");
    if (uniform) uniform.value = value;
  }
}
