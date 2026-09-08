import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';

interface TitleRainStreak {
  x: number;
  y: number;
  speed: number;
  length: number;
}

export class TitleScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private isStarting: boolean = false;
  private timeAccumulator: number = 0;

  // Title visual components
  private lightningGfx!: Phaser.GameObjects.Graphics;
  private rainGfx!: Phaser.GameObjects.Graphics;
  private candleGlowGfx!: Phaser.GameObjects.Graphics;
  private rainStreaks: TitleRainStreak[] = [];

  // Interactive prompt
  private titleContainer!: Phaser.GameObjects.Container;
  private newGamePrompt!: Phaser.GameObjects.Text;
  private lightningTimer: number = 7000;

  constructor() {
    super({ key: 'TitleScene' });
  }

  public init(data: { inputManager?: InputManager }): void {
    if (data.inputManager) {
      this.inputManager = data.inputManager;
    } else {
      this.inputManager = new InputManager();
      this.inputManager.bindKeyboardEvents();
    }
    this.isStarting = false;
    this.timeAccumulator = 0;
  }

  public create(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;

    // 1. Dark nocturnal atmosphere background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0e0c14, 0x0e0c14, 0x050408, 0x050408, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // 2. High gothic arched windows in background with rainy night
    const winLeft = this.add.sprite(centerX - 180, 110, 'window_gothic').setAlpha(0.65);
    const winRight = this.add.sprite(centerX + 180, 110, 'window_gothic').setAlpha(0.65);

    // Rain graphics on windows
    this.rainGfx = this.add.graphics().setDepth(5);
    for (let i = 0; i < 20; i++) {
      const isLeft = i < 10;
      const winX = isLeft ? winLeft.x : winRight.x;
      this.rainStreaks.push({
        x: winX - 24 + Math.random() * 48,
        y: 65 + Math.random() * 80,
        speed: 130 + Math.random() * 70,
        length: 8 + Math.random() * 10,
      });
    }

    // 3. Midground: The Waiting Table set for two
    // Dark floor shadow
    const tableShadow = this.add.sprite(centerX, 285, 'shadow_furniture_large');
    tableShadow.setDisplaySize(200, 36).setAlpha(0.7);

    // Empty high-backed chair for Love (facing down)
    const loveChair = this.add.sprite(centerX - 95, 235, 'furniture_chair_down');
    loveChair.setAlpha(0.85);

    // High-backed chair for Death (facing down)
    const deathChair = this.add.sprite(centerX + 95, 235, 'furniture_chair_down');
    deathChair.setAlpha(0.85);

    // The banquet table set with crimson runner, wine bottle, glasses, and candelabras
    const banquetTable = this.add.sprite(centerX, 275, 'furniture_dining_table');
    banquetTable.setDepth(10);

    // Soft warm candlelight glow around the table
    this.candleGlowGfx = this.add.graphics().setDepth(12);

    // Distant lightning flash layer
    this.lightningGfx = this.add.graphics().setDepth(20);

    // 4. Foreground title typography container
    this.titleContainer = this.add.container(0, 0).setDepth(30);

    // Thin elegant crimson rule
    const ruleGfx = this.add.graphics();
    ruleGfx.lineStyle(1.5, 0x7a1826, 0.8);
    ruleGfx.lineBetween(centerX - 160, 138, centerX + 160, 138);
    this.titleContainer.add(ruleGfx);

    // Title line 1: A DINNER DATE (tracked serif)
    const titleLine1 = this.add
      .text(centerX, 96, 'A  D I N N E R  D A T E', {
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#c4b8cc',
        align: 'center',
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#180810', 4);
    this.titleContainer.add(titleLine1);

    // Title line 2: WITH DEATH (grand gothic serif)
    const titleLine2 = this.add
      .text(centerX, 118, 'WITH  DEATH', {
        fontFamily: 'Georgia, serif',
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#ebe2f0',
        align: 'center',
      })
      .setOrigin(0.5)
      .setShadow(3, 3, '#2a0812', 6);
    this.titleContainer.add(titleLine2);

    // Interactive "▶  NEW GAME" prompt
    this.newGamePrompt = this.add
      .text(centerX, 365, '▶   N E W   G A M E', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#d4c6de',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(35);

    // Sub-instruction
    this.add
      .text(centerX, 395, 'Press ENTER or SPACE to Begin', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6e6278',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(35);

    // Gentle pulsing alpha on NEW GAME prompt
    this.tweens.add({
      targets: this.newGamePrompt,
      alpha: { from: 1, to: 0.45 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 5. Input bindings
    // Pointer / touch click
    this.input.on('pointerdown', () => {
      this.triggerStartGame();
    });

    // Developer shortcut: press 'L' to launch Asset Lab (hidden from player-facing UI)
    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });
  }

  public update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.timeAccumulator += delta;

    // 1. Animate window rain
    this.updateTitleRain(dt);

    // 2. Animate candle glow flicker on table
    this.updateCandleGlow();

    // 3. Occasional distant lightning flash
    this.updateLightning(delta);

    // 4. Handle confirmation input
    if (!this.isStarting && this.inputManager.isJustDown('CONFIRM')) {
      this.triggerStartGame();
    }

    this.inputManager.update();
  }

  private updateTitleRain(dt: number): void {
    this.rainGfx.clear();
    this.rainGfx.lineStyle(1, 0x8aa0b8, 0.45);

    for (const s of this.rainStreaks) {
      s.y += s.speed * dt;
      s.x -= s.speed * 0.2 * dt;
      if (s.y > 155) {
        s.y = 65;
      }
      this.rainGfx.lineBetween(s.x, s.y, s.x - s.length * 0.2, s.y + s.length);
    }
  }

  private updateCandleGlow(): void {
    this.candleGlowGfx.clear();
    const centerX = GAME_CONFIG.WIDTH / 2;
    const t = this.timeAccumulator * 0.005;

    // Organic desynchronized candle halos over table candelabras
    const candles = [
      { x: centerX - 56, y: 260, baseR: 44, phase: 0 },
      { x: centerX, y: 254, baseR: 52, phase: 1.7 },
      { x: centerX + 56, y: 260, baseR: 44, phase: 3.4 },
    ];

    for (const c of candles) {
      const flicker = Math.sin(t * 3.7 + c.phase) * 0.4 + Math.sin(t * 7.1 + c.phase) * 0.3;
      const r = c.baseR * (1 + flicker * 0.08);

      for (let i = 4; i >= 1; i--) {
        const ringR = (r / 4) * i;
        const alpha = (1 - i / 5) * 0.16;
        this.candleGlowGfx.fillStyle(0xffa834, alpha);
        this.candleGlowGfx.fillCircle(c.x, c.y, ringR);
      }
      // Flame core
      this.candleGlowGfx.fillStyle(0xffeb68, 0.85);
      this.candleGlowGfx.fillRect(c.x - 1, c.y - 3, 2, 4);
    }
  }

  private updateLightning(delta: number): void {
    this.lightningTimer -= delta;
    if (this.lightningTimer <= 0) {
      this.lightningTimer = 8000 + Math.random() * 10000;
      this.triggerDistantLightning();
    }
  }

  private triggerDistantLightning(): void {
    // Subtle, momentary blue-white illumination of window silhouettes
    this.lightningGfx.clear();
    this.lightningGfx.fillStyle(0xaac8f0, 0.16);
    this.lightningGfx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    this.time.delayedCall(80, () => {
      this.lightningGfx.clear();
      // Second micro-pulse
      this.time.delayedCall(60, () => {
        this.lightningGfx.fillStyle(0xaac8f0, 0.24);
        this.lightningGfx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        this.time.delayedCall(90, () => {
          this.lightningGfx.clear();
        });
      });
    });
  }

  private triggerStartGame(): void {
    if (this.isStarting) return;
    this.isStarting = true;

    // Flare candle brightness, then fade screen smoothly to black
    this.tweens.killTweensOf(this.newGamePrompt);
    this.newGamePrompt.setAlpha(1);
    this.newGamePrompt.setColor('#ffffff');

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.time.delayedCall(820, () => {
      this.scene.start('MansionScene', { inputManager: this.inputManager });
    });
  }
}
