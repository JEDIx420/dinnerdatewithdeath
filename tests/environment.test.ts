import { describe, it, expect } from 'vitest';
import { EnvironmentAssetCatalog } from '../src/game/environment/EnvironmentAssetCatalog';
import { COLLISION_PROFILES, getCollisionProfile, CollisionProfileId } from '../src/game/environment/CollisionProfile';
import { getAnchorOrigin } from '../src/game/environment/EnvironmentAsset';
import { placeMirroredPair, placeRepeatedSpan, frameOpening } from '../src/game/environment/SymmetryHelpers';
import { DEPTH_LAYERS, resolveDepthForClass, calculateDynamicDepth } from '../src/game/systems/DepthSystem';
import { MANSION_ROOM_DEF } from '../src/game/world/RoomDefinition';

describe('EnvironmentAssetCatalog & Metadata Integrity', () => {
  it('registers all 80 production architecture assets with valid attributes', () => {
    const assets = EnvironmentAssetCatalog.getAllAssets();
    expect(assets.length).toBe(80);

    for (const asset of assets) {
      expect(asset.id).toBeTruthy();
      expect(asset.category).toBeTruthy();
      expect(asset.textureKey).toBeTruthy();
      expect(asset.nativeWidth).toBeGreaterThan(0);
      expect(asset.nativeHeight).toBeGreaterThan(0);
      expect(['center', 'bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'top-left', 'ground-center']).toContain(asset.anchorPreset);
      expect(['background', 'floor', 'floor-decor', 'back-wall', 'back-wall-detail', 'contact-shadow', 'dynamic-solid', 'foreground-structure', 'lighting', 'ui']).toContain(asset.depthClass);
      expect(['none', 'floor-solid', 'barrier', 'overhead']).toContain(asset.physicalClass);
      expect(COLLISION_PROFILES[asset.collisionProfile]).toBeDefined();
    }
  });

  it('provides reliable retrieval and category filtering', () => {
    const asset = EnvironmentAssetCatalog.requireAsset('column_stone_massive');
    expect(asset.nativeWidth).toBe(73);
    expect(asset.nativeHeight).toBe(160);
    expect(asset.anchorPreset).toBe('bottom-center');
    expect(asset.depthClass).toBe('dynamic-solid');
    expect(asset.physicalClass).toBe('floor-solid');
    expect(asset.collisionProfile).toBe('column_massive');

    const columns = EnvironmentAssetCatalog.getAssetsByCategory('columns_arches');
    expect(columns.length).toBeGreaterThanOrEqual(10);
    expect(columns.some((c) => c.id === 'column_stone_massive')).toBe(true);
  });

  it('throws for non-existent asset retrieval via requireAsset', () => {
    expect(() => EnvironmentAssetCatalog.requireAsset('non_existent_asset_xyz')).toThrow();
  });
});

describe('Collision Profiles & Physical Footprint Decoupling', () => {
  it('defines valid non-negative footprints for all registered profiles', () => {
    const profileIds = Object.keys(COLLISION_PROFILES) as CollisionProfileId[];
    expect(profileIds.length).toBeGreaterThanOrEqual(10);

    for (const id of profileIds) {
      const profile = getCollisionProfile(id);
      expect(profile.id).toBe(id);
      expect(profile.name).toBeTruthy();
      expect(profile.footprint.width).toBeGreaterThanOrEqual(0);
      expect(profile.footprint.height).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(profile.footprint.offsetX)).toBe(true);
      expect(Number.isFinite(profile.footprint.offsetY)).toBe(true);
    }
  });

  it('properly decouples visual dimensions from collision footprints', () => {
    const colMassive = EnvironmentAssetCatalog.requireAsset('column_stone_massive');
    const profile = getCollisionProfile(colMassive.collisionProfile);

    // Visual size is 73x160 px, but physical footprint is only 44x22 px at base
    expect(colMassive.nativeWidth).toBe(73);
    expect(colMassive.nativeHeight).toBe(160);
    expect(profile.footprint.width).toBe(44);
    expect(profile.footprint.height).toBe(22);
    expect(profile.footprint.offsetY).toBe(-10);
  });
});

describe('Anchor Presets & Origin Resolution', () => {
  it('correctly maps anchor presets to origin coordinates', () => {
    expect(getAnchorOrigin('bottom-center')).toEqual({ originX: 0.5, originY: 1.0 });
    expect(getAnchorOrigin('ground-center')).toEqual({ originX: 0.5, originY: 1.0 });
    expect(getAnchorOrigin('top-left')).toEqual({ originX: 0.0, originY: 0.0 });
    expect(getAnchorOrigin('top-center')).toEqual({ originX: 0.5, originY: 0.0 });
    expect(getAnchorOrigin('bottom-left')).toEqual({ originX: 0.0, originY: 1.0 });
    expect(getAnchorOrigin('bottom-right')).toEqual({ originX: 1.0, originY: 1.0 });
    expect(getAnchorOrigin('center')).toEqual({ originX: 0.5, originY: 0.5 });
  });
});

describe('Symmetry & World Composition Helpers', () => {
  const AXIS = 640;

  it('placeMirroredPair guarantees exact mathematical symmetry around axis', () => {
    const [left, right] = placeMirroredPair(
      'hall_col',
      AXIS,
      180,
      450,
      'column_stone_massive',
      'column_stone_massive',
      {
        zone: 'greathall',
        role: 'flanking-column',
        flipXRight: true,
      }
    );

    expect(left.x).toBe(AXIS - 180); // 460
    expect(right.x).toBe(AXIS + 180); // 820
    expect((left.x + right.x) / 2).toBe(AXIS);
    expect(left.y).toBe(right.y);
    expect(left.flipX).toBeUndefined();
    expect(right.flipX).toBe(true);
    expect(left.symmetryGroup).toBe(right.symmetryGroup);
  });

  it('placeRepeatedSpan spans evenly across a corridor', () => {
    const spans = placeRepeatedSpan(
      'hall_carpet',
      500,
      780,
      70,
      300,
      'carpet_runner_red_ornate',
      {
        zone: 'greathall',
        role: 'carpet-span',
      }
    );

    expect(spans.length).toBe(5); // span = 280, count = 280/70 = 4, loop 0..4 gives 5 points
    expect(spans[0]!.x).toBe(500);
    expect(spans[spans.length - 1]!.x).toBe(780);
    expect(spans[spans.length - 1]!.y).toBe(300);
  });

  it('frameOpening creates symmetrical supports and an overhead header', () => {
    const opening = frameOpening(
      'dining_portal',
      AXIS,
      90,
      500,
      'column_stone_fluted',
      'arch_stone_pointed_large',
      {
        zone: 'dining',
      }
    );

    expect(opening.length).toBe(3);
    const [left, right, header] = opening;
    expect(left!.x).toBe(AXIS - 90);
    expect(right!.x).toBe(AXIS + 90);
    expect(header!.x).toBe(AXIS);
    expect(header!.depthClass).toBe('foreground-structure');
  });
});

describe('Depth System Semantic Hierarchy', () => {
  it('enforces strict layer order without overlap', () => {
    expect(DEPTH_LAYERS.BACKGROUND).toBeLessThan(DEPTH_LAYERS.FLOOR);
    expect(DEPTH_LAYERS.FLOOR).toBeLessThan(DEPTH_LAYERS.FLOOR_DECOR);
    expect(DEPTH_LAYERS.FLOOR_DECOR).toBeLessThan(DEPTH_LAYERS.BACK_WALL);
    expect(DEPTH_LAYERS.BACK_WALL).toBeLessThan(DEPTH_LAYERS.BACK_WALL_DETAIL);
    expect(DEPTH_LAYERS.BACK_WALL_DETAIL).toBeLessThan(DEPTH_LAYERS.CONTACT_SHADOWS);
    expect(DEPTH_LAYERS.CONTACT_SHADOWS).toBeLessThan(DEPTH_LAYERS.DYNAMIC_Y_BASE);
    expect(DEPTH_LAYERS.DYNAMIC_Y_BASE).toBeLessThan(DEPTH_LAYERS.FOREGROUND_STRUCTURE);
    expect(DEPTH_LAYERS.FOREGROUND_STRUCTURE).toBeLessThan(DEPTH_LAYERS.LIGHTING_OVERLAY);
    expect(DEPTH_LAYERS.LIGHTING_OVERLAY).toBeLessThan(DEPTH_LAYERS.FOREGROUND_AMBIENT);
    expect(DEPTH_LAYERS.FOREGROUND_AMBIENT).toBeLessThan(DEPTH_LAYERS.UI);
  });

  it('dynamically sorts player and column based on foot level ground Y', () => {
    const colGroundY = 600;
    const colDepth = resolveDepthForClass('dynamic-solid', colGroundY);

    // Death standing 20px north of column base
    const deathNorthY = 580;
    const deathNorthDepth = calculateDynamicDepth(deathNorthY);
    expect(deathNorthDepth).toBeLessThan(colDepth);

    // Death standing 20px south of column base
    const deathSouthY = 620;
    const deathSouthDepth = calculateDynamicDepth(deathSouthY);
    expect(deathSouthDepth).toBeGreaterThan(colDepth);
  });
});

describe('MansionRoom Environment Placements Integration', () => {
  it('includes populated environmentPlacements in MANSION_ROOM_DEF', () => {
    expect(MANSION_ROOM_DEF.environmentPlacements).toBeDefined();
    expect(MANSION_ROOM_DEF.environmentPlacements!.length).toBeGreaterThan(20);

    // Verify all 5 mansion zones have placements
    const zones = new Set(MANSION_ROOM_DEF.environmentPlacements!.map((p) => p.zone));
    expect(zones.has('bedchamber')).toBe(true);
    expect(zones.has('upper_landing')).toBe(true);
    expect(zones.has('great_hall')).toBe(true);
    expect(zones.has('dining_room')).toBe(true);
    expect(zones.has('lounge')).toBe(true);
  });

  it('verifies all placement assetIds exist in EnvironmentAssetCatalog', () => {
    for (const p of MANSION_ROOM_DEF.environmentPlacements!) {
      expect(EnvironmentAssetCatalog.hasAsset(p.assetId)).toBe(true);
    }
  });
});
