import Phaser from 'phaser';
import { DEATH_MANIFEST } from '../entities/deathManifest';
import { generateMansionTextures } from '../world/MansionTextures';
import { preloadMansionArchitecture } from '../assets/mansionArchitecture';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Generate crisp gothic procedural environment textures
    generateMansionTextures(this);

    // Preload production mansion architecture sprites
    preloadMansionArchitecture(this);

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
    if (
      params.get('scene') === 'mansion' ||
      params.get('scene') === 'prototype' ||
      params.has('debug')
    ) {
      this.scene.start('MansionScene');
      return;
    }

    this.scene.start('TitleScene');
  }
}
