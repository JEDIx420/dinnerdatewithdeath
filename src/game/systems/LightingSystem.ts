import Phaser from 'phaser';
import { DEPTH_LAYERS } from './DepthSystem';

export interface LightSource {
  id: string;
  x: number;
  y: number;
  baseRadius: number;
  currentRadius: number;
  baseIntensity: number;
  currentIntensity: number;
  type: 'candle' | 'fireplace' | 'window' | 'static';
  color: number;
  flickerOffset: number;
}

export class LightingSystem {
  private scene: Phaser.Scene;
  private lights: Map<string, LightSource> = new Map();
  private darknessGfx: Phaser.GameObjects.Graphics;
  private glowContainer: Phaser.GameObjects.Container;
  private ambientAlpha: number = 0.35; // Dark, moody, but cleanly readable
  private ambientColor: number = 0x07060e; // Deep gothic blue-black
  private timeAccumulator: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Additive glow container (warm halos directly over candle flames and hearth)
    this.glowContainer = scene.add.container(0, 0);
    this.glowContainer.setDepth(DEPTH_LAYERS.LIGHTING_OVERLAY - 50);

    // Darkness overlay graphics
    this.darknessGfx = scene.add.graphics();
    this.darknessGfx.setDepth(DEPTH_LAYERS.LIGHTING_OVERLAY);
  }

  public addLight(
    id: string,
    x: number,
    y: number,
    radius: number,
    type: 'candle' | 'fireplace' | 'window' | 'static' = 'candle',
    color: number = 0xffb444,
    intensity: number = 0.4
  ): LightSource {
    const light: LightSource = {
      id,
      x,
      y,
      baseRadius: radius,
      currentRadius: radius,
      baseIntensity: intensity,
      currentIntensity: intensity,
      type,
      color,
      flickerOffset: Math.random() * 1000,
    };
    this.lights.set(id, light);

    // Warm radial glow sprite at light source
    const glowKey = type === 'window' ? 'light_glow_cool' : 'light_glow_warm';
    if (this.scene.textures.exists(glowKey)) {
      const glowSprite = this.scene.add.sprite(x, y, glowKey);
      glowSprite.setBlendMode(Phaser.BlendModes.ADD);
      glowSprite.setScale(radius / 64);
      glowSprite.setAlpha(intensity * 0.5);
      glowSprite.setData('lightId', id);
      this.glowContainer.add(glowSprite);
    }

    return light;
  }

  public getLight(id: string): LightSource | undefined {
    return this.lights.get(id);
  }

  public update(delta: number): void {
    this.timeAccumulator += delta;

    // Update flicker on candles and fireplace
    for (const light of this.lights.values()) {
      if (light.type === 'candle') {
        // Desynchronized organic candle flicker
        const t = (this.timeAccumulator + light.flickerOffset) * 0.005;
        const noise = Math.sin(t * 3.1) * 0.5 + Math.sin(t * 7.7) * 0.3 + Math.sin(t * 13.3) * 0.2;
        light.currentRadius = light.baseRadius * (1 + noise * 0.08);
        light.currentIntensity = light.baseIntensity * (1 + noise * 0.12);
      } else if (light.type === 'fireplace') {
        // Organic undulating hearth fire pulse
        const t = (this.timeAccumulator + light.flickerOffset) * 0.003;
        const pulse = Math.sin(t * 2.3) * 0.6 + Math.sin(t * 5.1) * 0.4;
        light.currentRadius = light.baseRadius * (1 + pulse * 0.12);
        light.currentIntensity = light.baseIntensity * (1 + pulse * 0.15);
      }

      // Update matching glow sprite
      const sprite = this.glowContainer.list.find(
        (obj) => (obj as Phaser.GameObjects.Sprite).getData('lightId') === light.id
      ) as Phaser.GameObjects.Sprite | undefined;
      if (sprite) {
        sprite.setScale(light.currentRadius / 64);
        sprite.setAlpha(light.currentIntensity * 0.55);
      }
    }

    // Redraw ambient darkness overlay with soft radial cutouts
    this.renderDarkness();
  }

  private renderDarkness(): void {
    this.darknessGfx.clear();

    // Dark ambient wash over camera viewport
    const cam = this.scene.cameras.main;
    const viewX = cam.worldView.x - 16;
    const viewY = cam.worldView.y - 16;
    const viewW = cam.worldView.width + 32;
    const viewH = cam.worldView.height + 32;

    // Semi-transparent ambient darkness
    this.darknessGfx.fillStyle(this.ambientColor, this.ambientAlpha);
    this.darknessGfx.fillRect(viewX, viewY, viewW, viewH);

    // Subtract/soften darkness around lights by drawing counter-tinted concentric rings
    for (const light of this.lights.values()) {
      // Check if light is near camera viewport
      if (
        light.x < viewX - light.currentRadius ||
        light.x > viewX + viewW + light.currentRadius ||
        light.y < viewY - light.currentRadius ||
        light.y > viewY + viewH + light.currentRadius
      ) {
        continue;
      }

      const steps = 4;
      const stepRadius = light.currentRadius / steps;
      for (let i = steps; i >= 1; i--) {
        const r = stepRadius * i;
        const ringAlpha = (1 - i / (steps + 1)) * (light.currentIntensity * 0.38);
        this.darknessGfx.fillStyle(light.color, ringAlpha);
        this.darknessGfx.fillCircle(light.x, light.y, r);
      }
    }
  }

  public setAmbientDarkness(alpha: number): void {
    this.ambientAlpha = Phaser.Math.Clamp(alpha, 0, 1);
  }

  public getLightsCount(): number {
    return this.lights.size;
  }

  public destroy(): void {
    this.darknessGfx.destroy();
    this.glowContainer.destroy();
    this.lights.clear();
  }
}
