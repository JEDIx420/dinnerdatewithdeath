import Phaser from 'phaser';
import { DEPTH_LAYERS } from './DepthSystem';

interface DustMote {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
}

interface RainStreak {
  x: number;
  y: number;
  speed: number;
  length: number;
  alpha: number;
  windowX: number;
  windowY: number;
  windowW: number;
  windowH: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  size: number;
}

export class AmbientFXSystem {
  private scene: Phaser.Scene;
  private isPaused: boolean = false;
  private timeAccumulator: number = 0;

  // Graphics layers
  private fxGfx: Phaser.GameObjects.Graphics;
  private rainGfx: Phaser.GameObjects.Graphics;

  // Dust motes
  private dustMotes: DustMote[] = [];
  private readonly maxDustCount: number = 24;

  // Rain streaks
  private rainStreaks: RainStreak[] = [];

  // Fireplace sparks / embers
  private sparks: Spark[] = [];
  private fireplaceX: number = 0;
  private fireplaceY: number = 0;
  private fireplaceState: 'idle' | 'surge' | 'portal' = 'idle';

  // Exterior silhouette timer (bat crossing window)
  private silhouetteTimer: number = 15000;
  private batSprite: Phaser.GameObjects.Sprite | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Graphics for dust, sparks, and flame micro-elements
    this.fxGfx = scene.add.graphics();
    this.fxGfx.setDepth(DEPTH_LAYERS.FOREGROUND_AMBIENT);

