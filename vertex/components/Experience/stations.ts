/**
 * World-space Z position of each station along the camera's flight path, plus the
 * [start, end] band of global scroll progress (0..1) during which each station's own
 * local animation plays out. Bands overlap slightly so handoffs feel continuous.
 */
const SPECS_Z = -27;

export const STATIONS = {
  cameraStart: 6,
  // Stop with clearance in front of the monolith (on-axis with the camera path) —
  // flying past this point put the camera inside its scaled-up geometry (fills the
  // whole frame with a single flat red surface at point-blank range).
  cameraEnd: SPECS_Z + 4,
  core: { z: 0, band: [0, 0.22] as [number, number] },
  particles: { z: -9, band: [0.18, 0.48] as [number, number] },
  features: { z: -18, band: [0.45, 0.75] as [number, number] },
  specs: { z: SPECS_Z, band: [0.7, 1] as [number, number] },
};
