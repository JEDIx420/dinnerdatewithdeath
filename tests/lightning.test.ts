import { describe, it, expect } from 'vitest';
import {
  generateLightningBolt,
  getAuthoringStrikeConfig,
  LightningPathConfig,
} from '../src/game/effects/LightningBoltGeometry';

describe('LightningBoltGeometry Pure Generator', () => {
  it('generates main path with segments within min/max bounds', () => {
    const config: LightningPathConfig = {
      startX: 0,
      startY: 50,
      endX: 600,
      endY: 150,
      minSegments: 8,
      maxSegments: 12,
      roughness: 25,
    };

    const bolt = generateLightningBolt(config);
    expect(bolt.mainPoints.length).toBeGreaterThanOrEqual(9); // minSegments + 1
    expect(bolt.mainPoints.length).toBeLessThanOrEqual(13); // maxSegments + 1

    expect(bolt.mainPoints[0]).toEqual({ x: 0, y: 50 });
    expect(bolt.mainPoints[bolt.mainPoints.length - 1]).toEqual({ x: 600, y: 150 });
  });

  it('generates deterministic lightning geometry when seeded RNG is provided', () => {
    // Simple LCG pseudo-random generator
    function createLcg(seed: number) {
      let s = seed;
      return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };
    }

    const config: LightningPathConfig = {
      startX: 10,
      startY: 20,
      endX: 500,
      endY: 200,
      minSegments: 10,
      maxSegments: 10,
      branchCount: 2,
    };

    const bolt1 = generateLightningBolt(config, createLcg(12345));
    const bolt2 = generateLightningBolt(config, createLcg(12345));

    expect(bolt1.mainPoints).toEqual(bolt2.mainPoints);
    expect(bolt1.branches.length).toBe(bolt2.branches.length);
    for (let i = 0; i < bolt1.branches.length; i++) {
      expect(bolt1.branches[i]?.points).toEqual(bolt2.branches[i]?.points);
      expect(bolt1.branches[i]?.parentIndex).toEqual(bolt2.branches[i]?.parentIndex);
    }
  });

  it('clamps generated points within configured bounds', () => {
    const config: LightningPathConfig = {
      startX: 50,
      startY: 50,
      endX: 400,
      endY: 50,
      roughness: 100,
      bounds: {
        minX: 40,
        maxX: 410,
        minY: 20,
        maxY: 80,
      },
    };

    const bolt = generateLightningBolt(config);
    for (const pt of bolt.mainPoints) {
      expect(pt.x).toBeGreaterThanOrEqual(40);
      expect(pt.x).toBeLessThanOrEqual(410);
      expect(pt.y).toBeGreaterThanOrEqual(20);
      expect(pt.y).toBeLessThanOrEqual(80);
    }

    for (const br of bolt.branches) {
      for (const pt of br.points) {
        expect(pt.x).toBeGreaterThanOrEqual(40);
        expect(pt.x).toBeLessThanOrEqual(410);
        expect(pt.y).toBeGreaterThanOrEqual(20);
        expect(pt.y).toBeLessThanOrEqual(80);
      }
    }
  });

  it('validates branches originate from valid points on main path', () => {
    const config: LightningPathConfig = {
      startX: 0,
      startY: 0,
      endX: 700,
      endY: 100,
      minSegments: 12,
      maxSegments: 12,
      branchCount: 3,
    };

    const bolt = generateLightningBolt(config);
    expect(bolt.branches.length).toBeGreaterThan(0);

    for (const br of bolt.branches) {
      expect(br.parentIndex).toBeGreaterThanOrEqual(1);
      expect(br.parentIndex).toBeLessThan(bolt.mainPoints.length - 1);
      const originPt = bolt.mainPoints[br.parentIndex]!;
      expect(br.points[0]).toEqual(originPt);
      expect(br.points.length).toBeGreaterThanOrEqual(3);
      expect(br.thicknessRatio).toBeGreaterThan(0);
      expect(br.thicknessRatio).toBeLessThanOrEqual(1.0);
    }
  });

  it('ensures no coordinates produce NaN or Infinite values', () => {
    const presets: Array<Parameters<typeof getAuthoringStrikeConfig>[0]> = [
      'intro_hero',
      'screen_diagonal_left',
      'screen_diagonal_right',
      'window_top_left',
      'window_top_right',
    ];

    for (const preset of presets) {
      const config = getAuthoringStrikeConfig(preset, 768, 432);
      const bolt = generateLightningBolt(config);

      for (const pt of bolt.mainPoints) {
        expect(Number.isFinite(pt.x)).toBe(true);
        expect(Number.isFinite(pt.y)).toBe(true);
      }

      for (const br of bolt.branches) {
        for (const pt of br.points) {
          expect(Number.isFinite(pt.x)).toBe(true);
          expect(Number.isFinite(pt.y)).toBe(true);
        }
      }
    }
  });
});
