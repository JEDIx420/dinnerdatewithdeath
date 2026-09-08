/**
 * Physical footprint definition for environmental objects.
 * Defined relative to the object's ground anchor (bottom-center of contact footprint).
 */
export interface PhysicalFootprint {
  shape: 'rect';
  width: number;
  height: number;
  offsetX: number; // Offset from ground anchor X (typically 0 for bottom-center)
  offsetY: number; // Offset from ground anchor Y (e.g. -10 so 20px height spans -10..+10 around ground baseline)
}

export type CollisionProfileId =
  | 'none'
  | 'column_massive'
  | 'column_fluted'
  | 'column_wood'
  | 'half_column'
  | 'newel_large'
  | 'newel_small'
  | 'balustrade_horizontal_132'
  | 'balustrade_span_wide'
  | 'stair_barrier_side'
  | 'wall_edge_small'
  | 'door_jamb'
  | 'archway_support'
  | 'statue_base'
  | 'statue_large'
  | 'pedestal'
  | 'bed_large'
  | 'wardrobe_large'
  | 'vanity'
  | 'nightstand'
  | 'armchair'
  | 'sofa'
  | 'coffee_table'
  | 'dining_table_large'
  | 'dining_chair'
  | 'sideboard'
  | 'bookshelf'
  | 'tv_console'
  | 'bar_cart'
  | 'fireplace_hearth'
  | 'custom';

export interface CollisionProfile {
  id: CollisionProfileId;
  name: string;
  footprint: PhysicalFootprint;
}

