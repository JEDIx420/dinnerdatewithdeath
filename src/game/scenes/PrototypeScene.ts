import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';
import { Player } from '../entities/Player';
import { DEATH_MANIFEST } from '../entities/deathManifest';

export class PrototypeScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private player!: Player;
  private wallsGroup!: Phaser.Physics.Arcade.StaticGroup;
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;

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
    const cols = 24;
    const rows = 13;
    const tileSize = GAME_CONFIG.TILE_SIZE;

    this.wallsGroup = this.physics.add.staticGroup();
    this.obstaclesGroup = this.physics.add.staticGroup();

    // 1. Draw floor and perimeter walls
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

    // 2. Add test obstacles
    // Obstacle A: Dining banquet table in center
    const tableX = GAME_CONFIG.WIDTH / 2;
    const tableY = GAME_CONFIG.HEIGHT / 2 + 10;
    const table = this.obstaclesGroup.create(tableX, tableY, 'obstacle_table');
    table.refreshBody();

    // Obstacle B: Mirror on north wall
    const mirrorX = 80;
    const mirrorY = 24;
    const mirror = this.obstaclesGroup.create(mirrorX, mirrorY, 'obstacle_mirror');
    mirror.refreshBody();

    // Obstacle C: Candelabra divider pillar
    const pillarX = GAME_CONFIG.WIDTH - 80;
    const pillarY = 60;
    const pillar = this.obstaclesGroup.create(pillarX, pillarY, 'obstacle_pillar');
    pillar.refreshBody();

    // 3. Spawn Death using Player entity abstraction
    const spawnX = GAME_CONFIG.WIDTH / 2;
    const spawnY = tableY + 50;

    this.player = new Player({
      scene: this,
      x: spawnX,
      y: spawnY,
      manifest: DEATH_MANIFEST,
      inputManager: this.inputManager,
      moveSpeed: 75,
      initialDirection: 'down',
    });

    // 4. Register obstacle collisions
    this.physics.add.collider(this.player.sprite, this.wallsGroup);
    this.physics.add.collider(this.player.sprite, this.obstaclesGroup);

    // 5. Camera follow
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // 6. HUD info text
    this.add.text(6, GAME_CONFIG.HEIGHT - 12, 'WASD/Arrows: Move | [L] Asset Lab | v0.0.4', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#6e6578',
    });

    // Dev shortcut to Asset Lab
    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });
  }

  public update(): void {
    this.player.update();
    this.inputManager.update();
  }
}
