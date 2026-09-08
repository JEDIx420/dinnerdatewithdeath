import Phaser from 'phaser';
import { EnvironmentPlacement } from './EnvironmentPlacement';
import { EnvironmentAssetCatalog } from './EnvironmentAssetCatalog';
import { getAnchorOrigin } from './EnvironmentAsset';
import { getCollisionProfile, PhysicalFootprint } from './CollisionProfile';
import { resolveDepthForClass } from '../systems/DepthSystem';

export interface ResolvedEnvironmentObject {
  placement: EnvironmentPlacement;
  sprite: Phaser.GameObjects.Sprite;
  groundAnchorX: number;
  groundAnchorY: number;
  collisionZone?: Phaser.GameObjects.Zone;
  footprint?: PhysicalFootprint;
}

export class EnvironmentComposer {
  private scene: Phaser.Scene;
  private collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  private resolvedObjects: ResolvedEnvironmentObject[] = [];

  constructor(scene: Phaser.Scene, collisionGroup: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.collisionGroup = collisionGroup;
  }

  public composeAll(placements: EnvironmentPlacement[]): ResolvedEnvironmentObject[] {
    for (const placement of placements) {
      const resolved = this.compose(placement);
      if (resolved) {
        this.resolvedObjects.push(resolved);
      }
    }
    return this.resolvedObjects;
  }

  public compose(placement: EnvironmentPlacement): ResolvedEnvironmentObject | null {
    const asset = EnvironmentAssetCatalog.getAsset(placement.assetId);
    const textureKey = placement.textureKey ?? asset?.textureKey ?? placement.assetId;

    if (!this.scene.textures.exists(textureKey)) {
      return null;
    }

    const sprite = this.scene.add.sprite(placement.x, placement.y, textureKey);

    // 1. Resolve Anchor and Origins
    const anchorPreset = placement.anchorPreset ?? asset?.anchorPreset ?? 'center';
    const origins = getAnchorOrigin(anchorPreset);
    sprite.setOrigin(
      placement.originX ?? origins.originX,
      placement.originY ?? origins.originY
    );

    if (placement.flipX) sprite.setFlipX(true);
    if (placement.flipY) sprite.setFlipY(true);
    if (placement.scale) sprite.setScale(placement.scale);

    // 2. Resolve Ground Anchor Position
    // For bottom-center (originY = 1.0), ground anchor Y is exactly placement.y!
    const groundAnchorX = placement.x;
    const groundAnchorY =
      origins.originY === 1.0
        ? placement.y
        : placement.y + (1.0 - origins.originY) * (asset?.nativeHeight ?? sprite.height);

    // 3. Resolve Depth via Semantic Depth Layer System
    if (placement.explicitDepth !== undefined) {
      sprite.setDepth(placement.explicitDepth);
    } else {
      const depthClass = placement.depthClass ?? asset?.depthClass ?? 'dynamic-solid';
      const depthOffset = placement.depthOffset ?? 0;
      const depth = resolveDepthForClass(depthClass, groundAnchorY, depthOffset);
      sprite.setDepth(depth);
    }

    // 4. Resolve Physical Collision Footprint
    let collisionZone: Phaser.GameObjects.Zone | undefined;
    let activeFootprint: PhysicalFootprint | undefined;

    if (!placement.disableCollision) {
      const colProfileId =
        placement.collisionProfile ?? asset?.collisionProfile ?? 'none';
      const footprint =
        placement.collisionFootprint ??
        (colProfileId !== 'none'
          ? getCollisionProfile(colProfileId).footprint
          : undefined);

      if (footprint && footprint.width > 0 && footprint.height > 0) {
        activeFootprint = footprint;
        const colX = groundAnchorX + footprint.offsetX;
        const colY = groundAnchorY + footprint.offsetY;
        const zone = this.scene.add.zone(
          colX,
          colY,
          footprint.width,
          footprint.height
        );
        this.scene.physics.add.existing(zone, true);
        this.collisionGroup.add(zone);
        collisionZone = zone;
      }
    }

    return {
      placement,
      sprite,
      groundAnchorX,
      groundAnchorY,
      collisionZone,
      footprint: activeFootprint,
    };
  }

  public getResolvedObjects(): ResolvedEnvironmentObject[] {
    return this.resolvedObjects;
  }
}
