import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DEATH_MANIFEST } from '../src/game/entities/deathManifest';
import { GAME_CONFIG } from '../src/game/constants';

describe('Death Character Manifests & Rendering Constants', () => {
  it('validates logical presentation constants (v0.0.5 standard)', () => {
    expect(GAME_CONFIG.WIDTH).toBe(768);
    expect(GAME_CONFIG.HEIGHT).toBe(432);
    expect(GAME_CONFIG.TILE_SIZE).toBe(32);
    expect(GAME_CONFIG.CHARACTER_CELL_SIZE).toBe(128);
    expect(GAME_CONFIG.CHARACTER_FOOT_BASELINE).toBe(112);
  });

  it('validates extraction manifest in art/manifests/death.json', () => {
    const manifestPath = path.join(process.cwd(), 'art/manifests/death.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(data.id).toBe('death');
    expect(data.targetSheet.cols).toBe(4);
    expect(data.targetSheet.rows).toBe(4);
    expect(data.targetSheet.width).toBe(512);
    expect(data.targetSheet.height).toBe(512);
    expect(data.targetSheet.cellWidth).toBe(128);
    expect(data.targetSheet.cellHeight).toBe(128);
    expect(data.characterScaleHeight).toBe(92);
    expect(data.footBaseline).toBe(112);
    expect(data.backgroundRemoval.threshold).toBeGreaterThan(150);

    expect(data.directions.down.row).toBe(0);
    expect(data.directions.left.row).toBe(1);
    expect(data.directions.right.row).toBe(2);
    expect(data.directions.up.row).toBe(3);
  });

  it('validates production runtime manifest in public/game-assets', () => {
    const runtimePath = path.join(
      process.cwd(),
      'public/game-assets/characters/death/manifest.json'
    );
    expect(fs.existsSync(runtimePath)).toBe(true);

    const runtimeData = JSON.parse(fs.readFileSync(runtimePath, 'utf-8'));
    expect(runtimeData.id).toBe('death');
    expect(runtimeData.frameWidth).toBe(128);
    expect(runtimeData.frameHeight).toBe(128);
    expect(runtimeData.footBaseline).toBe(112);

    const directions = ['walk_down', 'walk_left', 'walk_right', 'walk_up'] as const;
    for (const dir of directions) {
      const anim = runtimeData.animations[dir];
      expect(anim).toBeDefined();
      expect(anim.frames.length).toBe(4);
      expect(anim.idleFrame).toBeDefined();
      expect(anim.frames).toContain(anim.idleFrame);
      for (const f of anim.frames) {
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(15);
      }
    }
  });

  it('validates compiled DEATH_MANIFEST object matches runtime contract', () => {
    expect(DEATH_MANIFEST.id).toBe('death');
    expect(DEATH_MANIFEST.frameWidth).toBe(128);
    expect(DEATH_MANIFEST.frameHeight).toBe(128);
    expect(DEATH_MANIFEST.footBaseline).toBe(112);

    // Verify all 16 frames partitioned cleanly into 4 rows of 4
    expect(DEATH_MANIFEST.animations.walk_down.frames).toEqual([0, 1, 2, 3]);
    expect(DEATH_MANIFEST.animations.walk_left.frames).toEqual([4, 5, 6, 7]);
    expect(DEATH_MANIFEST.animations.walk_right.frames).toEqual([8, 9, 10, 11]);
    expect(DEATH_MANIFEST.animations.walk_up.frames).toEqual([12, 13, 14, 15]);

    // Idle frames
    expect(DEATH_MANIFEST.animations.walk_down.idleFrame).toBe(3);
    expect(DEATH_MANIFEST.animations.walk_left.idleFrame).toBe(7);
    expect(DEATH_MANIFEST.animations.walk_right.idleFrame).toBe(11);
    expect(DEATH_MANIFEST.animations.walk_up.idleFrame).toBe(15);
  });

  it('ensures production sprite sheet asset exists and is 512x512', () => {
    const pngPath = path.join(
      process.cwd(),
      'public/game-assets/characters/death/overworld/walk.png'
    );
    expect(fs.existsSync(pngPath)).toBe(true);
    const stats = fs.statSync(pngPath);
    expect(stats.size).toBeGreaterThan(20000);
  });
});
