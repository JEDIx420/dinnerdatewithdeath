import Phaser from 'phaser';
import { DEATH_MANIFEST } from '../entities/deathManifest';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Generate crisp 32px procedural environment textures
    this.createPlaceholderTextures();

    // Load Death runtime sprite sheet (512x512 with 128x128 cells)
    this.load.spritesheet(DEATH_MANIFEST.textureKey, DEATH_MANIFEST.texturePath, {
      frameWidth: DEATH_MANIFEST.frameWidth,
      frameHeight: DEATH_MANIFEST.frameHeight,
    });
  }

  public create(): void {
    // Register Death walk animations dynamically from manifest
    for (const [animName, animDef] of Object.entries(DEATH_MANIFEST.animations)) {
      const animKey = `${DEATH_MANIFEST.id}_${animName}`;
      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(DEATH_MANIFEST.textureKey, {
            frames: animDef.frames,
          }),
          frameRate: DEATH_MANIFEST.frameRate,
          repeat: -1,
        });
      }
    }

    // Check if directly launched into dev scenes via query parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'asset-lab') {
      this.scene.start('AssetLabScene');
      return;
    }
    if (params.get('scene') === 'prototype' || params.has('debug')) {
      this.scene.start('PrototypeScene');
      return;
    }

    this.scene.start('TitleScene');
  }

  private createPlaceholderTextures(): void {
    // 1. Floor tile (32x32 dark gothic wood plank)
    const floorGfx = this.make.graphics({ x: 0, y: 0 });
    floorGfx.fillStyle(0x181420, 1);
    floorGfx.fillRect(0, 0, 32, 32);
    // Plank seams and grain
    floorGfx.fillStyle(0x221c2c, 1);
    floorGfx.fillRect(0, 0, 31, 2);
    floorGfx.fillRect(0, 16, 31, 2);
    floorGfx.fillStyle(0x100d16, 1);
    floorGfx.fillRect(0, 14, 32, 2);
    floorGfx.fillRect(0, 30, 32, 2);
    floorGfx.generateTexture('tile_floor', 32, 32);
    floorGfx.destroy();

    // 2. Wall tile (32x32 dark gothic stone block)
    const wallGfx = this.make.graphics({ x: 0, y: 0 });
    wallGfx.fillStyle(0x262030, 1);
    wallGfx.fillRect(0, 0, 32, 32);
    wallGfx.fillStyle(0x383046, 1);
    wallGfx.fillRect(0, 0, 32, 3); // top bevel
    wallGfx.fillStyle(0x14101a, 1);
    wallGfx.fillRect(0, 29, 32, 3); // bottom shadow
    wallGfx.fillRect(15, 3, 3, 26); // center vertical mortar
    wallGfx.generateTexture('tile_wall', 32, 32);
    wallGfx.destroy();

    // 3. Dinner table obstacle (96x48 dark mahogany with crimson runner)
    const tableGfx = this.make.graphics({ x: 0, y: 0 });
    tableGfx.fillStyle(0x281618, 1);
    tableGfx.fillRect(0, 0, 96, 48);
    // Outer shadow border
    tableGfx.fillStyle(0x12080a, 1);
    tableGfx.strokeRect(0, 0, 96, 48);
    // Crimson velvet table runner
    tableGfx.fillStyle(0x6e1422, 1);
    tableGfx.fillRect(16, 4, 64, 40);
    // Wine goblets / candle placeholders
    tableGfx.fillStyle(0xe2e2e2, 1);
    tableGfx.fillRect(32, 16, 6, 6);
    tableGfx.fillRect(58, 16, 6, 6);
    tableGfx.generateTexture('obstacle_table', 96, 48);
    tableGfx.destroy();

    // 4. Mirror obstacle (32x64 gothic silver mirror)
    const mirrorGfx = this.make.graphics({ x: 0, y: 0 });
    mirrorGfx.fillStyle(0x383440, 1);
    mirrorGfx.fillRect(0, 0, 32, 64);
    mirrorGfx.fillStyle(0x6b7787, 1);
    mirrorGfx.fillRect(4, 8, 24, 48);
    mirrorGfx.fillStyle(0xa9b7c8, 1);
    mirrorGfx.fillRect(6, 12, 6, 20); // reflection streak
    mirrorGfx.generateTexture('obstacle_mirror', 32, 64);
    mirrorGfx.destroy();

    // 5. Pillar / Candelabra obstacle (32x64)
    const pillarGfx = this.make.graphics({ x: 0, y: 0 });
    pillarGfx.fillStyle(0x221c2c, 1);
    pillarGfx.fillRect(4, 16, 24, 48);
    pillarGfx.fillStyle(0x8a6828, 1);
    pillarGfx.fillRect(8, 6, 16, 10);
    // Candle flame (amber glow)
    pillarGfx.fillStyle(0xeda839, 1);
    pillarGfx.fillRect(14, 0, 4, 6);
    pillarGfx.generateTexture('obstacle_pillar', 32, 64);
    pillarGfx.destroy();
  }
}
