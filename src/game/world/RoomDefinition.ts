import { Direction } from '../entities/CharacterManifest';

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
  furniture: FurnitureDef[];
  candles: CandleDef[];
  windows: WindowDef[];
  fireplace?: FireplaceDef;
}

/**
 * Canonical Mansion Layout (Milestone v0.0.6)
 * Total dimensions: 1152 x 640 (36 x 20 tiles of 32px).
 * Features three contiguous zones:
 * 1. Dressing / Mirror Area (North-West)
 * 2. Grand Dining Hall (Central)
 * 3. Lounge & Fireplace Area (East)
 */
export const MANSION_ROOM_DEF: RoomDefinition = {
  id: 'death_mansion',
  name: "Death's Mansion",
  width: 1152,
  height: 640,
  safeBounds: {
    minX: 64,
    maxX: 1088,
    minY: 104,
    maxY: 572,
  },
  spawnPoint: {
    x: 200,
    y: 220,
    direction: 'down',
  },
  floors: [
    // Grand Dining Hall floor (rich dark hardwood planks)
    {
      id: 'dining_floor',
      x: 368,
      y: 96,
      width: 416,
      height: 496,
      textureKey: 'tile_wood_floor',
    },
    // Dining Hall crimson velvet runner / area rug
    {
      id: 'dining_rug',
      x: 432,
      y: 208,
      width: 288,
      height: 256,
      textureKey: 'rug_dining',
      depth: 200,
    },
    // Dressing Area floor (dark slate patterned tiles)
    {
      id: 'dressing_floor',
      x: 48,
      y: 96,
      width: 320,
      height: 288,
      textureKey: 'tile_stone_dressing',
    },
    // Dressing Area ornate purple velvet rug
    {
      id: 'dressing_rug',
      x: 112,
      y: 176,
      width: 176,
      height: 144,
      textureKey: 'rug_dressing',
      depth: 200,
    },
    // Lounge floor (dark oak parquet planks)
    {
      id: 'lounge_floor',
      x: 784,
      y: 96,
      width: 320,
      height: 496,
      textureKey: 'tile_wood_floor',
    },
    // Lounge velvet fireside rug
    {
      id: 'lounge_rug',
      x: 816,
      y: 272,
      width: 240,
      height: 208,
      textureKey: 'rug_lounge',
      depth: 200,
    },
  ],
  walls: [
    // North perimeter wall (with architectural height from y=0 to y=96)
    {
      id: 'north_wall',
      x: 32,
      y: 0,
      width: 1088,
      height: 96,
      textureKey: 'wall_architectural_north',
      isPerimeter: true,
      hasCollision: true,
      collisionOffsetY: 64,
      collisionHeight: 32,
    },
    // South perimeter wall
    {
      id: 'south_wall',
      x: 32,
      y: 592,
      width: 1088,
      height: 48,
      textureKey: 'wall_architectural_south',
      isPerimeter: true,
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 48,
    },
    // West perimeter wall
    {
      id: 'west_wall',
      x: 0,
      y: 0,
      width: 48,
      height: 640,
      textureKey: 'wall_architectural_side',
      isPerimeter: true,
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 640,
    },
    // East perimeter wall
    {
      id: 'east_wall',
      x: 1104,
      y: 0,
      width: 48,
      height: 640,
      textureKey: 'wall_architectural_side',
      isPerimeter: true,
      hasCollision: true,
      collisionOffsetY: 0,
      collisionHeight: 640,
    },
    // Dividing wall between Dressing and Dining (with open archway between Y=176 and Y=288)
    {
      id: 'divider_dressing_dining_top',
      x: 352,
      y: 96,
      width: 24,
      height: 80,
      textureKey: 'wall_pilaster',
      hasCollision: true,
    },
    {
      id: 'divider_dressing_dining_bottom',
      x: 352,
      y: 288,
      width: 24,
      height: 96,
      textureKey: 'wall_pilaster',
      hasCollision: true,
    },
    // Dividing wall between Dining and Lounge (with archway between Y=208 and Y=384)
    {
      id: 'divider_dining_lounge_top',
      x: 772,
      y: 96,
      width: 24,
      height: 112,
      textureKey: 'wall_pilaster',
      hasCollision: true,
    },
    {
      id: 'divider_dining_lounge_bottom',
      x: 772,
      y: 384,
      width: 24,
      height: 208,
      textureKey: 'wall_pilaster',
      hasCollision: true,
    },
  ],
  windows: [
    // Tall gothic arched windows on the north wall of Dining Hall
    {
      id: 'window_dining_left',
      x: 448,
      y: 16,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    {
      id: 'window_dining_right',
      x: 640,
      y: 16,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    // Gothic window in Dressing area
    {
      id: 'window_dressing',
      x: 112,
      y: 16,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
    // Gothic window in Lounge area
    {
      id: 'window_lounge',
      x: 880,
      y: 16,
      width: 64,
      height: 88,
      hasCurtains: true,
    },
  ],
  furniture: [
    // 1. DRESSING / MIRROR AREA
    // Grand Ornate Gothic Mirror (anchored on north wall)
    {
      id: 'dressing_mirror',
      name: 'Ornate Gothic Mirror',
      x: 224,
      y: 84,
      textureKey: 'furniture_mirror_ornate',
      depthOffset: 16,
      collision: {
        width: 48,
        height: 24,
        offsetY: 48,
      },
    },
    // Carved Dark Vanity Console under/beside mirror
    {
      id: 'dressing_vanity',
      name: 'Dressing Vanity',
      x: 224,
      y: 128,
      textureKey: 'furniture_vanity',
      depthOffset: 20,
      collision: {
        width: 64,
        height: 24,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 68,
        height: 18,
        offsetY: 20,
      },
    },
    // Tall Antique Wardrobe
    {
      id: 'dressing_wardrobe',
      name: 'Carved Wardrobe',
      x: 96,
      y: 140,
      textureKey: 'furniture_wardrobe',
      depthOffset: 36,
      collision: {
        width: 56,
        height: 32,
        offsetY: 28,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 60,
        height: 20,
        offsetY: 40,
      },
    },
    // Dressing armchair
    {
      id: 'dressing_armchair',
      name: 'Dressing Armchair',
      x: 296,
      y: 220,
      textureKey: 'furniture_armchair',
      depthOffset: 18,
      collision: {
        width: 36,
        height: 24,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 40,
        height: 16,
        offsetY: 18,
      },
    },

    // 2. DINING HALL
    // The Hero Dining Table (long dark mahogany with crimson runner, 2 place settings, wine bottle, glasses)
    {
      id: 'dining_table',
      name: 'The Waiting Table',
      x: 576,
      y: 320,
      textureKey: 'furniture_dining_table',
      depthOffset: 24,
      collision: {
        width: 160,
        height: 48,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_large',
        width: 172,
        height: 36,
        offsetY: 28,
      },
    },
    // High-backed chair North (for Love)
    {
      id: 'dining_chair_north',
      name: "Love's Chair (Empty)",
      x: 576,
      y: 256,
      textureKey: 'furniture_chair_down',
      depthOffset: 16,
      collision: {
        width: 32,
        height: 20,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 34,
        height: 14,
        offsetY: 16,
      },
    },
    // High-backed chair South (for Death)
    {
      id: 'dining_chair_south',
      name: "Death's Chair",
      x: 576,
      y: 384,
      textureKey: 'furniture_chair_up',
      depthOffset: 20,
      collision: {
        width: 32,
        height: 20,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 34,
        height: 14,
        offsetY: 16,
      },
    },
    // Dining sideboard / wine cabinet on left wall
    {
      id: 'dining_sideboard',
      name: 'Wine Sideboard',
      x: 400,
      y: 448,
      textureKey: 'furniture_sideboard',
      depthOffset: 24,
      collision: {
        width: 48,
        height: 32,
        offsetY: 16,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 52,
        height: 18,
        offsetY: 28,
      },
    },

    // 3. LOUNGE & FIREPLACE AREA
    // Carved Stone Fireplace on North Wall of Lounge
    {
      id: 'lounge_fireplace',
      name: 'Gothic Hearth',
      x: 992,
      y: 104,
      textureKey: 'furniture_fireplace',
      depthOffset: 32,
      collision: {
        width: 96,
        height: 36,
        offsetY: 24,
      },
      shadow: {
        textureKey: 'shadow_furniture_large',
        width: 104,
        height: 24,
        offsetY: 36,
      },
    },
    // Velvet Lounge Sofa facing fireplace
    {
      id: 'lounge_sofa',
      name: 'Burgundy Velvet Sofa',
      x: 928,
      y: 336,
      textureKey: 'furniture_sofa',
      depthOffset: 24,
      collision: {
        width: 96,
        height: 36,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_large',
        width: 102,
        height: 24,
        offsetY: 26,
      },
    },
    // Velvet Armchair
    {
      id: 'lounge_armchair',
      name: 'Plush Armchair',
      x: 1048,
      y: 336,
      textureKey: 'furniture_armchair',
      depthOffset: 20,
      collision: {
        width: 36,
        height: 28,
        offsetY: 12,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 40,
        height: 16,
        offsetY: 20,
      },
    },
    // Low coffee table with book / ashtray
    {
      id: 'lounge_coffee_table',
      name: 'Coffee Table',
      x: 928,
      y: 260,
      textureKey: 'furniture_coffee_table',
      depthOffset: 16,
      collision: {
        width: 64,
        height: 24,
        offsetY: 10,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 68,
        height: 16,
        offsetY: 18,
      },
    },
    // Tall Bookshelf filled with occult tomes
    {
      id: 'lounge_bookshelf',
      name: 'Ancient Bookshelf',
      x: 832,
      y: 136,
      textureKey: 'furniture_bookshelf',
      depthOffset: 36,
      collision: {
        width: 64,
        height: 28,
        offsetY: 24,
      },
      shadow: {
        textureKey: 'shadow_furniture_med',
        width: 68,
        height: 20,
        offsetY: 36,
      },
    },
    // Antique Television aesthetic set (for future broadcast scene)
    {
      id: 'lounge_television',
      name: 'Vintage Television Console',
      x: 1064,
      y: 200,
      textureKey: 'furniture_tv_console',
      depthOffset: 24,
      collision: {
        width: 48,
        height: 24,
        offsetY: 16,
      },
      shadow: {
        textureKey: 'shadow_furniture_small',
        width: 52,
        height: 16,
        offsetY: 24,
      },
    },
    // Framed paintings on walls
    {
      id: 'painting_dressing',
      name: 'Portrait of an Unknown Lady',
      x: 176,
      y: 44,
      textureKey: 'decor_painting_portrait',
      depthOffset: -100, // On the upper wall
    },
    {
      id: 'painting_dining',
      name: 'Gothic Landscape in Oil',
      x: 544,
      y: 44,
      textureKey: 'decor_painting_landscape',
      depthOffset: -100,
    },
    {
      id: 'painting_lounge',
      name: 'Equestrian Battle Study',
      x: 904,
      y: 44,
      textureKey: 'decor_painting_portrait',
      depthOffset: -100,
    },
  ],
  candles: [
    // Dressing vanity candelabras
    { id: 'candle_vanity_l', x: 196, y: 110, radius: 75, intensity: 0.35 },
    { id: 'candle_vanity_r', x: 252, y: 110, radius: 75, intensity: 0.35 },

    // Dining table candelabras
    { id: 'candle_table_l', x: 520, y: 300, radius: 95, intensity: 0.5 },
    { id: 'candle_table_m', x: 576, y: 300, radius: 105, intensity: 0.55 },
    { id: 'candle_table_r', x: 632, y: 300, radius: 95, intensity: 0.5 },

    // Dining sideboard candle
    { id: 'candle_sideboard', x: 400, y: 430, radius: 70, intensity: 0.3 },

    // Lounge coffee table candle
    { id: 'candle_coffee_table', x: 928, y: 248, radius: 80, intensity: 0.4 },

    // Lounge bookshelf candle
    { id: 'candle_bookshelf', x: 848, y: 115, radius: 75, intensity: 0.35 },
  ],
  fireplace: {
    id: 'main_fireplace',
    x: 992,
    y: 104,
    width: 96,
    height: 80,
    state: 'idle',
  },
};
