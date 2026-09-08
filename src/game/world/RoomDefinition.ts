import { Direction } from '../entities/CharacterManifest';
import { MANSION_ARCHITECTURE_ELEMENTS } from './mansionArchitectureDefs';
import { buildMansionPlacements } from '../environment/mansionPlacements';

export interface SafeBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface FloorRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  textureKey: string;
  depth?: number;
  isSprite?: boolean;
}

export interface WallSegment {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  textureKey: string;
  isPerimeter?: boolean;
  hasCollision?: boolean;
  // Visual rendering mode: 'render' (default), 'collision-only' (no visual sprite), 'backplate' (renders on BACK_WALL)
  visualMode?: 'render' | 'collision-only' | 'backplate';
  // Baseline where feet collide
  collisionOffsetY?: number;
  collisionHeight?: number;
}

export interface FurnitureDef {
  id: string;
  name: string;
  x: number;
  y: number;
  textureKey: string;
  originX?: number;
  originY?: number;
  depthOffset?: number;
  collision?: {
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  };
  shadow?: {
    textureKey: string;
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  };
}

export interface CandleDef {
  id: string;
  x: number;
  y: number;
  color?: number;
  radius?: number;
  intensity?: number;
  flameOffsetY?: number;
}

export interface WindowDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hasCurtains?: boolean;
}

export interface FireplaceDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: 'idle' | 'surge' | 'portal';
}

export interface StaircaseDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stepCount: number;
  stepTextureKey: string;
  balustradeLeftKey: string;
  balustradeRightKey: string;
  walkableWidth: number;
}

export interface ArchitecturalSpriteDef {
  id: string;
  textureKey: string;
  x: number;
  y: number;
  originX?: number;
  originY?: number;
  depth?: number;
  depthOffset?: number;
  flipX?: boolean;
  flipY?: boolean;
  scale?: number;
  collision?: {
    width: number;
    height: number;
    offsetX?: number;
    offsetY?: number;
  };
  zone?: string;
  role?: string;
}

import { EnvironmentPlacement } from '../environment/EnvironmentPlacement';

export interface RoomDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  safeBounds: SafeBounds;
  spawnPoint: {
    x: number;
    y: number;
    direction: Direction;
  };
  floors: FloorRegion[];
  walls: WallSegment[];
  architecture?: ArchitecturalSpriteDef[];
  environmentPlacements?: EnvironmentPlacement[];
  furniture: FurnitureDef[];
  candles: CandleDef[];
  windows: WindowDef[];
  staircase?: StaircaseDef;
  fireplace?: FireplaceDef;
}

/**
 * Grand Gothic Mansion Layout (Milestone v0.0.6.1)
 * Dimensions: 1280 x 960 (40 x 30 tiles of 32px).
 *
 * Vertical narrative journey across 5 story-driven zones:
 *
 * FIRST FLOOR (Private):
 * 1. Death's Bedchamber (Upper West: x: 48..448, y: 72..320)
 * 2. Upper Landing & Balustrade (Upper East: x: 448..832, y: 72..288)
 *
 * CONNECTOR:
 * 3. Grand Central Staircase (Hero Connector: x: 560..720, y: 260..548)
 *
 * GROUND FLOOR (Main Mansion):
 * 4. Great Hall / Central Gallery (Ground Center: x: 448..832, y: 520..920)
 * 5. Dining Room (Ground West: x: 48..448, y: 520..920)
 * 6. Lounge & Hearth (Ground East: x: 832..1232, y: 520..920)
 */
