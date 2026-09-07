import Phaser from 'phaser';
import { CharacterManifest, Direction } from './CharacterManifest';

export interface ActorConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  manifest: CharacterManifest;
  initialDirection?: Direction;
}

/**
 * Actor provides a standardized runtime contract for overworld characters (Death, Love, Fear, General).
 * Handles directional walk animation selection, idle frame holding, and foot-level collision bounds.
 */
export class Actor {
  public readonly sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  protected manifest: CharacterManifest;
  protected facing: Direction;
  protected isWalking: boolean = false;

  constructor(config: ActorConfig) {
    this.manifest = config.manifest;
    this.facing = config.initialDirection ?? 'down';

    // Create the physics sprite using character texture key
    this.sprite = config.scene.physics.add.sprite(
      config.x,
      config.y,
      this.manifest.textureKey,
      this.getIdleFrameForDirection(this.facing)
    );

    // Standardized foot-level collision box within 64x64 cell
    // Feet anchor at baseline Y=56, character width ~28px, centered around X=32
    this.sprite.body.setSize(16, 10);
    this.sprite.body.setOffset(24, 48);
    this.sprite.setCollideWorldBounds(true);
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
  }

  public setVelocity(vx: number, vy: number): void {
    this.sprite.setVelocity(vx, vy);
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
