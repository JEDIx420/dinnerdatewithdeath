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

import { LightingSystem } from './LightingSystem';

export class AmbientFXSystem {
  private scene: Phaser.Scene;
  private isPaused: boolean = false;
  private timeAccumulator: number = 0;
  private lightingSystem?: LightingSystem;

  // Graphics layers
  private fxGfx: Phaser.GameObjects.Graphics;
  private rainGfx: Phaser.GameObjects.Graphics;
  private maskGfx: Phaser.GameObjects.Graphics;
  private windowMask: Phaser.Display.Masks.GeometryMask;

  // Dust motes
  private dustMotes: DustMote[] = [];
  private readonly maxDustCount: number = 28;

  // Rain streaks
  private rainStreaks: RainStreak[] = [];

  // Fireplace sparks / embers
  private sparks: Spark[] = [];
  private fireplaceX: number = 0;
  private fireplaceY: number = 0;
  private fireplaceState: 'idle' | 'surge' | 'portal' = 'idle';

  // Periodic distant lightning (14 - 28 second interval)
  private lightningTimer: number = 14000 + Math.random() * 8000;

  // Exterior silhouette timer (bat crossing window)
  private silhouetteTimer: number = 20000;
  private batSprite: Phaser.GameObjects.Sprite | null = null;

  constructor(scene: Phaser.Scene, lightingSystem?: LightingSystem) {
    this.scene = scene;
    this.lightingSystem = lightingSystem;

    // Graphics for dust, sparks, and flame micro-elements
    this.fxGfx = scene.add.graphics();
    this.fxGfx.setDepth(DEPTH_LAYERS.FOREGROUND_AMBIENT);

    // Graphics for window rain (rendered just above window panes, behind all furniture)
    this.rainGfx = scene.add.graphics();
    this.rainGfx.setDepth(DEPTH_LAYERS.BACK_WALL_DETAIL + 5);

    // Geometry mask graphics strictly containing rain within window panes
    this.maskGfx = scene.make.graphics({ x: 0, y: 0 });
    this.windowMask = this.maskGfx.createGeometryMask();
    this.rainGfx.setMask(this.windowMask);
  }

  public setLightingSystem(lighting: LightingSystem): void {
    this.lightingSystem = lighting;
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
   * Registers a gothic window area to receive exterior rain streaks,
   * strictly clipped to the interior glass bounds.
   */
  public registerWindowRain(x: number, y: number, width: number, height: number, streakCount: number = 8): void {
    const glassX = x + 6;
    const glassY = y + 12;
    const glassW = width - 12;
    const glassH = height - 24;

    // Expand GPU geometry mask to include this window's glass pane
    this.maskGfx.fillStyle(0xffffff, 1);
    this.maskGfx.fillRect(glassX, glassY, glassW, glassH);

    for (let i = 0; i < streakCount; i++) {
      this.rainStreaks.push({
        x: glassX + Math.random() * glassW,
        y: glassY + Math.random() * glassH,
        speed: 120 + Math.random() * 80,
        length: 8 + Math.random() * 12,
        alpha: 0.25 + Math.random() * 0.35,
        windowX: glassX,
        windowY: glassY,
        windowW: glassW,
        windowH: glassH,
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

    // 1. Update and draw window rain (strictly masked)
    this.updateRain(dt);

    // 2. Update and draw floating dust motes
    this.updateDust(dt);

    // 3. Update and draw fireplace flame layers & embers
    this.updateFireplace(dt);

    // 4. Update periodic distant lightning
    this.updateLightning(delta);

    // 5. Update occasional exterior silhouette
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

    // Organic flame layers in hearth interior (width ~48px, height ~32px)
    const hearthBaseX = this.fireplaceX;
    const hearthBaseY = this.fireplaceY + 20;

    // Multi-layer procedural flame shapes
    const t = this.timeAccumulator * 0.008;
    const stateScale = this.fireplaceState === 'surge' ? 1.6 : this.fireplaceState === 'portal' ? 2.2 : 1.0;

    // Layer 1: Outer crimson flame
    const crimsonH = (18 + Math.sin(t * 1.5) * 4) * stateScale;
    this.fxGfx.fillStyle(0xb41e14, 0.75);
    this.fxGfx.fillTriangle(
      hearthBaseX - 24, hearthBaseY,
      hearthBaseX + 24, hearthBaseY,
      hearthBaseX + Math.sin(t * 2.8) * 5, hearthBaseY - crimsonH
    );

    // Layer 2: Middle vibrant orange flame
    const orangeH = (22 + Math.sin(t * 2.2 + 1) * 5) * stateScale;
    this.fxGfx.fillStyle(0xeb6412, 0.85);
    this.fxGfx.fillTriangle(
      hearthBaseX - 18, hearthBaseY,
      hearthBaseX + 18, hearthBaseY,
      hearthBaseX + Math.sin(t * 3.8) * 4, hearthBaseY - orangeH
    );

    // Layer 3: Inner bright yellow flame core
    const yellowH = (14 + Math.sin(t * 3.5 + 2) * 4) * stateScale;
    this.fxGfx.fillStyle(0xffc828, 0.95);
    this.fxGfx.fillTriangle(
      hearthBaseX - 11, hearthBaseY,
      hearthBaseX + 11, hearthBaseY,
      hearthBaseX + Math.sin(t * 5.2) * 3, hearthBaseY - yellowH
    );

    // Layer 4: Hot white-yellow needle core tip
    const hotH = (8 + Math.sin(t * 6.2 + 3) * 2) * stateScale;
    this.fxGfx.fillStyle(0xfff8d0, 0.98);
    this.fxGfx.fillTriangle(
      hearthBaseX - 4, hearthBaseY,
      hearthBaseX + 4, hearthBaseY,
      hearthBaseX + Math.sin(t * 7.1) * 2, hearthBaseY - hotH
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

  private updateLightning(delta: number): void {
    this.lightningTimer -= delta;
    if (this.lightningTimer <= 0) {
      // 14 - 28 second interval
      this.lightningTimer = 14000 + Math.random() * 14000;
      this.triggerLightningFlash();
    }
  }

  private triggerLightningFlash(): void {
    const doubleFlash = Math.random() < 0.45;
    this.lightingSystem?.triggerLightning(0.65);

    if (doubleFlash) {
      this.scene.time.delayedCall(120, () => {
        this.lightingSystem?.triggerLightning(0.4);
      });
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

    const startX = 140;
    const endX = 240;
    const y = 480 + (Math.random() - 0.5) * 14;

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
    this.maskGfx.destroy();
    this.windowMask.destroy();
    this.dustMotes = [];
    this.rainStreaks = [];
    this.sparks = [];
    if (this.batSprite) {
      this.batSprite.destroy();
      this.batSprite = null;
    }
  }
}
