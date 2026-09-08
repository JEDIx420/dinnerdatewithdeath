import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { InputManager } from '../systems/InputManager';

interface TitleRainStreak {
  x: number;
  y: number;
  speed: number;
  length: number;
  winX: number;
  winY: number;
  winW: number;
  winH: number;
}

export class TitleScene extends Phaser.Scene {
  private inputManager!: InputManager;
  private isStarting: boolean = false;
  private timeAccumulator: number = 0;
  private introTimelineTime: number = 0;
  private introComplete: boolean = false;

  // Title visual components
  private darknessOverlay!: Phaser.GameObjects.Graphics;
  private lightningGfx!: Phaser.GameObjects.Graphics;
  private rainGfx!: Phaser.GameObjects.Graphics;
  private rainMaskGfx!: Phaser.GameObjects.Graphics;
  private rainStreaks: TitleRainStreak[] = [];

  // Stage items
  private winLeft!: Phaser.GameObjects.Sprite;
  private winRight!: Phaser.GameObjects.Sprite;
  private banquetTable!: Phaser.GameObjects.Sprite;
  private tableShadow!: Phaser.GameObjects.Sprite;
  private loveChair!: Phaser.GameObjects.Sprite;
  private deathChair!: Phaser.GameObjects.Sprite;
  private flameSprite1!: Phaser.GameObjects.Sprite;
  private flameSprite2!: Phaser.GameObjects.Sprite;
  private candleGlow1!: Phaser.GameObjects.Sprite;
  private candleGlow2!: Phaser.GameObjects.Sprite;

