import Phaser from 'phaser';
import { RoomDefinition, SafeBounds } from './RoomDefinition';
import { Direction } from '../entities/CharacterManifest';
import { DEPTH_LAYERS, calculateDynamicDepth } from '../systems/DepthSystem';
import { LightingSystem } from '../systems/LightingSystem';
import { AmbientFXSystem } from '../systems/AmbientFXSystem';
import {
  EnvironmentComposer,
  ResolvedEnvironmentObject,
} from '../environment/EnvironmentComposer';
import { LightFixtureSystem, ActiveLightFixture } from '../systems/LightFixtureSystem';
import { WindowSystem } from '../systems/WindowSystem';

export class MansionRoom {
  private scene: Phaser.Scene;
  private def: RoomDefinition;
  private lightingSystem: LightingSystem;
  private ambientFXSystem: AmbientFXSystem;

  public readonly wallsGroup: Phaser.Physics.Arcade.StaticGroup;
  public readonly furnitureGroup: Phaser.Physics.Arcade.StaticGroup;
  public readonly furnitureSprites: Phaser.GameObjects.Sprite[] = [];
  public readonly structuralBarriers: Phaser.GameObjects.Zone[] = [];
  public readonly resolvedEnvironmentObjects: ResolvedEnvironmentObject[] = [];
  private environmentComposer: EnvironmentComposer;
  public readonly lightFixtureSystem: LightFixtureSystem;
  public readonly windowSystem: WindowSystem;

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
    this.environmentComposer = new EnvironmentComposer(scene, this.wallsGroup);
    this.lightFixtureSystem = new LightFixtureSystem(scene, lightingSystem);
    this.windowSystem = new WindowSystem(scene, ambientFXSystem, lightingSystem);

    this.buildFloors();
    this.buildStaircase();
    this.buildWalls();
    this.buildEnvironment();
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
      }

      // 2. Center stair runner carpet
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

      // 4. Left stringer / side step structure
      if (this.scene.textures.exists('stair_stringer_step_left')) {
        const balL = this.scene.add.sprite(
          sc.x + 8,
          stepY + 16,
          'stair_stringer_step_left'
        );
        balL.setDepth(calculateDynamicDepth(stepY, 14));
      }

      // 5. Right stringer / side step structure
      if (this.scene.textures.exists('stair_stringer_step_right')) {
        const balR = this.scene.add.sprite(
          sc.x + sc.width - 8,
          stepY + 16,
          'stair_stringer_step_right'
        );
        balR.setDepth(calculateDynamicDepth(stepY, 14));
      }
    }
  }

  private buildEnvironment(): void {
    if (this.def.environmentPlacements) {
      const resolved = this.environmentComposer.composeAll(
        this.def.environmentPlacements
      );
      this.resolvedEnvironmentObjects.push(...resolved);

      // Register light fixtures (attaches flames and lights to actual wicks/candelabras)
      this.lightFixtureSystem.registerAllFixtures(resolved);

      // Register windows (rain masking and subtle moonlight)
      for (const obj of resolved) {
        if (obj.placement.role === 'window' || obj.asset?.category === 'windows') {
          this.windowSystem.registerWindow(obj, true);
        }
      }
    }
  }

  private buildWalls(): void {
    for (const wall of this.def.walls) {
      if (wall.visualMode !== 'collision-only') {
        const wallDepth =
          wall.visualMode === 'backplate'
            ? DEPTH_LAYERS.BACK_WALL
            : DEPTH_LAYERS.BACK_WALL;

        const tileSprite = this.scene.add.tileSprite(
          wall.x + wall.width / 2,
          wall.y + wall.height / 2,
          wall.width,
          wall.height,
          wall.textureKey
        );
        tileSprite.setDepth(wallDepth);
      }

      // Collision body
      if (wall.hasCollision !== false) {
        const colH = wall.collisionHeight ?? wall.height;
        const colY = wall.collisionOffsetY
          ? wall.y + wall.collisionOffsetY + colH / 2
          : wall.y + wall.height / 2;

        const colObj = this.scene.add.zone(
          wall.x + wall.width / 2,
          colY,
          wall.width,
          colH
        );
        this.scene.physics.add.existing(colObj, true);
        this.wallsGroup.add(colObj);
        this.structuralBarriers.push(colObj);
      }
    }
  }

  private buildAmbientZones(): void {
    // 1. Bedchamber Ambient Motes
    this.ambientFXSystem.addDustZone(240, 180, 120, 5);

    // 2. Upper Landing Ambient Motes
    this.ambientFXSystem.addDustZone(640, 180, 100, 4);

    // 3. Great Hall Central Gallery Motes (concentrated beneath chandelier)
    this.ambientFXSystem.addDustZone(640, 720, 150, 8);

    // 4. Dining Room Warm Candlelit Motes
    this.ambientFXSystem.addDustZone(240, 720, 120, 6);

    // 5. Lounge Fireside Cozy Floating Embers / Motes
    this.ambientFXSystem.addDustZone(1040, 720, 120, 6);
  }

  public getLightingSystem(): LightingSystem {
    return this.lightingSystem;
  }

  public getSpawnPoint(): { x: number; y: number; direction: Direction } {
    return this.def.spawnPoint;
  }

  public getSafeBounds(): SafeBounds {
    return this.def.safeBounds;
  }

  public getActiveFixtures(): ActiveLightFixture[] {
    return this.lightFixtureSystem.getFixtures();
  }
}