export const MANSION_ROOM_DEF: RoomDefinition = {
  id: 'death_mansion',
  name: "Death's Mansion",
  width: 1280,
  height: 960,
  safeBounds: {
    minX: 48,
    maxX: 1232,
    minY: 72,
    maxY: 912,
  },
  spawnPoint: {
    // Spawns upstairs in his private Bedchamber in front of the ornate mirror
    x: 200,
    y: 190,
    direction: 'up',
  },
  floors: [
    // 1. Bedchamber Floor (Dark patterned stone blocks)
    {
      id: 'dressing_floor',
      x: 48,
      y: 72,
      width: 400,
      height: 256,
      textureKey: 'floor_stone_blocks_dark',
    },
    // Bedchamber private deep violet rug
    {
      id: 'dressing_rug',
      x: 112,
      y: 128,
      width: 176,
      height: 144,
      textureKey: 'rug_dressing',
      depth: 200,
    },

    // 2. Upper Landing Floor (Dark wood planks)
    {
      id: 'landing_floor',
      x: 448,
      y: 72,
      width: 384,
      height: 216,
      textureKey: 'floor_wood_planks_dark',
    },
    // Upper Landing ceremonial runner
    {
      id: 'landing_rug',
      x: 448,
      y: 160,
      width: 384,
      height: 56,
      textureKey: 'carpet_crimson_border',
      depth: 200,
    },

    // 3. Great Hall Floor (Black veined polished marble)
    {
      id: 'hall_floor',
      x: 448,
      y: 520,
      width: 384,
      height: 400,
      textureKey: 'floor_marble_black_veined',
    },
    // Great Hall center compass medallion
    {
      id: 'hall_medallion',
      x: 584,
      y: 690,
      width: 112,
      height: 112,
      textureKey: 'floor_medallion_octagonal',
      depth: 200,
      isSprite: true,
    },

    // 4. Dining Room Floor (Dark mahogany wood planks)
    {
      id: 'dining_floor',
      x: 48,
      y: 520,
      width: 400,
      height: 400,
      textureKey: 'floor_wood_planks_dark',
    },
    // Dining Room crimson velvet area rug
    {
      id: 'dining_rug',
      x: 96,
      y: 592,
      width: 288,
      height: 256,
      textureKey: 'rug_dining',
      depth: 200,
    },

    // 5. Lounge Floor (Dark herringbone wood)
    {
      id: 'lounge_floor',
      x: 832,
      y: 520,
      width: 400,
      height: 400,
      textureKey: 'floor_herringbone_dark',
    },
    // Lounge fireside rug
    {
      id: 'lounge_rug',
      x: 920,
      y: 616,
      width: 240,
      height: 208,
      textureKey: 'rug_lounge',
      depth: 200,
    },
  ],

  architecture: MANSION_ARCHITECTURE_ELEMENTS,
  environmentPlacements: buildMansionPlacements(),

  staircase: {
    id: 'grand_staircase',
    x: 560,
    y: 260,
    width: 160,
    height: 288,
    stepCount: 9,
    stepTextureKey: 'staircase_step',
    balustradeLeftKey: 'staircase_balustrade_left',
    balustradeRightKey: 'staircase_balustrade_right',
    walkableWidth: 128,
  },

  walls: [
    // --- UPPER FLOOR WALLS ---
    // Bedchamber north wall
    {
      id: 'wall_bedchamber_north',
      x: 48,
      y: 0,
      width: 400,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    // Bedchamber west wall
    {
      id: 'wall_bedchamber_west',
      x: 0,
      y: 0,
      width: 48,
      height: 328,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 328,
    },
    // Bedchamber south wall
    {
      id: 'wall_bedchamber_south',
      x: 48,
      y: 320,
      width: 400,
      height: 48,
      textureKey: 'wall_architectural_south',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 48,
    },
    // Dividing wall between Bedchamber and Landing (with doorway in middle)
    {
      id: 'wall_divider_upper',
      x: 440,
      y: 0,
      width: 24,
      height: 128,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 128,
    },
    {
      id: 'wall_divider_lower',
      x: 440,
      y: 248,
      width: 24,
      height: 80,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 80,
    },

    // Upper Landing north wall
    {
      id: 'wall_landing_north',
      x: 448,
      y: 0,
      width: 384,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    // Upper Landing east wall
    {
      id: 'wall_landing_east',
      x: 832,
      y: 0,
      width: 48,
      height: 296,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 296,
    },

    // Upper Landing Balustrade Overlook (South edge of landing, flanking staircase)
    // Visual balustrades and newels are now authoritatively rendered via production architecture.
    // These segments remain as solid safety barriers so Death cannot walk through.
    {
      id: 'balustrade_overlook_left',
      x: 448,
      y: 268,
      width: 112,
      height: 28,
      textureKey: 'balustrade_rail',
      hasCollision: true,
      visualMode: 'collision-only',
      collisionOffsetY: 0,
      collisionHeight: 28,
    },
    {
      id: 'balustrade_overlook_right',
      x: 720,
      y: 268,
      width: 112,
      height: 28,
      textureKey: 'balustrade_rail',
      hasCollision: true,
      visualMode: 'collision-only',
      collisionOffsetY: 0,
      collisionHeight: 28,
    },

    // --- STAIRCASE COLLISION BARRIERS (keep player on runner) ---
    {
      id: 'stair_barrier_left',
      x: 544,
      y: 288,
      width: 24,
      height: 240,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      visualMode: 'collision-only',
      collisionOffsetY: 0,
      collisionHeight: 240,
    },
    {
      id: 'stair_barrier_right',
      x: 712,
      y: 288,
      width: 24,
      height: 240,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      visualMode: 'collision-only',
      collisionOffsetY: 0,
      collisionHeight: 240,
    },

    // --- GROUND FLOOR WALLS ---
    // Dining Room north wall
    {
      id: 'wall_dining_north',
      x: 48,
      y: 448,
      width: 400,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    // Dining Room west wall
    {
      id: 'wall_dining_west',
      x: 0,
      y: 448,
      width: 48,
      height: 472,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 472,
    },
    // Dining Room south wall
    {
      id: 'wall_dining_south',
      x: 48,
      y: 912,
      width: 400,
      height: 48,
      textureKey: 'wall_architectural_south',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 48,
    },

    // Great Hall north wall (flanking staircase base)
    {
      id: 'wall_hall_north_left',
      x: 448,
      y: 448,
      width: 112,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    {
      id: 'wall_hall_north_right',
      x: 720,
      y: 448,
      width: 112,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    // Great Hall south wall
    {
      id: 'wall_hall_south',
      x: 448,
      y: 912,
      width: 384,
      height: 48,
      textureKey: 'wall_architectural_south',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 48,
    },

    // Lounge north wall
    {
      id: 'wall_lounge_north',
      x: 832,
      y: 448,
      width: 400,
      height: 96,
      textureKey: 'wall_architectural_north',
      hasCollision: true,
      collisionOffsetY: 72,
      collisionHeight: 24,
    },
    // Lounge east wall
    {
      id: 'wall_lounge_east',
      x: 1232,
      y: 448,
      width: 48,
      height: 472,
      textureKey: 'wall_architectural_side',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 472,
    },
    // Lounge south wall
    {
      id: 'wall_lounge_south',
      x: 832,
      y: 912,
      width: 400,
      height: 48,
      textureKey: 'wall_architectural_south',
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 48,
    },

    // Architectural Archway Pilasters separating rooms on Ground Floor
    // These remain as collision barriers for doorway support
    {
      id: 'pilaster_dining_hall_top',
      x: 440,
      y: 544,
      width: 24,
      height: 32,
      textureKey: 'wall_pilaster',
      hasCollision: true,
      visualMode: 'collision-only',
    },
    {
      id: 'pilaster_dining_hall_bottom',
      x: 440,
      y: 864,
      width: 24,
      height: 32,
      textureKey: 'wall_pilaster',
      hasCollision: true,
      visualMode: 'collision-only',
    },
    {
      id: 'pilaster_hall_lounge_top',
      x: 824,
      y: 544,
      width: 24,
      height: 32,
      textureKey: 'wall_pilaster',
      hasCollision: true,
      visualMode: 'collision-only',
    },
    {
      id: 'pilaster_hall_lounge_bottom',
      x: 824,
      y: 864,
      width: 24,
      height: 32,
      textureKey: 'wall_pilaster',
      hasCollision: true,
      visualMode: 'collision-only',
    },
  ],

  windows: [
    // 1. Bedchamber Window (North-west)
    {
      id: 'win_bedchamber',
      x: 300,
      y: 8,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    // 2. Dining Room Windows (North-west ground)
    {
      id: 'win_dining_1',
      x: 160,
      y: 456,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    {
      id: 'win_dining_2',
      x: 340,
      y: 456,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    // 3. Lounge Window (North-east ground)
    {
      id: 'win_lounge',
      x: 1150,
      y: 456,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
  ],

  furniture: [
    // -----------------------------------------------------------
    // BEDCHAMBER FURNITURE
    // -----------------------------------------------------------
    // Ornate Gothic Mirror (Hero Focal Point of Bedchamber)
    {
      id: 'dressing_mirror',
      name: 'Grand Ornate Gothic Mirror',
      x: 200,
      y: 84,
      textureKey: 'furniture_mirror_ornate',
      depthOffset: -10,
    },
    // Carved Vanity Console
    {
      id: 'dressing_vanity',
      name: 'Carved Vanity Console',
      x: 200,
      y: 116,
      textureKey: 'furniture_vanity',
      depthOffset: 12,
      collision: {
        width: 60,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 72,
        height: 22,
        offsetY: 20,
      },
    },
    // Antique Wardrobe
    {
      id: 'dressing_wardrobe',
      name: 'Carved Antique Wardrobe',
      x: 100,
      y: 112,
      textureKey: 'furniture_wardrobe',
      depthOffset: 20,
      collision: {
        width: 52,
        height: 28,
        offsetY: 28,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 64,
        height: 22,
        offsetY: 42,
      },
    },
    // Bedside Nightstand
    {
      id: 'dressing_bedside',
      name: 'Dark Mahogany Nightstand',
      x: 370,
      y: 116,
      textureKey: 'furniture_bedside',
      depthOffset: 8,
      collision: {
        width: 28,
        height: 20,
        offsetY: 8,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 36,
        height: 14,
        offsetY: 16,
      },
    },
    // Plush Armchair in bedroom
    {
      id: 'dressing_armchair',
      name: 'Gothic Dressing Armchair',
      x: 380,
      y: 200,
      textureKey: 'furniture_armchair',
      depthOffset: 12,
      collision: {
        width: 40,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 44,
        height: 18,
        offsetY: 20,
      },
    },

    // -----------------------------------------------------------
    // UPPER LANDING FURNITURE & ARTWORK
    // -----------------------------------------------------------
    {
      id: 'landing_art_portrait',
      name: 'Portrait of an Aristocratic Silhouette',
      x: 580,
      y: 48,
      textureKey: 'decor_art_portrait',
      depthOffset: -100,
    },
    {
      id: 'landing_art_memento',
      name: 'Memento Mori Study',
      x: 700,
      y: 48,
      textureKey: 'decor_art_memento_mori',
      depthOffset: -100,
    },
    // Newel posts at landing entrance
    {
      id: 'landing_newel_left',
      name: 'Staircase Newel Post',
      x: 560,
      y: 256,
      textureKey: 'staircase_newel',
      depthOffset: 20,
      collision: {
        width: 16,
        height: 16,
        offsetY: 12,
      },
    },
    {
      id: 'landing_newel_right',
      name: 'Staircase Newel Post',
      x: 720,
      y: 256,
      textureKey: 'staircase_newel',
      depthOffset: 20,
      collision: {
        width: 16,
        height: 16,
        offsetY: 12,
      },
    },

    // -----------------------------------------------------------
    // GREAT HALL ARTWORK & CHANDELIER
    // -----------------------------------------------------------
    {
      id: 'hall_chandelier',
      name: 'Grand Gothic Chandelier',
      x: 640,
      y: 560,
      textureKey: 'decor_chandelier',
      depthOffset: 500, // Overhead fixture
    },
    {
      id: 'hall_art_celestial',
      name: 'Celestial Chart of the Spheres',
      x: 504,
      y: 496,
      textureKey: 'decor_art_celestial',
      depthOffset: -100,
    },
    {
      id: 'hall_art_battlefield',
      name: 'Study of a Distant Battlefield',
      x: 776,
      y: 496,
      textureKey: 'decor_art_battlefield',
      depthOffset: -100,
    },
    // Newel posts at foot of staircase
    {
      id: 'stair_newel_bottom_left',
      name: 'Staircase Bottom Newel Post',
      x: 560,
      y: 536,
      textureKey: 'staircase_newel',
      depthOffset: 20,
      collision: {
        width: 16,
        height: 16,
        offsetY: 12,
      },
    },
    {
      id: 'stair_newel_bottom_right',
      name: 'Staircase Bottom Newel Post',
      x: 720,
      y: 536,
      textureKey: 'staircase_newel',
      depthOffset: 20,
      collision: {
        width: 16,
        height: 16,
        offsetY: 12,
      },
    },

    // -----------------------------------------------------------
    // HERO DINING ROOM FURNITURE
    // -----------------------------------------------------------
    // Hero Banquet Dining Table set for Love & Death
    {
      id: 'dining_table',
      name: 'The Banquet Table',
      x: 240,
      y: 720,
      textureKey: 'furniture_dining_table',
      depthOffset: 16,
      collision: {
        width: 160,
        height: 32,
        offsetY: 16,
      },
      shadow: {
        textureKey: 'shadow_table_hero',
        width: 180,
        height: 32,
        offsetY: 28,
      },
    },
    // Love's Empty Chair (Waiting on Left)
    {
      id: 'dining_chair_love',
      name: "Love's Empty Chair",
      x: 130,
      y: 710,
      textureKey: 'furniture_chair_love',
      depthOffset: 12,
      collision: {
        width: 24,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 32,
        height: 14,
        offsetY: 18,
      },
    },
    // Death's Chair (Waiting on Right)
    {
      id: 'dining_chair_death',
      name: "Death's High-Backed Chair",
      x: 350,
      y: 710,
      textureKey: 'furniture_chair_death',
      depthOffset: 12,
      collision: {
        width: 24,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 32,
        height: 14,
        offsetY: 20,
      },
    },

    // Wine Sideboard / Credenza
    {
      id: 'dining_sideboard',
      name: 'Carved Credenza Sideboard',
      x: 240,
      y: 536,
      textureKey: 'furniture_sideboard',
      depthOffset: 16,
      collision: {
        width: 44,
        height: 24,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 52,
        height: 16,
        offsetY: 24,
      },
    },

    // -----------------------------------------------------------
    // LOUNGE & HEARTH FURNITURE
    // -----------------------------------------------------------
    // Gothic Fireplace Hearth
    {
      id: 'lounge_fireplace',
      name: 'Gothic Hearth Fireplace',
      x: 1040,
      y: 520,
      textureKey: 'furniture_fireplace',
      depthOffset: 20,
      collision: {
        width: 90,
        height: 36,
        offsetY: 20,
      },
      shadow: {
        textureKey: 'shadow_furniture_large',
        width: 104,
        height: 24,
        offsetY: 38,
      },
    },
    // Velvet Sofa
    {
      id: 'lounge_sofa',
      name: 'Tufted Velvet Sofa',
      x: 1040,
      y: 740,
      textureKey: 'furniture_sofa',
      depthOffset: 16,
      collision: {
        width: 90,
        height: 28,
        offsetY: 8,
      },
      shadow: {
        textureKey: 'shadow_furniture_large',
        width: 102,
        height: 22,
        offsetY: 22,
      },
    },
    // Velvet Armchair
    {
      id: 'lounge_armchair',
      name: 'Plush Velvet Armchair',
      x: 910,
      y: 690,
      textureKey: 'furniture_armchair',
      depthOffset: 12,
      collision: {
        width: 40,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 44,
        height: 18,
        offsetY: 20,
      },
    },
    // Coffee Table with Book & Ashtray
    {
      id: 'lounge_coffee_table',
      name: 'Low Mahogany Coffee Table',
      x: 1040,
      y: 670,
      textureKey: 'furniture_coffee_table',
      depthOffset: 10,
      collision: {
        width: 58,
        height: 20,
        offsetY: 6,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 68,
        height: 18,
        offsetY: 14,
      },
    },
    // Ancient Bookshelf
    {
      id: 'lounge_bookshelf',
      name: 'Ancient Leather-Bound Bookshelf',
      x: 880,
      y: 530,
      textureKey: 'furniture_bookshelf',
      depthOffset: 16,
      collision: {
        width: 60,
        height: 26,
        offsetY: 28,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 70,
        height: 20,
        offsetY: 42,
      },
    },
    // Vintage TV Console
    {
      id: 'lounge_tv',
      name: 'Vintage TV Console',
      x: 1190,
      y: 690,
      textureKey: 'furniture_tv_console',
      depthOffset: 12,
      collision: {
        width: 42,
        height: 24,
        offsetY: 8,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 46,
        height: 16,
        offsetY: 18,
      },
    },
    // Antique Maritime Map on Lounge wall
    {
      id: 'lounge_art_map',
      name: 'Antique Maritime Map',
      x: 970,
      y: 496,
      textureKey: 'decor_art_map',
      depthOffset: -100,
    },
  ],

  candles: [
    // --- Bedchamber Candles (Quiet, warm, intimate) ---
    { id: 'candle_vanity_l', x: 172, y: 102, radius: 44, intensity: 0.35 },
    { id: 'candle_vanity_r', x: 228, y: 102, radius: 44, intensity: 0.35 },
    { id: 'candle_bedside', x: 370, y: 102, radius: 40, intensity: 0.3 },

    // --- Upper Landing Sconces (Ceremonial) ---
    { id: 'sconce_landing_1', x: 500, y: 78, radius: 46, intensity: 0.35 },
    { id: 'sconce_landing_2', x: 640, y: 78, radius: 46, intensity: 0.35 },
    { id: 'sconce_landing_3', x: 780, y: 78, radius: 46, intensity: 0.35 },

    // --- Great Hall Candelabras & Chandelier ---
    { id: 'candle_chandelier', x: 640, y: 560, radius: 75, intensity: 0.45 },
    { id: 'candle_hall_foot_l', x: 540, y: 540, radius: 45, intensity: 0.35 },
    { id: 'candle_hall_foot_r', x: 740, y: 540, radius: 45, intensity: 0.35 },

    // --- Dining Room Candles (Hero romantic table) ---
    { id: 'candle_table_l', x: 192, y: 692, radius: 52, intensity: 0.45 },
    { id: 'candle_table_r', x: 288, y: 692, radius: 52, intensity: 0.45 },
    { id: 'candle_sideboard', x: 240, y: 520, radius: 40, intensity: 0.3 },

    // --- Lounge Candles ---
    { id: 'candle_hearth_l', x: 1005, y: 495, radius: 42, intensity: 0.35 },
    { id: 'candle_hearth_r', x: 1075, y: 495, radius: 42, intensity: 0.35 },
    { id: 'candle_coffee_table', x: 1040, y: 658, radius: 42, intensity: 0.35 },
  ],

  fireplace: {
    id: 'main_fireplace',
    x: 1040,
    y: 520,
    width: 96,
    height: 80,
    state: 'idle',
  },
};