    // Graphics for window rain (rendered just above windows, below foreground trim)
    this.rainGfx = scene.add.graphics();
    this.rainGfx.setDepth(DEPTH_LAYERS.FOREGROUND_AMBIENT - 100);
  }

  /**
   * Initializes floating dust motes clustered in warm light zones.
   */
  public addDustZone(centerX: number, centerY: number, radius: number = 100, count: number = 6): void {
    for (let i = 0; i < count; i++) {
      if (this.dustMotes.length >= this.maxDustCount) break;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      this.dustMotes.push({
        x,
        y,
        originX: centerX,
        originY: centerY,
        radius,
        vx: (Math.random() - 0.5) * 6,
        vy: -2 - Math.random() * 5, // slow upward gentle drift
        alpha: 0.15 + Math.random() * 0.25,
        baseAlpha: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  /**
   * Registers a gothic window area to receive exterior rain streaks.
   */
  public registerWindowRain(x: number, y: number, width: number, height: number, streakCount: number = 8): void {
    for (let i = 0; i < streakCount; i++) {
      this.rainStreaks.push({
        x: x + 4 + Math.random() * (width - 8),
        y: y + 8 + Math.random() * (height - 16),
        speed: 120 + Math.random() * 80,
        length: 8 + Math.random() * 12,
        alpha: 0.25 + Math.random() * 0.35,
        windowX: x + 4,
        windowY: y + 8,
        windowW: width - 8,
        windowH: height - 16,
      });
    }
  }

  /**
   * Registers the mansion hearth for flame and ember generation.
   */
  public registerFireplace(x: number, y: number): void {
    this.fireplaceX = x;
    this.fireplaceY = y;
  }

  public setFireplaceState(state: 'idle' | 'surge' | 'portal'): void {
    this.fireplaceState = state;
  }

  public update(delta: number): void {
    if (this.isPaused) return;

    const dt = delta / 1000;
    this.timeAccumulator += delta;

    this.fxGfx.clear();
    this.rainGfx.clear();

    // 1. Update and draw window rain
    this.updateRain(dt);

    // 2. Update and draw floating dust motes
    this.updateDust(dt);

    // 3. Update and draw fireplace flame layers & embers
    this.updateFireplace(dt);

    // 4. Update occasional exterior silhouette
    this.updateExteriorSilhouettes(delta);
  }

  private updateRain(dt: number): void {
    this.rainGfx.lineStyle(1, 0x889db4, 0.4);

    for (const streak of this.rainStreaks) {
      streak.y += streak.speed * dt;
      streak.x -= streak.speed * 0.25 * dt; // Slight wind slant

      // Reset when exiting window bounds
      if (streak.y > streak.windowY + streak.windowH) {
        streak.y = streak.windowY;
        streak.x = streak.windowX + Math.random() * streak.windowW;
      }
      if (streak.x < streak.windowX) {
        streak.x = streak.windowX + streak.windowW;
      }

      this.rainGfx.lineBetween(
        streak.x,
        streak.y,
        streak.x - streak.length * 0.25,
        streak.y + streak.length
      );
    }
  }

  private updateDust(dt: number): void {
    for (const mote of this.dustMotes) {
      mote.phase += dt * 1.5;
      mote.x += mote.vx * dt + Math.sin(mote.phase) * 0.3;
      mote.y += mote.vy * dt;

      // Keep mote wandering within its light radius
      const dx = mote.x - mote.originX;
      const dy = mote.y - mote.originY;
      if (dx * dx + dy * dy > mote.radius * mote.radius || mote.y < mote.originY - mote.radius) {
        mote.x = mote.originX + (Math.random() - 0.5) * (mote.radius * 1.5);
        mote.y = mote.originY + mote.radius * 0.7;
      }

      // Gentle twinkle
      const currentAlpha = mote.baseAlpha * (0.6 + 0.4 * Math.sin(mote.phase * 2));
      this.fxGfx.fillStyle(0xffe6a8, currentAlpha);
      this.fxGfx.fillCircle(mote.x, mote.y, 1);
    }
  }

  private updateFireplace(dt: number): void {
    if (this.fireplaceX === 0 && this.fireplaceY === 0) return;

    // Organic flame layers in hearth interior (width ~40px, height ~28px)
    const hearthBaseX = this.fireplaceX;
    const hearthBaseY = this.fireplaceY + 20;

    // Multi-layer procedural flame shapes
    const t = this.timeAccumulator * 0.008;
    const stateScale = this.fireplaceState === 'surge' ? 1.6 : this.fireplaceState === 'portal' ? 2.2 : 1.0;

    // Outer crimson flame glow
    const crimsonH = (16 + Math.sin(t * 1.7) * 4) * stateScale;
    this.fxGfx.fillStyle(0xba2418, 0.75);
    this.fxGfx.fillTriangle(
      hearthBaseX - 22, hearthBaseY,
      hearthBaseX + 22, hearthBaseY,
      hearthBaseX + Math.sin(t * 3.1) * 4, hearthBaseY - crimsonH
    );

    // Middle amber/orange flame
    const orangeH = (20 + Math.sin(t * 2.3 + 1) * 5) * stateScale;
    this.fxGfx.fillStyle(0xe86814, 0.85);
    this.fxGfx.fillTriangle(
      hearthBaseX - 16, hearthBaseY,
      hearthBaseX + 16, hearthBaseY,
      hearthBaseX + Math.sin(t * 4.2) * 5, hearthBaseY - orangeH
    );

    // Inner bright yellow flame core
    const yellowH = (12 + Math.sin(t * 3.7 + 2) * 4) * stateScale;
    this.fxGfx.fillStyle(0xffd038, 0.95);
    this.fxGfx.fillTriangle(
      hearthBaseX - 9, hearthBaseY,
      hearthBaseX + 9, hearthBaseY,
      hearthBaseX + Math.sin(t * 5.5) * 3, hearthBaseY - yellowH
    );

    // Spawn sparks / embers occasionally
    if (Math.random() < 0.35 && this.sparks.length < 16) {
      this.sparks.push({
        x: hearthBaseX + (Math.random() - 0.5) * 20,
        y: hearthBaseY - 6,
        vx: (Math.random() - 0.5) * 18,
        vy: -25 - Math.random() * 30,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.6,
        color: Math.random() > 0.4 ? 0xffbf38 : 0xff4818,
        size: 1 + (Math.random() > 0.7 ? 1 : 0),
      });
    }

    // Update and draw embers
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spark = this.sparks[i]!;
      spark.life += dt;
      if (spark.life >= spark.maxLife) {
        this.sparks.splice(i, 1);
        continue;
      }
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;

      const progress = spark.life / spark.maxLife;
      const alpha = 1 - progress;
      this.fxGfx.fillStyle(spark.color, alpha);
      this.fxGfx.fillRect(spark.x, spark.y, spark.size, spark.size);
    }
  }

  private updateExteriorSilhouettes(delta: number): void {
    this.silhouetteTimer -= delta;

    if (this.silhouetteTimer <= 0) {
      // Reset timer between 22 and 38 seconds
      this.silhouetteTimer = 22000 + Math.random() * 16000;
      this.triggerBatSilhouette();
    }
  }

  private triggerBatSilhouette(): void {
    // Fly a tiny bat silhouette across dining north window
    if (!this.scene.textures.exists('silhouette_bat')) return;

    const startX = 420;
    const endX = 520;
    const y = 36 + (Math.random() - 0.5) * 14;

    const bat = this.scene.add.sprite(startX, y, 'silhouette_bat');
    bat.setDepth(DEPTH_LAYERS.BACKGROUND + 50);
    bat.setAlpha(0.45);

    this.scene.tweens.add({
      targets: bat,
      x: endX,
      y: y - 6,
      duration: 1800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        bat.destroy();
      },
    });
  }

  public getParticleCount(): number {
    return this.dustMotes.length + this.rainStreaks.length + this.sparks.length;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public destroy(): void {
    this.fxGfx.destroy();
    this.rainGfx.destroy();
    this.dustMotes = [];
    this.rainStreaks = [];
    this.sparks = [];
    if (this.batSprite) {
      this.batSprite.destroy();
      this.batSprite = null;
    }
  }
}
