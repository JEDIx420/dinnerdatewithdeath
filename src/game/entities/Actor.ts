import Phaser from 'phaser';
import { CharacterManifest, Direction } from './CharacterManifest';
import { calculateDynamicDepth, DEPTH_LAYERS } from '../systems/DepthSystem';

export interface ActorConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  manifest: CharacterManifest;
  initialDirection?: Direction;
  hasShadow?: boolean;
}

/**
 * Actor provides a standardized runtime contract for overworld characters (Death, Love, Fear, General).
 * Handles directional walk animation selection, idle frame holding, foot-level collision bounds,
 * dynamic Y-depth sorting, and attached grounding contact shadows.
 * Standardized in v0.0.5 for 128x128 frame cells.
 */
export class Actor {
  public readonly sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public readonly shadowSprite?: Phaser.GameObjects.Sprite;
  protected manifest: CharacterManifest;
  protected facing: Direction;
  protected isWalking: boolean = false;

  constructor(config: ActorConfig) {
    this.manifest = config.manifest;
    this.facing = config.initialDirection ?? 'down';

    // 1. Grounding contact shadow anchored at foot baseline (Y=112, offset +48 from center)
    const showShadow = config.hasShadow ?? true;
    if (showShadow && config.scene.textures.exists('shadow_actor')) {
      this.shadowSprite = config.scene.add.sprite(config.x, config.y + 48, 'shadow_actor');
      this.shadowSprite.setDepth(DEPTH_LAYERS.CONTACT_SHADOWS);
      this.shadowSprite.setAlpha(0.55);
    }

    // 2. Physics sprite
    this.sprite = config.scene.physics.add.sprite(
      config.x,
      config.y,
      this.manifest.textureKey,
      this.getIdleFrameForDirection(this.facing)
    );

    // Enforce crisp nearest-neighbor filtering on the overworld sprite
    this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Standardized foot-level collision box within 128x128 cell (character centered at X=64, feet at Y=112)
    // Box: 32x20 px, offset at (48, 96)
    this.sprite.body.setSize(32, 20);
    this.sprite.body.setOffset(48, 96);
    this.sprite.setCollideWorldBounds(true);

    // Initialize dynamic depth
    this.updateDepth();
  }

  public updateDepth(): void {
    this.sprite.setDepth(calculateDynamicDepth(this.sprite.y, 48));
    if (this.shadowSprite) {
      this.shadowSprite.setPosition(this.sprite.x, this.sprite.y + 48);
    }
  }

  public getFacing(): Direction {
    return this.facing;
  }

  public setFacing(direction: Direction): void {
    this.facing = direction;
    if (!this.isWalking) {
      this.sprite.anims.stop();
      this.sprite.setFrame(this.getIdleFrameForDirection(direction));
    }
  }

  public walk(direction: Direction): void {
    this.facing = direction;
    this.isWalking = true;
    const animKey = `${this.manifest.id}_walk_${direction}`;
    if (this.sprite.anims.currentAnim?.key !== animKey) {
      this.sprite.play(animKey, true);
    }
  }

  public stop(): void {
    if (this.isWalking) {
      this.isWalking = false;
      this.sprite.anims.stop();
      this.sprite.setFrame(this.getIdleFrameForDirection(this.facing));
    }
  }

  public getIdleFrameForDirection(direction: Direction): number {
    switch (direction) {
      case 'down':
        return this.manifest.animations.walk_down.idleFrame;
      case 'left':
        return this.manifest.animations.walk_left.idleFrame;
      case 'right':
        return this.manifest.animations.walk_right.idleFrame;
      case 'up':
        return this.manifest.animations.walk_up.idleFrame;
    }
  }

  public setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    if (this.shadowSprite) {
      this.shadowSprite.setPosition(x, y + 48);
    }
  }

  public setVelocity(vx: number, vy: number): void {
    this.sprite.setVelocity(vx, vy);
  }

  public destroy(): void {
    this.shadowSprite?.destroy();
    this.sprite.destroy();
  }
}
