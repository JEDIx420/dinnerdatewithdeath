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
    // Spawns upstairs in his private Bedchamber beside the bed, immediately visible
    x: 265,
    y: 240,
    direction: 'down',
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

  windows: [],

  furniture: [],
  candles: [],
};

