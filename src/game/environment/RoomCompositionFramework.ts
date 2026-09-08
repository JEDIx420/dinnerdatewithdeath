/**
 * RoomCompositionFramework.ts
 *
 * Reusable architectural guidelines, spatial budgets, and placement anchors
 * for mansion rooms. Prevents over-decoration, ensures generous gameplay walkability,
 * preserves architectural sightlines, and strictly enforces keep-clear zones.
 */

export type RoomZone = 'bedchamber' | 'upper_landing' | 'great_hall' | 'dining_room' | 'lounge';

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WallBayDef {
  id: string;
  zone: RoomZone;
  name: string;
  bounds: RectBounds;
  centerMount: { x: number; y: number };
  allowedRoles: ('art' | 'window' | 'sconce' | 'niche' | 'wainscot' | 'panel')[];
}

export interface FurnitureAnchorDef {
  id: string;
  zone: RoomZone;
  name: string;
  anchor: { x: number; y: number };
  role: string;
  maxScale: number;
  clearanceBox: RectBounds;
}

export interface KeepClearZoneDef {
  id: string;
  zone: RoomZone;
  name: string;
  bounds: RectBounds;
  reason: 'stair_arrival' | 'door_threshold' | 'main_corridor' | 'balustrade_mouth';
}

export interface RoomBudget {
  zone: RoomZone;
  maxHero: number;
  maxSupport: number;
  maxAccent: number;
  description: string;
}

/**
 * Pre-defined Wall Bays for valid wall mounting.
 * Paintings, windows, and sconces must anchor to these bays, preventing floating props.
 */
