import Phaser from 'phaser';
import { DEATH_MANIFEST } from '../entities/deathManifest';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Generate crisp procedural environment textures
    this.createPlaceholderTextures();

    // Load Death runtime sprite sheet
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

    // Check if directly launched into dev Asset Lab via query parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'asset-lab') {
      this.scene.start('AssetLabScene');
      return;
    }

    this.scene.start('TitleScene');
  }

  private createPlaceholderTextures(): void {
    // 1. Floor tile (16x16 dark gothic wood plank)
    const floorGfx = this.make.graphics({ x: 0, y: 0 });
    floorGfx.fillStyle(0x1a1622, 1);
    floorGfx.fillRect(0, 0, 16, 16);
    floorGfx.fillStyle(0x221d2e, 1);
    floorGfx.fillRect(0, 0, 15, 1);
    floorGfx.fillRect(0, 8, 15, 1);
    floorGfx.fillStyle(0x120f18, 1);
    floorGfx.fillRect(0, 7, 16, 1);
    floorGfx.fillRect(0, 15, 16, 1);
    floorGfx.generateTexture('tile_floor', 16, 16);
    floorGfx.destroy();

    // 2. Wall tile (16x16 dark gothic stone)
    const wallGfx = this.make.graphics({ x: 0, y: 0 });
    wallGfx.fillStyle(0x282333, 1);
    wallGfx.fillRect(0, 0, 16, 16);
    wallGfx.fillStyle(0x383147, 1);
    wallGfx.fillRect(0, 0, 16, 2);
    wallGfx.fillStyle(0x15121c, 1);
    wallGfx.fillRect(0, 14, 16, 2);
    wallGfx.fillRect(7, 2, 2, 12);
    wallGfx.generateTexture('tile_wall', 16, 16);
    wallGfx.destroy();

    // 3. Dinner table obstacle (48x24 dark mahogany with crimson runner)
    const tableGfx = this.make.graphics({ x: 0, y: 0 });
    tableGfx.fillStyle(0x2e1a1c, 1);
    tableGfx.fillRect(0, 0, 48, 24);
    tableGfx.fillStyle(0x150b0c, 1);
    tableGfx.strokeRect(0, 0, 48, 24);
    tableGfx.fillStyle(0x6b1420, 1);
    tableGfx.fillRect(8, 2, 32, 20);
    tableGfx.fillStyle(0xdedede, 1);
    tableGfx.fillRect(16, 8, 3, 3);
    tableGfx.fillRect(29, 8, 3, 3);
    tableGfx.generateTexture('obstacle_table', 48, 24);
    tableGfx.destroy();

    // 4. Mirror obstacle (16x32 gothic silver mirror)
    const mirrorGfx = this.make.graphics({ x: 0, y: 0 });
    mirrorGfx.fillStyle(0x3c3845, 1);
    mirrorGfx.fillRect(0, 0, 16, 32);
    mirrorGfx.fillStyle(0x6f7d8c, 1);
    mirrorGfx.fillRect(2, 4, 12, 24);
    mirrorGfx.fillStyle(0xa9b7c6, 1);
    mirrorGfx.fillRect(3, 6, 3, 10);
    mirrorGfx.generateTexture('obstacle_mirror', 16, 32);
    mirrorGfx.destroy();

    // 5. Pillar / Candelabra obstacle (16x32)
    const pillarGfx = this.make.graphics({ x: 0, y: 0 });
    pillarGfx.fillStyle(0x252030, 1);
    pillarGfx.fillRect(2, 8, 12, 24);
    pillarGfx.fillStyle(0x916d2b, 1);
    pillarGfx.fillRect(4, 2, 8, 6);
    pillarGfx.fillStyle(0xe5a337, 1);
    pillarGfx.fillRect(7, 0, 2, 2);
    pillarGfx.generateTexture('obstacle_pillar', 16, 32);
    pillarGfx.destroy();
  }
}
