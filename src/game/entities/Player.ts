import { Actor, ActorConfig } from './Actor';
import { InputManager } from '../systems/InputManager';
import { Direction } from './CharacterManifest';
import { SafeBounds } from '../world/RoomDefinition';

export interface PlayerConfig extends ActorConfig {
  inputManager: InputManager;
  moveSpeed?: number;
  safeBounds?: SafeBounds;
}

/**
 * Player encapsulates player control, mapping InputManager actions to Actor movement and animation.
 * Speed standardized in v0.0.5 to 150 px/sec for 768x432 logical resolution.
 * Enforces visual safe bounds to prevent character clipping outside rooms.
 */
export class Player extends Actor {
  private inputManager: InputManager;
  private readonly moveSpeed: number;
  private safeBounds?: SafeBounds;

  constructor(config: PlayerConfig) {
    super(config);
    this.inputManager = config.inputManager;
    this.moveSpeed = config.moveSpeed ?? 150;
    this.safeBounds = config.safeBounds;
  }

  public setSafeBounds(bounds: SafeBounds): void {
    this.safeBounds = bounds;
  }

  public update(): void {
    let vx = 0;
    let vy = 0;

    const left = this.inputManager.isDown('LEFT');
    const right = this.inputManager.isDown('RIGHT');
    const up = this.inputManager.isDown('UP');
    const down = this.inputManager.isDown('DOWN');

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    if (vx !== 0 || vy !== 0) {
      // Determine walking direction for animation
      let moveDir: Direction = this.facing;

      // In diagonal movement, maintain current facing if still valid, or pick primary axis
      if (vx < 0 && (this.facing === 'left' || vy === 0)) {
        moveDir = 'left';
      } else if (vx > 0 && (this.facing === 'right' || vy === 0)) {
        moveDir = 'right';
      } else if (vy < 0) {
        moveDir = 'up';
      } else if (vy > 0) {
        moveDir = 'down';
      }

      // Normalize diagonal velocity to maintain classic GBA walk speed
      if (vx !== 0 && vy !== 0) {
        const invSqrt2 = 0.70710678;
        vx *= invSqrt2;
        vy *= invSqrt2;
      }

      this.walk(moveDir);
      this.setVelocity(vx * this.moveSpeed, vy * this.moveSpeed);
    } else {
      this.stop();
      this.setVelocity(0, 0);
    }

    // Enforce navigable visual safe bounds (prevents upper body clipping through north wall/screen)
    if (this.safeBounds) {
      const clampedX = Math.min(Math.max(this.sprite.x, this.safeBounds.minX), this.safeBounds.maxX);
      const clampedY = Math.min(Math.max(this.sprite.y, this.safeBounds.minY), this.safeBounds.maxY);

      if (clampedX !== this.sprite.x || clampedY !== this.sprite.y) {
        this.sprite.setPosition(clampedX, clampedY);
      }
    }

    // Synchronize dynamic Y-depth and grounding shadow
    this.updateDepth();
  }
}
