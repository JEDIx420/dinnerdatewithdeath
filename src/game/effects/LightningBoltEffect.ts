import Phaser from 'phaser';
import {
  LightningBoltData,
  LightningPathConfig,
  generateLightningBolt,
  getAuthoringStrikeConfig,
  RngFn,
} from './LightningBoltGeometry';

export interface LightningEventPayload {
  intensity: 'distant' | 'medium' | 'hero';
  distance: number;
  delayToThunder: number;
}

export type LightningListener = (payload: LightningEventPayload) => void;

export class LightningBoltEffect {
  private scene: Phaser.Scene;
  private boltGfx: Phaser.GameObjects.Graphics;
  private ambientGfx: Phaser.GameObjects.Graphics;
  private activeTimers: Phaser.Time.TimerEvent[] = [];
  private listeners: LightningListener[] = [];
  private isDestroyed: boolean = false;

  constructor(scene: Phaser.Scene, depth: number = 22) {
    this.scene = scene;

    // Ambient illumination wash (soft, low alpha)
    this.ambientGfx = scene.add.graphics().setDepth(depth - 1);

    // Main bolt graphics with ADD blend mode for crisp electrical glow
    this.boltGfx = scene.add.graphics().setDepth(depth);
    this.boltGfx.setBlendMode(Phaser.BlendModes.ADD);
  }

  public onLightning(listener: LightningListener): void {
    this.listeners.push(listener);
  }

  /**
   * Fires an authored or procedural lightning strike event.
   * Multi-phase flicker reuses the exact same generated polyline geometry!
   */
  public strike(
    configOrPreset:
      | LightningPathConfig
      | 'intro_hero'
      | 'screen_diagonal_left'
      | 'screen_diagonal_right'
      | 'window_top_left'
      | 'window_top_right',
    rng?: RngFn
  ): LightningBoltData {
    if (this.isDestroyed) {
      throw new Error('Cannot strike destroyed LightningBoltEffect');
    }

    const config =
      typeof configOrPreset === 'string'
        ? getAuthoringStrikeConfig(
            configOrPreset,
            this.scene.scale.width,
            this.scene.scale.height
          )
        : configOrPreset;

    const boltData = generateLightningBolt(config, rng);
    this.executeMultiPhaseFlash(boltData);

    // Notify listeners for future audio integration
    const payload: LightningEventPayload = {
      intensity: boltData.intensity,
      distance: boltData.intensity === 'hero' ? 0.2 : boltData.intensity === 'medium' ? 0.5 : 0.9,
      delayToThunder:
        boltData.intensity === 'hero' ? 0.35 : boltData.intensity === 'medium' ? 0.9 : 1.8,
    };
    for (const listener of this.listeners) {
      listener(payload);
    }

    return boltData;
  }

  private executeMultiPhaseFlash(boltData: LightningBoltData): void {
    // Clear any leftover timers
    this.clearTimers();

    const isHero = boltData.intensity === 'hero';
    const isMedium = boltData.intensity === 'medium';

    // Phase 1: Main initial flash (bright)
    this.renderBolt(boltData, 1.0);
    this.renderAmbientIllumination(
      isHero ? 0.12 : isMedium ? 0.07 : 0.04
    );

    // Phase 2: Rapid extinguish (~40-50ms later)
    const t1 = this.scene.time.delayedCall(isHero ? 50 : 40, () => {
      if (this.isDestroyed) return;
      this.clearGraphics();

      // Phase 3: Secondary pulse along the same electrical channel (~50ms later)
      const t2 = this.scene.time.delayedCall(isHero ? 60 : 45, () => {
        if (this.isDestroyed) return;
        this.renderBolt(boltData, isHero ? 0.75 : 0.45);
        this.renderAmbientIllumination(
          isHero ? 0.08 : isMedium ? 0.04 : 0.02
        );

        // Phase 4: Final extinguish (~60ms later)
        const t3 = this.scene.time.delayedCall(isHero ? 70 : 50, () => {
          if (this.isDestroyed) return;
          this.clearGraphics();
        });
        this.activeTimers.push(t3);
      });
      this.activeTimers.push(t2);
    });
    this.activeTimers.push(t1);
  }

  private renderBolt(boltData: LightningBoltData, intensityFactor: number): void {
    this.boltGfx.clear();

    const isHero = boltData.intensity === 'hero';

    // 1. Layer 1: Outer diffuse blue glow
    this.drawPolyline(
      boltData,
      isHero ? 6 : 4,
      0x5a7ca8,
      0.22 * intensityFactor
    );

    // 2. Layer 2: Mid blue-white glow
    this.drawPolyline(
      boltData,
      isHero ? 3 : 2,
      0xb8d4f8,
      0.65 * intensityFactor
    );

    // 3. Layer 3: Razor-crisp pure white core (1px)
    this.drawPolyline(
      boltData,
      1,
      0xffffff,
      1.0 * intensityFactor
    );
  }

  private drawPolyline(
    boltData: LightningBoltData,
    lineWidth: number,
    color: number,
    alpha: number
  ): void {
    this.boltGfx.lineStyle(lineWidth, color, alpha);

    // Draw main path
    const pts = boltData.mainPoints;
    if (pts.length >= 2) {
      this.boltGfx.beginPath();
      this.boltGfx.moveTo(pts[0]!.x, pts[0]!.y);
      for (let i = 1; i < pts.length; i++) {
        this.boltGfx.lineTo(pts[i]!.x, pts[i]!.y);
      }
      this.boltGfx.strokePath();
    }

    // Draw branches
    for (const b of boltData.branches) {
      if (b.points.length >= 2) {
        const branchWidth = Math.max(1, Math.round(lineWidth * b.thicknessRatio));
        this.boltGfx.lineStyle(branchWidth, color, alpha * 0.85);
        this.boltGfx.beginPath();
        this.boltGfx.moveTo(b.points[0]!.x, b.points[0]!.y);
        for (let i = 1; i < b.points.length; i++) {
          this.boltGfx.lineTo(b.points[i]!.x, b.points[i]!.y);
        }
        this.boltGfx.strokePath();
      }
    }
  }

  private renderAmbientIllumination(alpha: number): void {
    this.ambientGfx.clear();
    if (alpha <= 0) return;

    // Very restrained cool blue wash across the storm sky/windows
    this.ambientGfx.fillStyle(0x768eb4, alpha);
    this.ambientGfx.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
  }

  public clearGraphics(): void {
    if (this.boltGfx && this.boltGfx.active) {
      this.boltGfx.clear();
    }
    if (this.ambientGfx && this.ambientGfx.active) {
      this.ambientGfx.clear();
    }
  }

  private clearTimers(): void {
    for (const timer of this.activeTimers) {
      timer.remove(false);
    }
    this.activeTimers = [];
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.clearTimers();
    this.clearGraphics();
    this.boltGfx.destroy();
    this.ambientGfx.destroy();
    this.listeners = [];
  }
}
