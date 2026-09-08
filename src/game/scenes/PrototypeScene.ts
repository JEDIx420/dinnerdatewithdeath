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

  // Visual QA diagnostic overlay
  private debugVisualMode: boolean = false;
  private debugOverlayGfx!: Phaser.GameObjects.Graphics;
  private debugOverlayText!: Phaser.GameObjects.Text;

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
    const rows = 14;
    const tileSize = GAME_CONFIG.TILE_SIZE; // 32px

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

    // 2. Add test obstacles scaled to 768x432 presentation
    // Obstacle A: Dining banquet table in center (96x48)
    const tableX = GAME_CONFIG.WIDTH / 2;
    const tableY = GAME_CONFIG.HEIGHT / 2 + 20;
    const table = this.obstaclesGroup.create(tableX, tableY, 'obstacle_table');
    table.refreshBody();

    // Obstacle B: Mirror on north wall (32x64)
    const mirrorX = 160;
    const mirrorY = 48;
    const mirror = this.obstaclesGroup.create(mirrorX, mirrorY, 'obstacle_mirror');
    mirror.refreshBody();

    // Obstacle C: Candelabra divider pillar (32x64)
    const pillarX = GAME_CONFIG.WIDTH - 160;
    const pillarY = 120;
    const pillar = this.obstaclesGroup.create(pillarX, pillarY, 'obstacle_pillar');
    pillar.refreshBody();

    // 3. Spawn Death using Player entity abstraction (128x128 cell, 92px height)
    const spawnX = GAME_CONFIG.WIDTH / 2;
    const spawnY = tableY + 96;

    this.player = new Player({
      scene: this,
      x: spawnX,
      y: spawnY,
      manifest: DEATH_MANIFEST,
      inputManager: this.inputManager,
      moveSpeed: 150,
      initialDirection: 'down',
    });

    // 4. Register obstacle collisions
    this.physics.add.collider(this.player.sprite, this.wallsGroup);
    this.physics.add.collider(this.player.sprite, this.obstaclesGroup);

    // 5. Camera follow
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // 6. HUD info text
    this.add.text(12, GAME_CONFIG.HEIGHT - 22, 'WASD/Arrows: Move | [V] Visual QA | v0.0.5', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#7a7088',
    });

    // Dev shortcut to Asset Lab
    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });

    // Setup Visual QA Overlay (?debug=visual or 'V' key)
    this.setupVisualQAOverlay();
  }

  private setupVisualQAOverlay(): void {
    const params = new URLSearchParams(window.location.search);
    this.debugVisualMode = params.get('debug') === 'visual';

    this.debugOverlayGfx = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.debugOverlayText = this.add
      .text(GAME_CONFIG.WIDTH - 12, 12, '', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#c8e0d0',
        align: 'right',
        lineSpacing: 3,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(101);

    this.input.keyboard?.on('keydown-V', () => {
      this.debugVisualMode = !this.debugVisualMode;
    });
  }

  public update(): void {
    this.player.update();
    this.inputManager.update();

    if (this.debugVisualMode) {
      this.renderVisualQAOverlay();
    } else {
      this.debugOverlayGfx.clear();
      this.debugOverlayText.setText('');
    }
  }

  private renderVisualQAOverlay(): void {
    const canvas = this.game.canvas;
    const dpr = window.devicePixelRatio || 1;
    const fps = Math.round(this.game.loop.actualFps);
    const backingW = canvas.width;
    const backingH = canvas.height;
    const cssW = canvas.style.width || `${canvas.clientWidth}px`;
    const cssH = canvas.style.height || `${canvas.clientHeight}px`;

    const lines = [
      `[VISUAL QA DIAGNOSTICS]`,
      `Logical Res:   ${GAME_CONFIG.WIDTH} × ${GAME_CONFIG.HEIGHT} (16:9)`,
      `Backing Res:   ${backingW} × ${backingH} px`,
      `Device DPR:    ${dpr}`,
      `CSS Display:   ${cssW} × ${cssH}`,
      `Performance:   ${fps} FPS`,
      `Character Cell:128 × 128 (92px height, Y=112 baseline)`,
      `Texture Filter:NEAREST (sprites) / LINEAR (typography)`,
    ];

    this.debugOverlayGfx.clear();
    this.debugOverlayGfx.fillStyle(0x0a0a14, 0.85);
    this.debugOverlayGfx.fillRect(GAME_CONFIG.WIDTH - 360, 8, 352, 130);
    this.debugOverlayGfx.lineStyle(1, 0x4a7a60, 0.9);
    this.debugOverlayGfx.strokeRect(GAME_CONFIG.WIDTH - 360, 8, 352, 130);

    this.debugOverlayText.setText(lines);
  }
}
