import { describe, it, expect } from 'vitest';
import { MANSION_ROOM_DEF } from '../src/game/world/RoomDefinition';
import { DEPTH_LAYERS, calculateDynamicDepth } from '../src/game/systems/DepthSystem';

describe('Mansion Room Definition & World Geometry', () => {
  it('validates mansion dimensions and safe bounds', () => {
    expect(MANSION_ROOM_DEF.id).toBe('death_mansion');
    expect(MANSION_ROOM_DEF.width).toBe(1280);
    expect(MANSION_ROOM_DEF.height).toBe(960);

    const bounds = MANSION_ROOM_DEF.safeBounds;
    expect(bounds.minX).toBe(48);
    expect(bounds.maxX).toBe(1232);
    expect(bounds.minY).toBe(72);
    expect(bounds.maxY).toBe(912);
  });

  it('validates spawn point is strictly within safe bounds in Bedchamber', () => {
    const spawn = MANSION_ROOM_DEF.spawnPoint;
    const bounds = MANSION_ROOM_DEF.safeBounds;

    expect(spawn.x).toBe(200);
    expect(spawn.y).toBe(190);
    expect(spawn.direction).toBe('up');
    expect(spawn.x).toBeGreaterThanOrEqual(bounds.minX);
    expect(spawn.x).toBeLessThanOrEqual(bounds.maxX);
    expect(spawn.y).toBeGreaterThanOrEqual(bounds.minY);
    expect(spawn.y).toBeLessThanOrEqual(bounds.maxY);
  });

  it('validates 5 distinct zones exist with floor and rug definitions', () => {
    const floorIds = MANSION_ROOM_DEF.floors.map((f) => f.id);
    expect(floorIds).toContain('dressing_floor');
    expect(floorIds).toContain('landing_floor');
    expect(floorIds).toContain('hall_floor');
    expect(floorIds).toContain('dining_floor');
    expect(floorIds).toContain('lounge_floor');

    // Rugs & Medallion
    expect(floorIds).toContain('dressing_rug');
    expect(floorIds).toContain('landing_rug');
    expect(floorIds).toContain('hall_medallion');
    expect(floorIds).toContain('dining_rug');
    expect(floorIds).toContain('lounge_rug');
  });

  it('validates grand staircase connector is configured', () => {
    expect(MANSION_ROOM_DEF.staircase).toBeDefined();
    expect(MANSION_ROOM_DEF.staircase?.stepCount).toBe(9);
    expect(MANSION_ROOM_DEF.staircase?.x).toBe(560);
    expect(MANSION_ROOM_DEF.staircase?.y).toBe(260);
  });

  it('validates hero dining table and major narrative furniture are configured', () => {
    const furnitureMap = new Map(MANSION_ROOM_DEF.furniture.map((f) => [f.id, f]));

    // Hero Dining Table
    const table = furnitureMap.get('dining_table');
    expect(table).toBeDefined();
    expect(table?.collision).toBeDefined();
    expect(table?.shadow).toBeDefined();
    expect(table?.x).toBe(240);
    expect(table?.y).toBe(720);

    // Love & Death chairs
    expect(furnitureMap.get('dining_chair_love')).toBeDefined();
    expect(furnitureMap.get('dining_chair_death')).toBeDefined();

    // Mirror & Vanity in dressing zone
    expect(furnitureMap.get('dressing_mirror')).toBeDefined();
    expect(furnitureMap.get('dressing_vanity')).toBeDefined();
    expect(furnitureMap.get('dressing_wardrobe')).toBeDefined();

    // Fireplace & Sofa in lounge zone
    expect(furnitureMap.get('lounge_fireplace')).toBeDefined();
    expect(furnitureMap.get('lounge_sofa')).toBeDefined();
    expect(furnitureMap.get('lounge_bookshelf')).toBeDefined();
  });

  it('validates candles and windows configuration', () => {
    expect(MANSION_ROOM_DEF.candles.length).toBeGreaterThanOrEqual(6);
    for (const c of MANSION_ROOM_DEF.candles) {
      expect(c.x).toBeGreaterThan(0);
      expect(c.x).toBeLessThan(MANSION_ROOM_DEF.width);
      expect(c.y).toBeGreaterThan(0);
      expect(c.y).toBeLessThan(MANSION_ROOM_DEF.height);
      expect(c.intensity).toBeGreaterThan(0);
    }

    expect(MANSION_ROOM_DEF.windows.length).toBeGreaterThanOrEqual(3);
    for (const w of MANSION_ROOM_DEF.windows) {
      expect(w.hasCurtains).toBe(true);
    }
  });
});

describe('DepthSystem Layering & Spatial Sorting Math', () => {
  it('enforces strict layer hierarchy', () => {
    expect(DEPTH_LAYERS.BACKGROUND).toBeLessThan(DEPTH_LAYERS.FLOOR);
    expect(DEPTH_LAYERS.FLOOR).toBeLessThan(DEPTH_LAYERS.RUGS);
    expect(DEPTH_LAYERS.RUGS).toBeLessThan(DEPTH_LAYERS.CONTACT_SHADOWS);
    expect(DEPTH_LAYERS.CONTACT_SHADOWS).toBeLessThan(DEPTH_LAYERS.DYNAMIC_Y_BASE);
    expect(DEPTH_LAYERS.DYNAMIC_Y_BASE).toBeLessThan(DEPTH_LAYERS.UPPER_WALLS);
    expect(DEPTH_LAYERS.UPPER_WALLS).toBeLessThan(DEPTH_LAYERS.FOREGROUND_ARCHES);
    expect(DEPTH_LAYERS.FOREGROUND_ARCHES).toBeLessThan(DEPTH_LAYERS.LIGHTING_OVERLAY);
    expect(DEPTH_LAYERS.LIGHTING_OVERLAY).toBeLessThan(DEPTH_LAYERS.FOREGROUND_AMBIENT);
    expect(DEPTH_LAYERS.FOREGROUND_AMBIENT).toBeLessThan(DEPTH_LAYERS.UI);
  });

  it('correctly calculates dynamic Y-based sorting depth', () => {
    // Character walking behind table (character feet at Y=280 vs table base at Y=330)
    const charBehindDepth = calculateDynamicDepth(280, 48); // 1000 + 328 = 1328
    const tableDepth = calculateDynamicDepth(320, 24);      // 1000 + 344 = 1344
    expect(charBehindDepth).toBeLessThan(tableDepth);

    // Character walking in front of table (character feet at Y=360)
    const charInFrontDepth = calculateDynamicDepth(360, 48); // 1000 + 408 = 1408
    expect(charInFrontDepth).toBeGreaterThan(tableDepth);
  });
});
