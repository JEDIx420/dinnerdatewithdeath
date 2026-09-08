/**
 * DepthSystem defines discrete depth layers and dynamic Y-based sorting conventions.
 * Ensures consistent spatial occlusion between Death, furniture, architectural trim, and lighting.
 */
export const DEPTH_LAYERS = {
  BACKGROUND: 0,
  FLOOR: 100,
  FLOOR_DECOR: 200,          // Rugs, medallions, thresholds
  RUGS: 200,                 // Compatibility alias
  BACK_WALL: 300,            // Wall surface, wallpaper, wall panels, masonry backplates
  BACK_WALL_DETAIL: 400,     // Wall-mounted trim, cornices, mouldings, niches, crests
  CONTACT_SHADOWS: 500,
  DYNAMIC_Y_BASE: 1000,      // Ground-standing entities (Player, furniture, columns, newels)
  UPPER_WALLS: 5500,         // Upper wall facades / arch trim
  FOREGROUND_STRUCTURE: 6000,// True overhead arch headers, balcony fascias, chandeliers
  FOREGROUND_ARCHES: 6000,   // Compatibility alias
  LIGHTING_OVERLAY: 8000,
  FOREGROUND_AMBIENT: 9000,
  UI: 10000,
} as const;

export type DepthClass =
  | 'background'
  | 'floor'
  | 'floor-decor'
  | 'back-wall'
  | 'back-wall-detail'
  | 'contact-shadow'
  | 'dynamic-solid'
  | 'foreground-structure'
  | 'lighting'
  | 'ui';

/**
 * Calculates dynamic depth based on visual foot/ground anchor position Y.
 * @param groundY Ground anchor Y coordinate (where the object or feet meet the floor)
 * @param subLayerOffset Fine-grained offset (e.g. +1 for accessories attached to object)
 */
export function calculateDynamicDepth(groundY: number, subLayerOffset: number = 0): number {
  return DEPTH_LAYERS.DYNAMIC_Y_BASE + Math.floor(groundY) + subLayerOffset;
}

/**
 * Resolves static or dynamic depth from a semantic DepthClass and ground Y.
 */
export function resolveDepthForClass(
  depthClass: DepthClass,
  groundY: number = 0,
  subLayerOffset: number = 0
): number {
  switch (depthClass) {
    case 'background':
      return DEPTH_LAYERS.BACKGROUND + subLayerOffset;
    case 'floor':
      return DEPTH_LAYERS.FLOOR + subLayerOffset;
    case 'floor-decor':
      return DEPTH_LAYERS.FLOOR_DECOR + subLayerOffset;
    case 'back-wall':
      return DEPTH_LAYERS.BACK_WALL + subLayerOffset;
    case 'back-wall-detail':
      return DEPTH_LAYERS.BACK_WALL_DETAIL + subLayerOffset;
    case 'contact-shadow':
      return DEPTH_LAYERS.CONTACT_SHADOWS + subLayerOffset;
    case 'dynamic-solid':
      return calculateDynamicDepth(groundY, subLayerOffset);
    case 'foreground-structure':
      return DEPTH_LAYERS.FOREGROUND_STRUCTURE + subLayerOffset;
    case 'lighting':
      return DEPTH_LAYERS.LIGHTING_OVERLAY + subLayerOffset;
    case 'ui':
      return DEPTH_LAYERS.UI + subLayerOffset;
  }
}