  // Interactive prompt & typography
  private titleContainer!: Phaser.GameObjects.Container;
  private newGamePrompt!: Phaser.GameObjects.Text;
  private subPrompt!: Phaser.GameObjects.Text;
  private lightningTimer: number = 10000;

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
    this.introTimelineTime = 0;
    this.introComplete = false;
  }

  public create(): void {
    const centerX = GAME_CONFIG.WIDTH / 2;

    // Check for instant skip via query parameter (?intro=skip)
    const params = new URLSearchParams(window.location.search);
    const instantSkip = params.get('intro') === 'skip';

    // 1. Dark nocturnal background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0910, 0x0a0910, 0x040306, 0x040306, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // 2. High gothic arched windows in background
    this.winLeft = this.add.sprite(centerX - 180, 110, 'window_gothic').setAlpha(0);
    this.winRight = this.add.sprite(centerX + 180, 110, 'window_gothic').setAlpha(0);

    // Geometry mask strictly containing rain inside window panes
    this.rainMaskGfx = this.make.graphics({ x: 0, y: 0 });
    this.rainMaskGfx.fillStyle(0xffffff, 1);
    this.rainMaskGfx.fillRect(this.winLeft.x - 26, this.winLeft.y - 32, 52, 70);
    this.rainMaskGfx.fillRect(this.winRight.x - 26, this.winRight.y - 32, 52, 70);

    this.rainGfx = this.add.graphics().setDepth(5).setAlpha(0);
    const rainMask = this.rainMaskGfx.createGeometryMask();
    this.rainGfx.setMask(rainMask);

    for (let i = 0; i < 20; i++) {
      const isLeft = i < 10;
      const winSprite = isLeft ? this.winLeft : this.winRight;
      this.rainStreaks.push({
        x: winSprite.x - 24 + Math.random() * 48,
        y: 65 + Math.random() * 80,
        speed: 130 + Math.random() * 70,
        length: 8 + Math.random() * 10,
        winX: winSprite.x - 26,
        winY: winSprite.y - 32,
        winW: 52,
        winH: 70,
      });
    }

    // 3. Midground: The Waiting Banquet Table
    this.tableShadow = this.add.sprite(centerX, 285, 'shadow_table_hero').setAlpha(0);
    this.tableShadow.setDisplaySize(190, 32);

    // Love's waiting empty chair (left)
    this.loveChair = this.add.sprite(centerX - 95, 235, 'furniture_chair_love').setAlpha(0);

    // Death's chair (right)
    this.deathChair = this.add.sprite(centerX + 95, 235, 'furniture_chair_death').setAlpha(0);

    // The hero banquet table set with crimson runner, wine bottle, glasses
    this.banquetTable = this.add.sprite(centerX, 275, 'furniture_dining_table').setDepth(10).setAlpha(0);

    // Table candles & glowing halos
    if (this.textures.exists('light_glow_warm')) {
      this.candleGlow1 = this.add.sprite(centerX - 52, 252, 'light_glow_warm')
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(0.9)
        .setAlpha(0)
        .setDepth(11);

      this.candleGlow2 = this.add.sprite(centerX + 52, 252, 'light_glow_warm')
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(0.9)
        .setAlpha(0)
        .setDepth(11);
    }

    // Teardrop flame sprites
    if (this.textures.exists('decor_flame_teardrop')) {
      this.flameSprite1 = this.add.sprite(centerX - 52, 252, 'decor_flame_teardrop')
        .setOrigin(0.5, 0.85)
        .setAlpha(0)
        .setDepth(12);

      this.flameSprite2 = this.add.sprite(centerX + 52, 252, 'decor_flame_teardrop')
        .setOrigin(0.5, 0.85)
        .setAlpha(0)
        .setDepth(12);
    }

    // Distant lightning flash layer
    this.lightningGfx = this.add.graphics().setDepth(20);

    // 4. Foreground title typography container
    this.titleContainer = this.add.container(0, 0).setDepth(30).setAlpha(0);

    // Thin elegant crimson rule
    const ruleGfx = this.add.graphics();
    ruleGfx.lineStyle(1.5, 0x7a1826, 0.85);
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
      .setDepth(35)
      .setAlpha(0);

    this.subPrompt = this.add
      .text(centerX, 395, 'Press ENTER or SPACE to Begin', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6e6278',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(35)
      .setAlpha(0);

    // Darkness overlay starting at near total darkness
    this.darknessOverlay = this.add.graphics().setDepth(25);
    this.darknessOverlay.fillStyle(0x06050a, 0.98);
    this.darknessOverlay.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // 5. Input bindings: Clicking or Enter/Space either accelerates/skips intro, or starts game
    this.input.on('pointerdown', () => {
      this.handlePlayerAction();
    });

    this.input.keyboard?.on('keydown-L', () => {
      this.scene.start('AssetLabScene');
    });

    if (instantSkip) {
      this.skipIntroInstantly();
    }
  }

  private skipIntroInstantly(): void {
    this.introTimelineTime = 5000;
    this.introComplete = true;

    this.darknessOverlay.clear();
    this.winLeft.setAlpha(0.65);
    this.winRight.setAlpha(0.65);
    this.rainGfx.setAlpha(1);
    this.tableShadow.setAlpha(0.65);
    this.banquetTable.setAlpha(1);
    this.loveChair.setAlpha(0.85);
    this.deathChair.setAlpha(0.85);
    if (this.candleGlow1) this.candleGlow1.setAlpha(0.35);
    if (this.candleGlow2) this.candleGlow2.setAlpha(0.35);
    if (this.flameSprite1) this.flameSprite1.setAlpha(1);
    if (this.flameSprite2) this.flameSprite2.setAlpha(1);
    this.titleContainer.setAlpha(1);
    this.newGamePrompt.setAlpha(1);
    this.subPrompt.setAlpha(1);

    this.startPromptPulse();
  }

  private handlePlayerAction(): void {
    if (!this.introComplete) {
      this.skipIntroInstantly();
    } else {
      this.triggerStartGame();
    }
  }

  public update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.timeAccumulator += delta;

    // 1. Process Choreographed Intro Timeline if not yet complete
    if (!this.introComplete) {
      this.introTimelineTime += delta;
      this.processIntroTimeline();
    }

    // 2. Animate window rain
    this.updateTitleRain(dt);

    // 3. Flame micro-flicker
    this.updateFlameAnimation();

    // 4. Occasional distant lightning flash (active after intro)
    if (this.introComplete) {
      this.updateLightning(delta);
    }

    // 5. Input handling
    if (this.inputManager.isJustDown('CONFIRM')) {
      this.handlePlayerAction();
    }

    this.inputManager.update();
  }

  /**
   * 0.0s - 4.5s Choreographed Staged Reveal Timeline:
   * 0.0s: near complete darkness
   * 0.4s: single table candle ignites
   * 1.0s: small candle glow reveals part of table
   * 1.5s: second candle ignites
   * 2.0s: windows and rain emerge
   * 2.4s: silhouette of empty chair visible
   * 2.8s: title begins fade
   * 3.8s: title fully visible
   * 4.2s: NEW GAME fades in
   */
  private processIntroTimeline(): void {
    const t = this.introTimelineTime / 1000;

    // 0.4s: Single candle ignites
    if (t >= 0.4 && this.flameSprite1 && this.flameSprite1.alpha === 0) {
      this.tweens.add({ targets: this.flameSprite1, alpha: 1, duration: 250 });
      if (this.candleGlow1) {
        this.tweens.add({ targets: this.candleGlow1, alpha: 0.2, duration: 400 });
      }
    }

    // 1.0s: Table surface and runner revealed
    if (t >= 1.0 && this.banquetTable.alpha === 0) {
      this.tweens.add({ targets: [this.banquetTable, this.tableShadow], alpha: { from: 0, to: 1 }, duration: 800 });
      if (this.candleGlow1) {
        this.tweens.add({ targets: this.candleGlow1, alpha: 0.35, duration: 600 });
      }
    }

    // 1.5s: Second candle ignites
    if (t >= 1.5 && this.flameSprite2 && this.flameSprite2.alpha === 0) {
      this.tweens.add({ targets: this.flameSprite2, alpha: 1, duration: 250 });
      if (this.candleGlow2) {
        this.tweens.add({ targets: this.candleGlow2, alpha: 0.35, duration: 500 });
      }
    }

    // 2.0s: Gothic windows and rain emerge in background
    if (t >= 2.0 && this.winLeft.alpha === 0) {
      this.tweens.add({ targets: [this.winLeft, this.winRight], alpha: 0.65, duration: 700 });
      this.tweens.add({ targets: this.rainGfx, alpha: 1, duration: 700 });
      // Ambient darkness thins
      this.tweens.add({
        targets: this.darknessOverlay,
        alpha: 0.4,
        duration: 900,
        onComplete: () => {
          this.darknessOverlay.clear();
        },
      });
    }

    // 2.4s: Silhouette of empty waiting chair emerges
    if (t >= 2.4 && this.loveChair.alpha === 0) {
      this.tweens.add({ targets: [this.loveChair, this.deathChair], alpha: 0.85, duration: 600 });
    }

    // 2.8s: Title typography begins fading in
    if (t >= 2.8 && this.titleContainer.alpha === 0) {
      this.tweens.add({ targets: this.titleContainer, alpha: 1, duration: 1000 });
    }

    // 4.2s: NEW GAME prompt fades in
    if (t >= 4.2 && !this.introComplete) {
      this.introComplete = true;
      this.tweens.add({
        targets: [this.newGamePrompt, this.subPrompt],
        alpha: 1,
        duration: 500,
        onComplete: () => {
          this.startPromptPulse();
        },
      });
    }
  }

  private startPromptPulse(): void {
    this.tweens.add({
      targets: this.newGamePrompt,
      alpha: { from: 1, to: 0.45 },
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private updateTitleRain(dt: number): void {
    this.rainGfx.clear();
    this.rainGfx.lineStyle(1, 0x8aa0b8, 0.45);

    for (const s of this.rainStreaks) {
      s.y += s.speed * dt;
      s.x -= s.speed * 0.2 * dt;
      if (s.y > s.winY + s.winH) {
        s.y = s.winY;
        s.x = s.winX + Math.random() * s.winW;
      }
      this.rainGfx.lineBetween(s.x, s.y, s.x - s.length * 0.2, s.y + s.length);
    }
  }

  private updateFlameAnimation(): void {
    const t = this.timeAccumulator * 0.005;
    const centerX = GAME_CONFIG.WIDTH / 2;

    if (this.flameSprite1 && this.flameSprite1.alpha > 0) {
      const f1 = Math.sin(t * 3.7) * 0.06;
      this.flameSprite1.setScale(1 + f1 * 0.7, 1 + f1);
      this.flameSprite1.x = centerX - 52 + Math.sin(t * 5.3) * 0.6;
    }
    if (this.flameSprite2 && this.flameSprite2.alpha > 0) {
      const f2 = Math.sin(t * 4.1 + 1.2) * 0.06;
      this.flameSprite2.setScale(1 + f2 * 0.7, 1 + f2);
      this.flameSprite2.x = centerX + 52 + Math.sin(t * 4.7 + 1.5) * 0.6;
    }
  }

  private updateLightning(delta: number): void {
    this.lightningTimer -= delta;
    if (this.lightningTimer <= 0) {
      this.lightningTimer = 12000 + Math.random() * 14000;
      this.triggerDistantLightning();
    }
  }

  private triggerDistantLightning(): void {
    // Subtle, momentary blue-white illumination revealing gothic details
    this.lightningGfx.clear();
    this.lightningGfx.fillStyle(0x829ec2, 0.18);
    this.lightningGfx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    this.time.delayedCall(70, () => {
      this.lightningGfx.clear();
      // Second subtle micro-flash
      this.time.delayedCall(80, () => {
        this.lightningGfx.fillStyle(0x829ec2, 0.26);
        this.lightningGfx.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
        this.time.delayedCall(60, () => {
          this.lightningGfx.clear();
        });
      });
    });
  }

  private triggerStartGame(): void {
    if (this.isStarting) return;
    this.isStarting = true;

    this.tweens.killTweensOf(this.newGamePrompt);
    this.newGamePrompt.setAlpha(1);
    this.newGamePrompt.setColor('#ffffff');

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.time.delayedCall(820, () => {
      this.scene.start('MansionScene', { inputManager: this.inputManager });
    });
  }
}