export const MANSION_WALL_BAYS: WallBayDef[] = [
  // --- BEDCHAMBER (North Wall: y: 8..88) ---
  {
    id: 'bay_bedchamber_window',
    zone: 'bedchamber',
    name: 'Bedchamber West Window Bay',
    bounds: { x: 70, y: 16, width: 80, height: 80 },
    centerMount: { x: 100, y: 75 },
    allowedRoles: ['window', 'sconce'],
  },
  {
    id: 'bay_bedchamber_vanity_art',
    zone: 'bedchamber',
    name: 'Bedchamber Vanity Wall Bay',
    bounds: { x: 290, y: 20, width: 70, height: 60 },
    centerMount: { x: 320, y: 55 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_bedchamber_hallway_edge',
    zone: 'bedchamber',
    name: 'Bedchamber Hallway Edge Art Bay',
    bounds: { x: 400, y: 20, width: 40, height: 60 },
    centerMount: { x: 420, y: 60 },
    allowedRoles: ['art', 'sconce'],
  },

  // --- UPPER LANDING (North Wall: y: 8..88, Axis X: 640) ---
  {
    id: 'bay_landing_sconce_west',
    zone: 'upper_landing',
    name: 'Landing West Sconce Bay',
    bounds: { x: 520, y: 40, width: 30, height: 45 },
    centerMount: { x: 530, y: 88 },
    allowedRoles: ['sconce'],
  },
  {
    id: 'bay_landing_art_west',
    zone: 'upper_landing',
    name: 'Landing West Portrait Bay',
    bounds: { x: 555, y: 20, width: 50, height: 65 },
    centerMount: { x: 575, y: 60 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_landing_art_east',
    zone: 'upper_landing',
    name: 'Landing East Portrait Bay',
    bounds: { x: 675, y: 20, width: 50, height: 65 },
    centerMount: { x: 705, y: 60 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_landing_sconce_east',
    zone: 'upper_landing',
    name: 'Landing East Sconce Bay',
    bounds: { x: 730, y: 40, width: 30, height: 45 },
    centerMount: { x: 750, y: 88 },
    allowedRoles: ['sconce'],
  },

  // --- GREAT HALL (Upper Wall: y: 410..475) ---
  {
    id: 'bay_hall_art_west',
    zone: 'great_hall',
    name: 'Great Hall Flanking Art West',
    bounds: { x: 500, y: 415, width: 50, height: 60 },
    centerMount: { x: 520, y: 465 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_hall_niche_center',
    zone: 'great_hall',
    name: 'Great Hall Central Niche',
    bounds: { x: 620, y: 420, width: 40, height: 50 },
    centerMount: { x: 640, y: 466 },
    allowedRoles: ['niche', 'art'],
  },
  {
    id: 'bay_hall_art_east',
    zone: 'great_hall',
    name: 'Great Hall Flanking Art East',
    bounds: { x: 730, y: 415, width: 50, height: 60 },
    centerMount: { x: 760, y: 465 },
    allowedRoles: ['art'],
  },

  // --- DINING ROOM (North Wall: y: 420..490) ---
  {
    id: 'bay_dining_window_west',
    zone: 'dining_room',
    name: 'Dining West Arched Window',
    bounds: { x: 70, y: 420, width: 70, height: 80 },
    centerMount: { x: 105, y: 465 },
    allowedRoles: ['window'],
  },
  {
    id: 'bay_dining_still_life',
    zone: 'dining_room',
    name: 'Dining Feast Still Life Above Credenza',
    bounds: { x: 200, y: 415, width: 80, height: 60 },
    centerMount: { x: 240, y: 445 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_dining_window_east',
    zone: 'dining_room',
    name: 'Dining East Arched Window',
    bounds: { x: 340, y: 420, width: 70, height: 80 },
    centerMount: { x: 375, y: 465 },
    allowedRoles: ['window'],
  },

  // --- LOUNGE (North Wall: y: 410..490) ---
  {
    id: 'bay_lounge_mantle_art',
    zone: 'lounge',
    name: 'Lounge Over-Mantle Ghost Ship Art',
    bounds: { x: 1000, y: 415, width: 80, height: 65 },
    centerMount: { x: 1040, y: 435 },
    allowedRoles: ['art'],
  },
  {
    id: 'bay_lounge_window_east',
    zone: 'lounge',
    name: 'Lounge East Window Bay',
    bounds: { x: 1140, y: 420, width: 70, height: 80 },
    centerMount: { x: 1175, y: 465 },
    allowedRoles: ['window'],
  },
];

/**
 * Pre-defined Keep-Clear Zones.
 * Any decorative or casual prop intersecting these boxes is illegal and discarded.
 */
export const MANSION_KEEP_CLEAR_ZONES: KeepClearZoneDef[] = [
  // 1. Great Hall Staircase Throat & Arrival (must be 100% open for player walkability)
  {
    id: 'keep_clear_hall_stair_arrival',
    zone: 'great_hall',
    name: 'Great Hall Staircase Arrival Keep-Clear',
    bounds: { x: 550, y: 510, width: 180, height: 95 },
    reason: 'stair_arrival',
  },
  // 2. Landing Staircase Mouth (between terminal newels)
  {
    id: 'keep_clear_landing_mouth',
    zone: 'upper_landing',
    name: 'Upper Landing Staircase Entrance Keep-Clear',
    bounds: { x: 570, y: 220, width: 140, height: 60 },
    reason: 'balustrade_mouth',
  },
  // 3. Bedchamber Doorway Passage (connecting Bedchamber and Landing)
  {
    id: 'keep_clear_bedchamber_doorway',
    zone: 'bedchamber',
    name: 'Bedchamber Doorway Walkway',
    bounds: { x: 410, y: 140, width: 60, height: 100 },
    reason: 'door_threshold',
  },
  // 4. Dining Room Portal Passage into Great Hall
  {
    id: 'keep_clear_dining_portal',
    zone: 'dining_room',
    name: 'Dining Room to Great Hall Threshold',
    bounds: { x: 410, y: 600, width: 60, height: 260 },
    reason: 'door_threshold',
  },
  // 5. Great Hall to Lounge Portal Passage
  {
    id: 'keep_clear_lounge_portal',
    zone: 'lounge',
    name: 'Great Hall to Lounge Threshold',
    bounds: { x: 800, y: 600, width: 60, height: 260 },
    reason: 'door_threshold',
  },
];

/**
 * Pre-defined Furniture Anchors.
 * Major hero & support objects must snap to these logical locations.
 */
export const MANSION_FURNITURE_ANCHORS: FurnitureAnchorDef[] = [
  // --- BEDCHAMBER ---
  {
    id: 'anchor_bedchamber_bed',
    zone: 'bedchamber',
    name: 'Bedchamber Grand Four-Poster Bed',
    anchor: { x: 170, y: 350 },
    role: 'bed',
    maxScale: 0.68,
    clearanceBox: { x: 90, y: 240, width: 160, height: 120 },
  },
  {
    id: 'anchor_bedchamber_wardrobe',
    zone: 'bedchamber',
    name: 'Bedchamber Tall Wardrobe',
    anchor: { x: 215, y: 135 },
    role: 'wardrobe',
    maxScale: 0.55,
    clearanceBox: { x: 180, y: 70, width: 70, height: 75 },
  },
  {
    id: 'anchor_bedchamber_vanity',
    zone: 'bedchamber',
    name: 'Bedchamber Dressing Vanity',
    anchor: { x: 320, y: 135 },
    role: 'vanity',
    maxScale: 0.55,
    clearanceBox: { x: 285, y: 70, width: 70, height: 75 },
  },
  {
    id: 'anchor_bedchamber_sitting_corner',
    zone: 'bedchamber',
    name: 'Bedchamber Left Sitting Corner Chair',
    anchor: { x: 95, y: 230 },
    role: 'armchair',
    maxScale: 0.45,
    clearanceBox: { x: 70, y: 190, width: 50, height: 50 },
  },
  {
    id: 'anchor_bedchamber_nightstand',
    zone: 'bedchamber',
    name: 'Bedchamber Bedside Nightstand',
    anchor: { x: 275, y: 340 },
    role: 'nightstand',
    maxScale: 0.42,
    clearanceBox: { x: 255, y: 300, width: 40, height: 45 },
  },

  // --- DINING ROOM ---
  {
    id: 'anchor_dining_table',
    zone: 'dining_room',
    name: 'Hero Banquet Dining Table',
    anchor: { x: 240, y: 720 },
    role: 'banquet_table',
    maxScale: 0.75,
    clearanceBox: { x: 150, y: 660, width: 180, height: 70 },
  },
  {
    id: 'anchor_dining_sideboard',
    zone: 'dining_room',
    name: 'Dining Room Oak Wine Cabinet',
    anchor: { x: 240, y: 530 },
    role: 'sideboard',
    maxScale: 0.55,
    clearanceBox: { x: 200, y: 470, width: 80, height: 70 },
  },
  {
    id: 'anchor_dining_couch_fear',
    zone: 'dining_room',
    name: 'Dining Room Fear Velvet Chaise Lounge',
    anchor: { x: 110, y: 840 },
    role: 'sofa_fear',
    maxScale: 0.46,
    clearanceBox: { x: 65, y: 790, width: 90, height: 60 },
  },

  // --- LOUNGE ---
  {
    id: 'anchor_lounge_hearth',
    zone: 'lounge',
    name: 'Lounge Hero Stone Fireplace Hearth',
    anchor: { x: 1040, y: 525 },
    role: 'fireplace',
    maxScale: 0.85,
    clearanceBox: { x: 990, y: 450, width: 100, height: 80 },
  },
  {
    id: 'anchor_lounge_sofa',
    zone: 'lounge',
    name: 'Lounge 3-Seater Velvet Sofa',
    anchor: { x: 1040, y: 740 },
    role: 'sofa',
    maxScale: 0.52,
    clearanceBox: { x: 970, y: 690, width: 140, height: 60 },
  },
  {
    id: 'anchor_lounge_armchair',
    zone: 'lounge',
    name: 'Lounge Fireside Armchair',
    anchor: { x: 920, y: 690 },
    role: 'armchair',
    maxScale: 0.44,
    clearanceBox: { x: 885, y: 645, width: 70, height: 55 },
  },
  {
    id: 'anchor_lounge_coffee_table',
    zone: 'lounge',
    name: 'Lounge Coffee Table with Candelabra & Book',
    anchor: { x: 1040, y: 665 },
    role: 'coffee_table',
    maxScale: 0.46,
    clearanceBox: { x: 995, y: 630, width: 90, height: 45 },
  },
  {
    id: 'anchor_lounge_bookshelf',
    zone: 'lounge',
    name: 'Lounge Tall Bookshelf with Globe',
    anchor: { x: 890, y: 530 },
    role: 'bookshelf',
    maxScale: 0.52,
    clearanceBox: { x: 855, y: 460, width: 70, height: 75 },
  },
  {
    id: 'anchor_lounge_tv',
    zone: 'lounge',
    name: 'Lounge Vintage Retro TV Console',
    anchor: { x: 1190, y: 690 },
    role: 'tv',
    maxScale: 0.44,
    clearanceBox: { x: 1150, y: 645, width: 80, height: 55 },
  },
];

/**
 * Strict Room Density Budgets.
 * Enforces visual restraint and prevents dollhouse/catalogue overcrowding.
 */
export const MANSION_ROOM_BUDGETS: Record<RoomZone, RoomBudget> = {
  bedchamber: {
    zone: 'bedchamber',
    maxHero: 1, // Bed
    maxSupport: 4, // Wardrobe, Vanity, Armchair, Nightstand
    maxAccent: 3, // Window, Wall Art, Candle
    description: 'Private, quiet gothic elegance. Sitting corner away from entrance.',
  },
  upper_landing: {
    zone: 'upper_landing',
    maxHero: 0, // Architecture and balustrade dominate
    maxSupport: 2, // Symmetrical balustrades, terminal newels
    maxAccent: 4, // 2 Sconces, 2 Fine Art portraits
    description: 'Ceremonial, open overlook. Pure symmetry around staircase axis.',
  },
  great_hall: {
    zone: 'great_hall',
    maxHero: 1, // Central Overhead Chandelier
    maxSupport: 4, // 4 Massive columns
    maxAccent: 4, // 2 Wall art pieces, arrival newels, niche
    description: 'Grand, imposing, monumental. Stair arrival keep-clear zone.',
  },
  dining_room: {
    zone: 'dining_room',
    maxHero: 1, // Clean Banquet Table
    maxSupport: 4, // 2 Chairs, Fear Chaise Lounge, Sideboard
    maxAccent: 4, // 2 Windows, Table Candelabra, Feast Art
    description: 'Intimate formal dinner for two. Dedicated chaise for Fear.',
  },
  lounge: {
    zone: 'lounge',
    maxHero: 1, // Lit Stone Hearth Fireplace
    maxSupport: 4, // Sofa, Armchair, Coffee Table, Bookshelf
    maxAccent: 4, // Firewood Basket, TV Console, Ghost Ship Art, Window
    description: 'Cozy, warm hearth focal point with generous walking room.',
  },
};

/**
 * Validates that an object does not trespass into any Keep-Clear Zone.
 */
export function isKeepClearViolation(x: number, y: number, width: number = 32, height: number = 32): boolean {
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;

  for (const zone of MANSION_KEEP_CLEAR_ZONES) {
    const b = zone.bounds;
    const intersects =
      left < b.x + b.width &&
      right > b.x &&
      top < b.y + b.height &&
      bottom > b.y;

    if (intersects) {
      return true;
    }
  }
  return false;
}
