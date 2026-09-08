import Phaser from 'phaser';
import { RoomDefinition, SafeBounds } from './RoomDefinition';
import { DEPTH_LAYERS, calculateDynamicDepth } from '../systems/DepthSystem';
import { LightingSystem } from '../systems/LightingSystem';
import { AmbientFXSystem } from '../systems/AmbientFXSystem';

export class MansionRoom {
  private scene: Phaser.Scene;
  private def: RoomDefinition;
  private lightingSystem: LightingSystem;
  private ambientFXSystem: AmbientFXSystem;

  public readonly wallsGroup: Phaser.Physics.Arcade.StaticGroup;
  public readonly furnitureGroup: Phaser.Physics.Arcade.StaticGroup;
  public readonly furnitureSprites: Phaser.GameObjects.Sprite[] = [];

  constructor(
    scene: Phaser.Scene,
    def: RoomDefinition,
    lightingSystem: LightingSystem,
    ambientFXSystem: AmbientFXSystem
  ) {
    this.scene = scene;
    this.def = def;
    this.lightingSystem = lightingSystem;
    this.ambientFXSystem = ambientFXSystem;

    this.wallsGroup = scene.physics.add.staticGroup();
    this.furnitureGroup = scene.physics.add.staticGroup();

    this.buildFloors();
    this.buildWalls();
    this.buildWindows();
    this.buildFurniture();
    this.buildCandles();
    this.buildFireplace();
    this.buildAmbientZones();
  }

  private buildFloors(): void {
    for (const floor of this.def.floors) {
      const tileSprite = this.scene.add.tileSprite(
        floor.x + floor.width / 2,
        floor.y + floor.height / 2,
        floor.width,
        floor.height,
        floor.textureKey
      );
      tileSprite.setDepth(floor.depth ?? DEPTH_LAYERS.FLOOR);
    }
  }

  private buildWalls(): void {
    for (const wall of this.def.walls) {
      // Visual wall sprite
      const wallTile = this.scene.add.tileSprite(
        wall.x + wall.width / 2,
        wall.y + wall.height / 2,
        wall.width,
        wall.height,
        wall.textureKey
      );
      // North walls and high trim are placed at UPPER_WALLS depth
      const depth = wall.y < 96 ? DEPTH_LAYERS.UPPER_WALLS : DEPTH_LAYERS.BACKGROUND + 50;
      wallTile.setDepth(depth);

      // Physical collision body
      if (wall.hasCollision) {
        const colliderY = wall.y + (wall.collisionOffsetY ?? 0) + (wall.collisionHeight ?? wall.height) / 2;
        const colliderH = wall.collisionHeight ?? wall.height;
        const colObj = this.scene.add.zone(
          wall.x + wall.width / 2,
          colliderY,
          wall.width,
          colliderH
        );
        this.scene.physics.add.existing(colObj, true);
        this.wallsGroup.add(colObj);
      }
    }
  }

