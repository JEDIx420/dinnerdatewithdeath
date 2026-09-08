import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  ARCHITECTURE_TEXTURE_KEYS,
  CATEGORY_MAP,
  getArchitectureAssetPath,
} from '../src/game/assets/mansionArchitecture';
import { MANSION_ROOM_DEF } from '../src/game/world/RoomDefinition';
import { MANSION_ARCHITECTURE_ELEMENTS } from '../src/game/world/mansionArchitectureDefs';

interface ManifestAsset {
  id: string;
  category: string;
  sourceRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface Manifest {
  sourceDimensions: {
    width: number;
    height: number;
  };
  categories: string[];
  assets: ManifestAsset[];
}

describe('Mansion Architecture Pipeline & Asset Registry', () => {
  const manifestPath = path.resolve(__dirname, '../art/manifests/mansion-architecture.json');
  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  it('validates manifest source dimensions and categories', () => {
    expect(manifest.sourceDimensions.width).toBe(1448);
    expect(manifest.sourceDimensions.height).toBe(1086);
    expect(manifest.categories).toEqual([
      'floors',
      'carpets',
      'walls',
      'trims',
      'columns_arches',
      'stairs_balustrade',
      'ornaments',
    ]);
  });

  it('validates all manifest assets have coordinates within 1448x1086', () => {
    for (const asset of manifest.assets) {
      const rect = asset.sourceRect;
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(manifest.sourceDimensions.width);
      expect(rect.y + rect.height).toBeLessThanOrEqual(manifest.sourceDimensions.height);
    }
  });

  it('validates all 80 assets exist in ARCHITECTURE_TEXTURE_KEYS and match manifest IDs', () => {
    expect(ARCHITECTURE_TEXTURE_KEYS.length).toBe(manifest.assets.length);
    expect(ARCHITECTURE_TEXTURE_KEYS.length).toBe(80);

    const manifestIds = new Set(manifest.assets.map((a) => a.id));
    for (const key of ARCHITECTURE_TEXTURE_KEYS) {
      expect(manifestIds.has(key)).toBe(true);
      expect(CATEGORY_MAP[key]).toBeDefined();
    }
  });

  it('verifies all 80 extracted asset PNG files exist on disk under public/game-assets/', () => {
    for (const key of ARCHITECTURE_TEXTURE_KEYS) {
      const relPath = getArchitectureAssetPath(key);
      const absPath = path.resolve(__dirname, '../public', relPath);
      expect(fs.existsSync(absPath)).toBe(true);
    }
  });

  it('validates architectural room definitions use valid texture keys', () => {
    const validKeySet = new Set<string>(ARCHITECTURE_TEXTURE_KEYS);

    expect(MANSION_ROOM_DEF.architecture).toBeDefined();
    expect(MANSION_ROOM_DEF.architecture!.length).toBeGreaterThan(20);

    for (const arch of MANSION_ROOM_DEF.architecture!) {
      expect(validKeySet.has(arch.textureKey)).toBe(true);
      expect(arch.x).toBeGreaterThanOrEqual(0);
      expect(arch.x).toBeLessThanOrEqual(MANSION_ROOM_DEF.width);
      expect(arch.y).toBeGreaterThanOrEqual(0);
      expect(arch.y).toBeLessThanOrEqual(MANSION_ROOM_DEF.height);
    }
  });

  it('validates MANSION_ARCHITECTURE_ELEMENTS covers all 5 narrative zones', () => {
    const zones = new Set(MANSION_ARCHITECTURE_ELEMENTS.map((e) => e.zone));
    expect(zones.has('bedchamber')).toBe(true);
    expect(zones.has('upper_landing')).toBe(true);
    expect(zones.has('great_hall')).toBe(true);
    expect(zones.has('dining_room')).toBe(true);
    expect(zones.has('lounge')).toBe(true);
  });
});
