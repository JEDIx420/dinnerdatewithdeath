import Phaser from 'phaser';
import { ResolvedEnvironmentObject } from '../environment/EnvironmentComposer';
import { LightingSystem } from './LightingSystem';
import { LightSocketDef } from '../environment/EnvironmentAsset';

export interface ActiveLightFixture {
  resolvedObject: ResolvedEnvironmentObject;
  sockets: Array<{
    def: LightSocketDef;
    worldX: number;
    worldY: number;
    flameSprite?: Phaser.GameObjects.Sprite;
    lightId: string;
  }>;
}

export class LightFixtureSystem {
  private scene: Phaser.Scene;
  private lightingSystem: LightingSystem;
  private fixtures: ActiveLightFixture[] = [];

  constructor(scene: Phaser.Scene, lightingSystem: LightingSystem) {
    this.scene = scene;
    this.lightingSystem = lightingSystem;
  }

  public registerFixture(obj: ResolvedEnvironmentObject): void {
    const sockets = obj.asset?.lightSockets;
    if (!sockets || sockets.length === 0) return;

    const activeSockets: ActiveLightFixture['sockets'] = [];

    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (!socket) continue;
      const lightId = `${obj.placement.id}_light_${i}`;

      // Calculate world coordinates from local offset taking origin, scale, flip into account
      const originX = obj.sprite.originX;
      const originY = obj.sprite.originY;
      const nativeW = obj.asset?.nativeWidth ?? obj.sprite.width;
      const nativeH = obj.asset?.nativeHeight ?? obj.sprite.height;

      // Local offset relative to sprite origin (0,0 is center/top-left based on origin)
      let dx = (socket.localX - originX * nativeW) * obj.sprite.scaleX;
      let dy = (socket.localY - originY * nativeH) * obj.sprite.scaleY;

      if (obj.sprite.flipX) dx = -dx;
      if (obj.sprite.flipY) dy = -dy;

      const worldX = obj.sprite.x + dx;
      const worldY = obj.sprite.y + dy;

      // Register with LightingSystem
      const radius = socket.radius ?? 44;
      const intensity = socket.intensity ?? 0.38;
      const color = socket.color ?? 0xffb444;
      const lightType = socket.kind === 'fireplace' ? 'fireplace' : 'candle';

      this.lightingSystem.addLight(lightId, worldX, worldY, radius, lightType, color, intensity);

      // Create Flame Overlay if requested and texture exists
      let flameSprite: Phaser.GameObjects.Sprite | undefined;
      const flameMode = socket.flameMode ?? 'overlay';

      if (flameMode === 'overlay' && this.scene.textures.exists('decor_flame_teardrop')) {
        flameSprite = this.scene.add.sprite(worldX, worldY, 'decor_flame_teardrop');
        flameSprite.setOrigin(0.5, 0.85); // Pivot at flame wick base
        flameSprite.setDepth(obj.sprite.depth + 4);

        // Gentle desynchronized micro-flicker
        this.scene.tweens.add({
          targets: flameSprite,
          scaleY: { from: 0.92, to: 1.08 },
          scaleX: { from: 0.95, to: 1.05 },
          x: { from: worldX - 0.75, to: worldX + 0.75 },
          duration: 90 + Math.random() * 120,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      activeSockets.push({
        def: socket,
        worldX,
        worldY,
        flameSprite,
        lightId,
      });
    }

    this.fixtures.push({
      resolvedObject: obj,
      sockets: activeSockets,
    });
  }

  public registerAllFixtures(objects: ResolvedEnvironmentObject[]): void {
    for (const obj of objects) {
      this.registerFixture(obj);
    }
  }

  public getFixtures(): ActiveLightFixture[] {
    return this.fixtures;
  }
}
