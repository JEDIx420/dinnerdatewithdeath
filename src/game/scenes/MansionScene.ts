import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';
import { Player } from '../entities/Player';
import { DEATH_MANIFEST } from '../entities/deathManifest';
import { LightingSystem } from '../systems/LightingSystem';
import { AmbientFXSystem } from '../systems/AmbientFXSystem';
import { MansionRoom } from '../world/MansionRoom';
import { MANSION_ROOM_DEF } from '../world/RoomDefinition';

export class MansionScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private player!: Player;
  private lightingSystem!: LightingSystem;
  private ambientFXSystem!: AmbientFXSystem;
  private mansionRoom!: MansionRoom;

  // Visual QA diagnostic overlay (?debug=visual or 'V' key)
  private debugVisualMode: boolean = false;
  private debugOverlayGfx!: Phaser.GameObjects.Graphics;
  private debugOverlayText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MansionScene' });
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
    // 1. Initialize systems
    this.lightingSystem = new LightingSystem(this);
    this.ambientFXSystem = new AmbientFXSystem(this);

    // 2. Build mansion world geometry, floors, walls, furniture, windows, and hearth
    this.mansionRoom = new MansionRoom(
      this,
      MANSION_ROOM_DEF,
      this.lightingSystem,
      this.ambientFXSystem
    );

    // 3. Spawn Death using Player entity abstraction with visual safe bounds
    const spawn = this.mansionRoom.getSpawnPoint();
    const params = new URLSearchParams(window.location.search);
    let spawnX = spawn.x;
    let spawnY = spawn.y;
    const pos = params.get('pos');
    if (pos === 'dining_behind') {
      spawnX = 576;
      spawnY = 295; // Behind the dining table (depth sorting test)
    } else if (pos === 'dining') {
      spawnX = 576;
      spawnY = 370; // In front of the dining table
    } else if (pos === 'lounge') {
      spawnX = 960;
      spawnY = 240; // In the lounge by the fireplace
    }

    this.player = new Player({
      scene: this,
      x: spawnX,
      y: spawnY,
      manifest: DEATH_MANIFEST,
      inputManager: this.inputManager,
      moveSpeed: 150,
      initialDirection: 'down',
      safeBounds: this.mansionRoom.getSafeBounds(),
    });

    // 4. Register obstacle and perimeter wall physics colliders
    this.physics.add.collider(this.player.sprite, this.mansionRoom.wallsGroup);
    this.physics.add.collider(this.player.sprite, this.mansionRoom.furnitureGroup);

    // 5. Camera follow with smooth cinematic lerp and room boundaries
    this.cameras.main.setBounds(0, 0, MANSION_ROOM_DEF.width, MANSION_ROOM_DEF.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

    // 6. Developer shortcuts (hidden from normal player presentation)
    // Press 'L' to launch Asset Lab
    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });

    // Setup Visual QA Overlay (?debug=visual or 'V' key)
    this.setupVisualQAOverlay();
  }

  private setupVisualQAOverlay(): void {
    const params = new URLSearchParams(window.location.search);
    this.debugVisualMode = params.get('debug') === 'visual';

    this.debugOverlayGfx = this.add.graphics().setScrollFactor(0).setDepth(10001);
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
      .setDepth(10002);

    this.input.keyboard?.on('keydown-V', () => {
      this.debugVisualMode = !this.debugVisualMode;
    });
  }

  public update(_time: number, delta: number): void {
    this.player.update();
    this.inputManager.update();
    this.lightingSystem.update(delta);
    this.ambientFXSystem.update(delta);

    if (this.debugVisualMode) {
      this.renderVisualQAOverlay();
    } else {
      this.debugOverlayGfx.clear();
      this.debugOverlayText.setText('');
    }
  }

  private getPlayerZoneName(): string {
    const px = this.player.sprite.x;
    if (px < 368) return 'Dressing / Mirror Area';
    if (px < 772) return 'Grand Dining Hall';
    return 'Lounge & Hearth';
  }

  private renderVisualQAOverlay(): void {
    const canvas = this.game.canvas;
    const dpr = window.devicePixelRatio || 1;
    const fps = Math.round(this.game.loop.actualFps);
    const backingW = canvas.width;
    const backingH = canvas.height;
    const cssW = canvas.style.width || `${canvas.clientWidth}px`;
    const cssH = canvas.style.height || `${canvas.clientHeight}px`;
    const px = Math.round(this.player.sprite.x);
    const py = Math.round(this.player.sprite.y);
    const depth = Math.round(this.player.sprite.depth);
    const zone = this.getPlayerZoneName();
    const particleCount = this.ambientFXSystem.getParticleCount();
    const lightsCount = this.lightingSystem.getLightsCount();

    const lines = [
      `[VISUAL QA DIAGNOSTICS - MANSION FOUNDATION]`,
      `Logical Res:   ${GAME_CONFIG.WIDTH} × ${GAME_CONFIG.HEIGHT} (16:9)`,
      `World Size:    ${MANSION_ROOM_DEF.width} × ${MANSION_ROOM_DEF.height} px`,
      `Backing Res:   ${backingW} × ${backingH} px | DPR: ${dpr}`,
      `CSS Display:   ${cssW} × ${cssH}`,
      `Performance:   ${fps} FPS`,
      `Zone:          ${zone}`,
      `Player Pos:    (${px}, ${py}) | Depth: ${depth}`,
      `Environment:   ${this.mansionRoom.furnitureSprites.length} objects | ${lightsCount} lights`,
      `Ambient FX:    ${particleCount} active particles`,
      `Safe Bounds:   [X: 64..1088, Y: 104..572]`,
    ];

    this.debugOverlayGfx.clear();
    this.debugOverlayGfx.fillStyle(0x080812, 0.88);
    this.debugOverlayGfx.fillRect(GAME_CONFIG.WIDTH - 380, 8, 372, 174);
    this.debugOverlayGfx.lineStyle(1, 0x3d6e52, 0.9);
    this.debugOverlayGfx.strokeRect(GAME_CONFIG.WIDTH - 380, 8, 372, 174);

    this.debugOverlayText.setText(lines);
  }
}
