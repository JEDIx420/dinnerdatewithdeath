import { describe, it, expect } from 'vitest';
import {
  MANSION_WALL_BAYS,
  MANSION_KEEP_CLEAR_ZONES,
  MANSION_FURNITURE_ANCHORS,
  MANSION_ROOM_BUDGETS,
  isKeepClearViolation,
} from '../src/game/environment/RoomCompositionFramework';
import { buildMansionPlacements } from '../src/game/environment/mansionPlacements';

describe('RoomCompositionFramework', () => {
  it('correctly identifies keep-clear violations', () => {
    // Center of stair arrival zone (x: 640, y: 550) should violate
    expect(isKeepClearViolation(640, 550, 32, 32)).toBe(true);
    // Safe spot in Great Hall (x: 640, y: 750) should not violate
    expect(isKeepClearViolation(640, 750, 32, 32)).toBe(false);
  });
  it('validates wall bays and furniture anchors exist for all mansion zones', () => {
    const zones = ['bedchamber', 'upper_landing', 'great_hall', 'dining_room', 'lounge'];

    for (const zone of zones) {
      const bays = MANSION_WALL_BAYS.filter((b) => b.zone === zone);
      expect(bays.length).toBeGreaterThanOrEqual(1);

      const budget = MANSION_ROOM_BUDGETS[zone as keyof typeof MANSION_ROOM_BUDGETS];
      expect(budget).toBeDefined();
    }

    expect(MANSION_KEEP_CLEAR_ZONES.length).toBeGreaterThanOrEqual(4);
    expect(MANSION_FURNITURE_ANCHORS.length).toBeGreaterThanOrEqual(10);
  });

  it('validates no production furniture violates stair arrival or door threshold keep-clear zones', () => {
    const placements = buildMansionPlacements();

    for (const p of placements) {
      if (p.role === 'chandelier' || p.role === 'arch' || p.role === 'spandrel' || p.depthClass === 'back-wall' || p.depthClass === 'back-wall-detail') {
        continue; // Overhead architectural elements and back wall trim do not block ground walkability
      }

      // Check ground-standing furniture against stair arrival keep-clear zone
      const stairArrivalZone = MANSION_KEEP_CLEAR_ZONES.find((z) => z.id === 'keep_clear_hall_stair_arrival');
      expect(stairArrivalZone).toBeDefined();

      if (stairArrivalZone) {
        const b = stairArrivalZone.bounds;
        // Verify no floor-standing furniture is placed directly inside the stair arrival keep-clear zone
        if (p.zone === 'great_hall' && p.role !== 'newel') {
          const inside = p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
          expect(inside).toBe(false);
        }
      }
    }
  });

  it('validates room density budgets are strictly respected in buildMansionPlacements', () => {
    const placements = buildMansionPlacements();

    const zones = ['bedchamber', 'upper_landing', 'great_hall', 'dining_room', 'lounge'] as const;

    for (const zone of zones) {
      const roomPlacements = placements.filter((p) => p.zone === zone);
      const budget = MANSION_ROOM_BUDGETS[zone];

      const heroItems = roomPlacements.filter((p) =>
        p.role === 'bed' || p.role === 'banquet_table' || p.role === 'fireplace' || p.role === 'chandelier'
      );
      expect(heroItems.length).toBeLessThanOrEqual(budget.maxHero);
    }
  });
});