  private buildWindows(): void {
    for (const win of this.def.windows) {
      // 1. Tall gothic arched window frame
      const winSprite = this.scene.add.sprite(win.x, win.y + win.height / 2, 'window_gothic');
      winSprite.setDepth(DEPTH_LAYERS.UPPER_WALLS + 10);

      // 2. Soft moonlight shaft into room
      this.lightingSystem.addLight(
        `light_${win.id}`,
        win.x,
        win.y + 60,
        90,
        'window',
        0x5c729a,
        0.3
      );

      // 3. Register window area with AmbientFX for rain streaks
      this.ambientFXSystem.registerWindowRain(
        win.x - win.width / 2,
        win.y,
        win.width,
        win.height
      );

      // 4. Subtle animated curtains at sides
      if (win.hasCurtains && this.scene.textures.exists('decor_curtain_left')) {
        const curL = this.scene.add.sprite(win.x - 30, win.y + 40, 'decor_curtain_left');
        const curR = this.scene.add.sprite(win.x + 30, win.y + 40, 'decor_curtain_right');
        curL.setDepth(DEPTH_LAYERS.UPPER_WALLS + 20);
        curR.setDepth(DEPTH_LAYERS.UPPER_WALLS + 20);

        // Sinusoidal subtle breeze displacement
        this.scene.tweens.add({
          targets: [curL, curR],
          scaleX: { from: 1, to: 1.05 },
          angle: { from: 0, to: curL === curL ? 1.5 : -1.5 },
          duration: 3200 + Math.random() * 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }

  private buildFurniture(): void {
    for (const f of this.def.furniture) {
      // 1. Contact shadow if defined
      if (f.shadow && this.scene.textures.exists(f.shadow.textureKey)) {
        const shadow = this.scene.add.sprite(
          f.x + (f.shadow.offsetX ?? 0),
          f.y + (f.shadow.offsetY ?? 0),
          f.shadow.textureKey
        );
        shadow.setDisplaySize(f.shadow.width, f.shadow.height);
        shadow.setDepth(DEPTH_LAYERS.CONTACT_SHADOWS);
        shadow.setAlpha(0.6);
      }

      // 2. Furniture visual sprite
      const sprite = this.scene.add.sprite(f.x, f.y, f.textureKey);
      sprite.setOrigin(f.originX ?? 0.5, f.originY ?? 0.5);

      // Dynamic depth sorting
      const depthOffset = f.depthOffset ?? 0;
      sprite.setDepth(calculateDynamicDepth(f.y, depthOffset));
      this.furnitureSprites.push(sprite);

      // 3. Collision body
      if (f.collision) {
        const colX = f.x + (f.collision.offsetX ?? 0);
        const colY = f.y + (f.collision.offsetY ?? 0);
        const colObj = this.scene.add.zone(colX, colY, f.collision.width, f.collision.height);
        this.scene.physics.add.existing(colObj, true);
        this.furnitureGroup.add(colObj);
      }
    }
  }

  private buildCandles(): void {
    for (const candle of this.def.candles) {
      // 1. Light source in LightingSystem
      this.lightingSystem.addLight(
        candle.id,
        candle.x,
        candle.y + (candle.flameOffsetY ?? -10),
        candle.radius ?? 85,
        'candle',
        candle.color ?? 0xffb444,
        candle.intensity ?? 0.45
      );

      // 2. Visual candle holder & flame sprite
      if (this.scene.textures.exists('decor_candle_single')) {
        const candleSprite = this.scene.add.sprite(candle.x, candle.y, 'decor_candle_single');
        candleSprite.setDepth(calculateDynamicDepth(candle.y, 4));

        // Subtle micro-scale flicker on candle flame
        this.scene.tweens.add({
          targets: candleSprite,
          scaleY: { from: 0.94, to: 1.06 },
          scaleX: { from: 0.97, to: 1.03 },
          duration: 120 + Math.random() * 80,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }

  private buildFireplace(): void {
    if (!this.def.fireplace) return;
    const f = this.def.fireplace;

    // Register hearth light in LightingSystem
    this.lightingSystem.addLight(
      f.id,
      f.x,
      f.y + 16,
      130,
      'fireplace',
      0xff7a28,
      0.65
    );

    // Register with AmbientFX for animated fire and embers
    this.ambientFXSystem.registerFireplace(f.x, f.y);
  }

  private buildAmbientZones(): void {
    // Add sparse floating dust motes in warm pools
    // 1. Dining table candelabra glow
    this.ambientFXSystem.addDustZone(576, 320, 110, 8);
    // 2. Hearth warm glow
    this.ambientFXSystem.addDustZone(992, 120, 90, 6);
    // 3. Dressing mirror vanity
    this.ambientFXSystem.addDustZone(224, 130, 80, 5);
  }

  public getSafeBounds(): SafeBounds {
    return this.def.safeBounds;
  }

  public getSpawnPoint(): { x: number; y: number; direction: string } {
    return this.def.spawnPoint;
  }
}