export const COLLISION_PROFILES: Record<CollisionProfileId, CollisionProfile> = {
  none: {
    id: 'none',
    name: 'No Collision',
    footprint: { shape: 'rect', width: 0, height: 0, offsetX: 0, offsetY: 0 },
  },
  column_massive: {
    id: 'column_massive',
    name: 'Massive Stone Column Base',
    footprint: { shape: 'rect', width: 44, height: 22, offsetX: 0, offsetY: -10 },
  },
  column_fluted: {
    id: 'column_fluted',
    name: 'Fluted Column Base',
    footprint: { shape: 'rect', width: 34, height: 18, offsetX: 0, offsetY: -8 },
  },
  column_wood: {
    id: 'column_wood',
    name: 'Carved Wood Column Base',
    footprint: { shape: 'rect', width: 30, height: 18, offsetX: 0, offsetY: -8 },
  },
  half_column: {
    id: 'half_column',
    name: 'Engaged Half Column / Wall Pilaster Base',
    footprint: { shape: 'rect', width: 24, height: 18, offsetX: 0, offsetY: -8 },
  },
  newel_large: {
    id: 'newel_large',
    name: 'Large Stair Newel Post Base',
    footprint: { shape: 'rect', width: 28, height: 22, offsetX: 0, offsetY: -10 },
  },
  newel_small: {
    id: 'newel_small',
    name: 'Small Balustrade Post Base',
    footprint: { shape: 'rect', width: 22, height: 18, offsetX: 0, offsetY: -8 },
  },
  balustrade_horizontal_132: {
    id: 'balustrade_horizontal_132',
    name: 'Horizontal Balustrade Span (132px)',
    footprint: { shape: 'rect', width: 132, height: 24, offsetX: 0, offsetY: -12 },
  },
  balustrade_span_wide: {
    id: 'balustrade_span_wide',
    name: 'Continuous Overlook Balustrade Span',
    footprint: { shape: 'rect', width: 112, height: 26, offsetX: 0, offsetY: -12 },
  },
  stair_barrier_side: {
    id: 'stair_barrier_side',
    name: 'Staircase Lateral Guard Barrier',
    footprint: { shape: 'rect', width: 24, height: 240, offsetX: 0, offsetY: 0 },
  },
  wall_edge_small: {
    id: 'wall_edge_small',
    name: 'Wall Edge Barrier',
    footprint: { shape: 'rect', width: 24, height: 32, offsetX: 0, offsetY: 0 },
  },
  door_jamb: {
    id: 'door_jamb',
    name: 'Doorway Jamb Support',
    footprint: { shape: 'rect', width: 24, height: 24, offsetX: 0, offsetY: -10 },
  },
  archway_support: {
    id: 'archway_support',
    name: 'Archway Pier Support',
    footprint: { shape: 'rect', width: 32, height: 22, offsetX: 0, offsetY: -10 },
  },
  statue_base: {
    id: 'statue_base',
    name: 'Statue Plinth Footprint',
    footprint: { shape: 'rect', width: 36, height: 24, offsetX: 0, offsetY: -10 },
  },
  statue_large: {
    id: 'statue_large',
    name: 'Hero Stone Statue Plinth',
    footprint: { shape: 'rect', width: 48, height: 28, offsetX: 0, offsetY: -12 },
  },
  pedestal: {
    id: 'pedestal',
    name: 'Pedestal Plinth Base',
    footprint: { shape: 'rect', width: 28, height: 20, offsetX: 0, offsetY: -8 },
  },
  bed_large: {
    id: 'bed_large',
    name: 'Hero Grand Bed Footprint',
    footprint: { shape: 'rect', width: 104, height: 60, offsetX: 0, offsetY: -30 },
  },
  wardrobe_large: {
    id: 'wardrobe_large',
    name: 'Tall Carved Wardrobe Base',
    footprint: { shape: 'rect', width: 68, height: 28, offsetX: 0, offsetY: -12 },
  },
  vanity: {
    id: 'vanity',
    name: 'Gothic Vanity Console Base',
    footprint: { shape: 'rect', width: 64, height: 24, offsetX: 0, offsetY: -10 },
  },
  nightstand: {
    id: 'nightstand',
    name: 'Bedside Nightstand Base',
    footprint: { shape: 'rect', width: 28, height: 22, offsetX: 0, offsetY: -10 },
  },
  armchair: {
    id: 'armchair',
    name: 'Upholstered Armchair Seat Base',
    footprint: { shape: 'rect', width: 32, height: 24, offsetX: 0, offsetY: -10 },
  },
  sofa: {
    id: 'sofa',
    name: 'Hero Tufted Velvet Sofa Base',
    footprint: { shape: 'rect', width: 110, height: 32, offsetX: 0, offsetY: -14 },
  },
  coffee_table: {
    id: 'coffee_table',
    name: 'Lounge Coffee Table Base',
    footprint: { shape: 'rect', width: 56, height: 26, offsetX: 0, offsetY: -12 },
  },
  dining_table_large: {
    id: 'dining_table_large',
    name: 'Hero Banquet Dining Table Base',
    footprint: { shape: 'rect', width: 172, height: 44, offsetX: 0, offsetY: -20 },
  },
  dining_chair: {
    id: 'dining_chair',
    name: 'High-Back Dining Chair Base',
    footprint: { shape: 'rect', width: 24, height: 20, offsetX: 0, offsetY: -8 },
  },
  sideboard: {
    id: 'sideboard',
    name: 'Dining Sideboard Credenza Base',
    footprint: { shape: 'rect', width: 72, height: 24, offsetX: 0, offsetY: -10 },
  },
  bookshelf: {
    id: 'bookshelf',
    name: 'Tall Antique Bookshelf Base',
    footprint: { shape: 'rect', width: 48, height: 24, offsetX: 0, offsetY: -10 },
  },
  tv_console: {
    id: 'tv_console',
    name: 'Vintage TV Console Base',
    footprint: { shape: 'rect', width: 34, height: 22, offsetX: 0, offsetY: -10 },
  },
  bar_cart: {
    id: 'bar_cart',
    name: 'Drinks Trolley Base',
    footprint: { shape: 'rect', width: 32, height: 22, offsetX: 0, offsetY: -10 },
  },
  fireplace_hearth: {
    id: 'fireplace_hearth',
    name: 'Stone Fireplace Hearth Barrier',
    footprint: { shape: 'rect', width: 84, height: 30, offsetX: 0, offsetY: -12 },
  },
  custom: {
    id: 'custom',
    name: 'Custom Footprint',
    footprint: { shape: 'rect', width: 32, height: 32, offsetX: 0, offsetY: 0 },
  },
};

export function getCollisionProfile(id: CollisionProfileId): CollisionProfile {
  return COLLISION_PROFILES[id] ?? COLLISION_PROFILES.none;
}
