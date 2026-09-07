import { Actor, ActorConfig } from './Actor';
import { InputManager } from '../systems/InputManager';
import { Direction } from './CharacterManifest';

export interface PlayerConfig extends ActorConfig {
  inputManager: InputManager;
  moveSpeed?: number;
}

/**
 * Player encapsulates player control, mapping InputManager actions to Actor movement and animation.
 */
export class Player extends Actor {
  private inputManager: InputManager;
  private readonly moveSpeed: number;

  constructor(config: PlayerConfig) {
    super(config);
    this.inputManager = config.inputManager;
    this.moveSpeed = config.moveSpeed ?? 75;
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
  }
}
