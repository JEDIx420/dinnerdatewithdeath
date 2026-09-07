import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';

export class PrototypeScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private wallsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;

  private readonly MOVE_SPEED = 75;

  constructor() {
    super({ key: 'PrototypeScene' });
  }

  public init(data: { inputManager?: InputManager }): void {
    if (data.inputManager) {
      this.inputManager = data.inputManager;
    } else {
      this.inputManager = new InputManager();
      this.inputManager.bindKeyboardEvents();
    }
  }

  public create(): void {
    // Room dimensions (24 tiles wide x 13 tiles high = 384 x 208 px)
    const cols = 24;
    const rows = 13;
    const tileSize = GAME_CONFIG.TILE_SIZE;

    this.wallsGroup = this.physics.add.staticGroup();
    this.obstaclesGroup = this.physics.add.staticGroup();

    // 1. Draw floor and border walls
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * tileSize + tileSize / 2;
        const y = r * tileSize + tileSize / 2;

        const isPerimeter = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

        if (isPerimeter) {
          const wall = this.wallsGroup.create(x, y, 'tile_wall');
          wall.refreshBody();
        } else {
          this.add.image(x, y, 'tile_floor');
        }
      }
    }

    // 2. Add obstacles to test collisions
    // Obstacle A: Dining table in center
    const tableX = GAME_CONFIG.WIDTH / 2;
    const tableY = GAME_CONFIG.HEIGHT / 2 + 10;
    const table = this.obstaclesGroup.create(tableX, tableY, 'obstacle_table');
    table.refreshBody();

    // Obstacle B: Gothic mirror on north wall
    const mirrorX = 80;
    const mirrorY = 24;
    const mirror = this.obstaclesGroup.create(mirrorX, mirrorY, 'obstacle_mirror');
    mirror.refreshBody();

    // Obstacle C: Candelabra / pillar divider
    const pillarX = GAME_CONFIG.WIDTH - 80;
    const pillarY = 60;
    const pillar = this.obstaclesGroup.create(pillarX, pillarY, 'obstacle_pillar');
    pillar.refreshBody();

    // 3. Spawn temporary player
    const spawnX = GAME_CONFIG.WIDTH / 2;
    const spawnY = tableY + 50;

    this.player = this.physics.add.sprite(spawnX, spawnY, 'player_placeholder');
    this.player.setCollideWorldBounds(true);
    // Custom body size for classic RPG foot-level collision
    this.player.body.setSize(12, 10);
    this.player.body.setOffset(2, 12);

    // 4. Register collisions
    this.physics.add.collider(this.player, this.wallsGroup);
    this.physics.add.collider(this.player, this.obstaclesGroup);

    // 5. Camera setup
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // 6. Minimal HUD / validation text
    this.add.text(6, GAME_CONFIG.HEIGHT - 12, 'WASD/Arrows: Move | Engine Prototype v0.0.3', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#6e6578',
    });
  }

  public update(): void {
    let vx = 0;
    let vy = 0;

    // Continuous 4-direction movement via abstract InputManager
    if (this.inputManager.isDown('LEFT')) {
      vx -= 1;
    }
    if (this.inputManager.isDown('RIGHT')) {
      vx += 1;
    }
    if (this.inputManager.isDown('UP')) {
      vy -= 1;
    }
    if (this.inputManager.isDown('DOWN')) {
      vy += 1;
    }

    // Normalize diagonal movement to maintain consistent RPG walking speed
    if (vx !== 0 && vy !== 0) {
      const invSqrt2 = 0.70710678;
      vx *= invSqrt2;
      vy *= invSqrt2;
    }

    this.player.setVelocity(vx * this.MOVE_SPEED, vy * this.MOVE_SPEED);

    this.inputManager.update();
  }
}
