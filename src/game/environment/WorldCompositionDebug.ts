import Phaser from 'phaser';
import { ResolvedEnvironmentObject } from './EnvironmentComposer';

export class WorldCompositionDebug {
  private gfx: Phaser.GameObjects.Graphics;
  private isEnabled: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.gfx = scene.add.graphics().setDepth(10005);
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.gfx.clear();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  public render(
    resolvedObjects: ResolvedEnvironmentObject[],
    structuralBarriers?: Phaser.GameObjects.Zone[]
  ): void {
    if (!this.isEnabled) return;
    this.gfx.clear();

    // 1. Draw Structural / Physics Barriers in Green
    this.gfx.lineStyle(1.5, 0x00ff66, 0.85);
    this.gfx.fillStyle(0x00ff66, 0.2);

    for (const obj of resolvedObjects) {
      if (obj.footprint && obj.footprint.width > 0) {
        const left = obj.groundAnchorX + obj.footprint.offsetX - obj.footprint.width / 2;
        const top = obj.groundAnchorY + obj.footprint.offsetY - obj.footprint.height / 2;
        this.gfx.fillRect(left, top, obj.footprint.width, obj.footprint.height);
        this.gfx.strokeRect(left, top, obj.footprint.width, obj.footprint.height);
      }
    }

    if (structuralBarriers) {
      for (const barrier of structuralBarriers) {
        const left = barrier.x - barrier.width / 2;
        const top = barrier.y - barrier.height / 2;
        this.gfx.fillRect(left, top, barrier.width, barrier.height);
        this.gfx.strokeRect(left, top, barrier.width, barrier.height);
      }
    }

    // 2. Draw Ground / Sort Anchors in Yellow
    for (const obj of resolvedObjects) {
      this.gfx.fillStyle(0xffdd00, 1.0);
      this.gfx.fillCircle(obj.groundAnchorX, obj.groundAnchorY, 3);
      this.gfx.lineStyle(1, 0xffdd00, 0.7);
      this.gfx.lineBetween(
        obj.groundAnchorX - 6,
        obj.groundAnchorY,
        obj.groundAnchorX + 6,
        obj.groundAnchorY
      );
    }

    // 3. Draw Sprite Origins in Cyan
    for (const obj of resolvedObjects) {
      this.gfx.fillStyle(0x00e5ff, 1.0);
      this.gfx.fillCircle(obj.sprite.x, obj.sprite.y, 2);
    }

    // 4. Draw Symmetry Axis (Mansion Center X = 640) in Magenta
    this.gfx.lineStyle(1, 0xff00cc, 0.45);
    this.gfx.lineBetween(640, 0, 640, 960);
  }

  public destroy(): void {
    this.gfx.destroy();
  }
}
