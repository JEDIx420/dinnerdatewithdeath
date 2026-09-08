/**
 * DepthSystem defines discrete depth layers and dynamic Y-based sorting conventions.
 * Ensures consistent spatial occlusion between Death, furniture, architectural trim, and lighting.
 */
export const DEPTH_LAYERS = {
  BACKGROUND: 0,
  FLOOR: 100,
  RUGS: 200,
  CONTACT_SHADOWS: 300,
  DYNAMIC_Y_BASE: 1000,
  UPPER_WALLS: 6000,
  FOREGROUND_ARCHES: 7000,
  LIGHTING_OVERLAY: 8000,
  FOREGROUND_AMBIENT: 9000,
  UI: 10000,
} as const;

/**
 * Calculates dynamic depth based on visual foot/ground anchor position Y.
 * @param y Visual Y position
 * @param anchorOffset Offset from center to bottom contact edge (e.g. +48 for 128px character)
 */
export function calculateDynamicDepth(y: number, anchorOffset: number = 0): number {
  return DEPTH_LAYERS.DYNAMIC_Y_BASE + Math.floor(y + anchorOffset);
}
