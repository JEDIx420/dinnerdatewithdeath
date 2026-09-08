import Phaser from 'phaser';
import { ResolvedEnvironmentObject } from '../environment/EnvironmentComposer';
import { AmbientFXSystem } from './AmbientFXSystem';
import { LightingSystem } from './LightingSystem';
import { DEPTH_LAYERS } from './DepthSystem';

export interface ActiveMansionWindow {
  resolvedObject: ResolvedEnvironmentObject;
  worldMaskRects: Array<{ x: number; y: number; width: number; height: number }>;
}

export class WindowSystem {
  private scene: Phaser.Scene;
  private ambientFX: AmbientFXSystem;
  private lightingSystem: LightingSystem;
  private activeWindows: ActiveMansionWindow[] = [];

  constructor(scene: Phaser.Scene, ambientFX: AmbientFXSystem, lightingSystem: LightingSystem) {
    this.scene = scene;
    this.ambientFX = ambientFX;
    this.lightingSystem = lightingSystem;
  }

  public registerWindow(obj: ResolvedEnvironmentObject, hasCurtains: boolean = true): void {
    const masks = obj.asset?.windowMasks;
    const worldRects: ActiveMansionWindow['worldMaskRects'] = [];

    if (masks && masks.length > 0) {
      for (const m of masks) {
        const originX = obj.sprite.originX;
        const originY = obj.sprite.originY;
        const nativeW = obj.asset?.nativeWidth ?? obj.sprite.width;
        const nativeH = obj.asset?.nativeHeight ?? obj.sprite.height;

        const left = obj.sprite.x + (m.localX - originX * nativeW) * obj.sprite.scaleX;
        const top = obj.sprite.y + (m.localY - originY * nativeH) * obj.sprite.scaleY;
        const w = m.width * obj.sprite.scaleX;
        const h = m.height * obj.sprite.scaleY;

        worldRects.push({ x: left, y: top, width: w, height: h });
        this.ambientFX.registerWindowRain(left, top, w, h);
      }
    } else {
      // Fallback to central portion of window sprite
      const w = obj.sprite.width * 0.65;
      const h = obj.sprite.height * 0.7;
      const left = obj.sprite.x - w / 2;
      const top = obj.sprite.y - obj.sprite.height * obj.sprite.originY + 16;
      worldRects.push({ x: left, y: top, width: w, height: h });
      this.ambientFX.registerWindowRain(left, top, w, h);
    }

    // Register subtle cool moonlight halo
    this.lightingSystem.addLight(
      `${obj.placement.id}_moonlight`,
      obj.sprite.x,
      obj.sprite.y - obj.sprite.height * 0.2,
      70,
      'window',
      0x5c729a,
      0.22
    );

    // Subtle animated curtains
    if (hasCurtains && this.scene.textures.exists('decor_curtain_left')) {
      const curL = this.scene.add.sprite(
        obj.sprite.x - obj.sprite.width * 0.45,
        obj.sprite.y + 20,
        'decor_curtain_left'
      );
      const curR = this.scene.add.sprite(
        obj.sprite.x + obj.sprite.width * 0.45,
        obj.sprite.y + 20,
        'decor_curtain_right'
      );
      curL.setDepth(DEPTH_LAYERS.BACK_WALL_DETAIL + 20);
      curR.setDepth(DEPTH_LAYERS.BACK_WALL_DETAIL + 20);

      this.scene.tweens.add({
        targets: [curL, curR],
        scaleX: { from: 1, to: 1.05 },
        angle: { from: 0, to: 1.5 },
        duration: 3200 + Math.random() * 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    this.activeWindows.push({
      resolvedObject: obj,
      worldMaskRects: worldRects,
    });
  }

  public getActiveWindows(): ActiveMansionWindow[] {
    return this.activeWindows;
  }
}
