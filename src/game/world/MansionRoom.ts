import Phaser from 'phaser';
import { RoomDefinition, SafeBounds } from './RoomDefinition';
import { Direction } from '../entities/CharacterManifest';
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
    this.buildStaircase();
    this.buildWalls();
    this.buildArchitectureDetails();
    this.buildWindows();
    this.buildFurniture();
    this.buildCandles();
    this.buildFireplace();
    this.buildAmbientZones();
  }

  private buildFloors(): void {
    for (const floor of this.def.floors) {
      if (floor.isSprite) {
        const sprite = this.scene.add.sprite(
          floor.x + floor.width / 2,
          floor.y + floor.height / 2,
          floor.textureKey
        );
        sprite.setDisplaySize(floor.width, floor.height);
        sprite.setDepth(floor.depth ?? DEPTH_LAYERS.FLOOR);
      } else {
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
  }

  private buildStaircase(): void {
    if (!this.def.staircase) return;
    const sc = this.def.staircase;

    // Build steps descending from top landing to great hall floor
    for (let s = 0; s < sc.stepCount; s++) {
      const stepY = sc.y + s * 32;
      const stepDepth = calculateDynamicDepth(stepY, 2);

      // 1. Step tread / base
      if (this.scene.textures.exists('stair_tread_wide')) {
        const treadSprite = this.scene.add.sprite(
          sc.x + sc.width / 2,
          stepY + 16,
          'stair_tread_wide'
        );
        treadSprite.setDisplaySize(sc.width, 32);
        treadSprite.setDepth(stepDepth);
      } else if (this.scene.textures.exists(sc.stepTextureKey)) {
        const stepSprite = this.scene.add.sprite(
          sc.x + sc.width / 2,
          stepY + 16,
          sc.stepTextureKey
        );
        stepSprite.setDepth(stepDepth);
      }

      // 2. Central runner carpet
      if (this.scene.textures.exists('stair_runner_carpet_wide')) {
        const runnerSprite = this.scene.add.sprite(
          sc.x + sc.width / 2,
          stepY + 16,
          'stair_runner_carpet_wide'
        );
        runnerSprite.setDisplaySize(112, 32);
        runnerSprite.setDepth(stepDepth + 1);
      }

      // 3. Brass stair carpet rod at step bend
      if (this.scene.textures.exists('stair_rod_brass')) {
        const rodSprite = this.scene.add.sprite(
          sc.x + sc.width / 2,
          stepY + 28,
          'stair_rod_brass'
        );
        rodSprite.setDisplaySize(116, 8);
        rodSprite.setDepth(stepDepth + 2);
      }

      // 4. Left stringer / balustrade segment
      const balL = this.scene.add.sprite(
        sc.x + 8,
        stepY + 16,
        this.scene.textures.exists('stair_stringer_step_left')
          ? 'stair_stringer_step_left'
          : sc.balustradeLeftKey
      );
      balL.setDepth(calculateDynamicDepth(stepY, 14));

      // 5. Right stringer / balustrade segment
      const balR = this.scene.add.sprite(
        sc.x + sc.width - 8,
        stepY + 16,
        this.scene.textures.exists('stair_stringer_step_right')
          ? 'stair_stringer_step_right'
          : sc.balustradeRightKey
      );
      balR.setDepth(calculateDynamicDepth(stepY, 14));
    }
  }

  private buildArchitectureDetails(): void {
    if (!this.def.architecture) return;

    for (const arch of this.def.architecture) {
      if (!this.scene.textures.exists(arch.textureKey)) {
        continue;
      }

      const sprite = this.scene.add.sprite(arch.x, arch.y, arch.textureKey);
      sprite.setOrigin(arch.originX ?? 0.5, arch.originY ?? 0.5);

      if (arch.flipX) sprite.setFlipX(true);
      if (arch.flipY) sprite.setFlipY(true);
      if (arch.scale) sprite.setScale(arch.scale);

      const depth =
        arch.depth ?? calculateDynamicDepth(arch.y, arch.depthOffset ?? 0);
      sprite.setDepth(depth);

      // If architectural element has collision (e.g. column base or archway pillar)
      if (arch.collision) {
        const colX = arch.x + (arch.collision.offsetX ?? 0);
        const colY = arch.y + (arch.collision.offsetY ?? 0);
        const colObj = this.scene.add.zone(
          colX,
          colY,
          arch.collision.width,
          arch.collision.height
        );
        this.scene.physics.add.existing(colObj, true);
        this.wallsGroup.add(colObj);
      }
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

      // Depth sorting based on wall type:
      // Architectural North walls are placed at UPPER_WALLS depth so characters walk in front of base
      let depth = DEPTH_LAYERS.BACKGROUND + 50;
      if (wall.textureKey === 'wall_architectural_north') {
        depth = DEPTH_LAYERS.UPPER_WALLS;
      } else if (wall.textureKey === 'balustrade_rail') {
        // Balustrade overlook rails sort dynamically so player on landing stands behind rail
        depth = calculateDynamicDepth(wall.y + wall.height, 4);
      }
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
        64,
        'window',
        0x5c729a,
        0.28
      );

      // 3. Register window area with AmbientFX for rain streaks (strictly masked)
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
          angle: { from: 0, to: 1.5 },
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
      // 1. Localized light source in LightingSystem (restrained radius & soft halo)
      this.lightingSystem.addLight(
        candle.id,
        candle.x,
        candle.y + (candle.flameOffsetY ?? -10),
        candle.radius ?? 44,
        'candle',
        candle.color ?? 0xffb444,
        candle.intensity ?? 0.38
      );

      // 2. Visual brass candlestick holder
      if (this.scene.textures.exists('decor_candle_single')) {
        const candleSprite = this.scene.add.sprite(candle.x, candle.y, 'decor_candle_single');
        candleSprite.setDepth(calculateDynamicDepth(candle.y, 4));
      }

      // 3. Tapered teardrop flame with desynchronized organic flicker & drift
      if (this.scene.textures.exists('decor_flame_teardrop')) {
        const flameY = candle.y + (candle.flameOffsetY ?? -10);
        const flameSprite = this.scene.add.sprite(candle.x, flameY, 'decor_flame_teardrop');
        flameSprite.setOrigin(0.5, 0.85); // pivot at base of teardrop flame
        flameSprite.setDepth(calculateDynamicDepth(candle.y, 6));

        // Desynchronized organic micro-scale flicker
        this.scene.tweens.add({
          targets: flameSprite,
          scaleY: { from: 0.92, to: 1.08 },
          scaleX: { from: 0.95, to: 1.05 },
          x: { from: candle.x - 0.75, to: candle.x + 0.75 },
          duration: 90 + Math.random() * 120,
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

    // Register hearth light in LightingSystem (localized warmth)
    this.lightingSystem.addLight(
      f.id,
      f.x,
      f.y + 16,
      96,
      'fireplace',
      0xff7a28,
      0.55
    );

    // Register with AmbientFX for animated 4-layer fire and rising embers
    this.ambientFXSystem.registerFireplace(f.x, f.y);
  }

  private buildAmbientZones(): void {
    // Add sparse floating dust motes in warm ambient pools
    // 1. Bedchamber Vanity mirror pool
    this.ambientFXSystem.addDustZone(200, 140, 70, 5);
    // 2. Upper Landing sconces pool
    this.ambientFXSystem.addDustZone(640, 160, 80, 5);
    // 3. Great Hall Chandelier pool
    this.ambientFXSystem.addDustZone(640, 680, 100, 6);
    // 4. Hero Dining Banquet table pool
    this.ambientFXSystem.addDustZone(240, 720, 90, 7);
    // 5. Lounge Hearth pool
    this.ambientFXSystem.addDustZone(1040, 640, 90, 6);
  }

  public getSafeBounds(): SafeBounds {
    return this.def.safeBounds;
  }

  public getSpawnPoint(): { x: number; y: number; direction: Direction } {
    return this.def.spawnPoint;
  }
}
