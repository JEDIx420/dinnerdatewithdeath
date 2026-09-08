import Phaser from 'phaser';
import { EnvironmentPlacement } from './EnvironmentPlacement';
import { EnvironmentAssetCatalog } from './EnvironmentAssetCatalog';
import { getAnchorOrigin, EnvironmentAssetDef } from './EnvironmentAsset';
import { getCollisionProfile, PhysicalFootprint } from './CollisionProfile';
import { resolveDepthForClass } from '../systems/DepthSystem';

export interface ResolvedEnvironmentObject {
  placement: EnvironmentPlacement;
  asset?: EnvironmentAssetDef;
  sprite: Phaser.GameObjects.Sprite;
  groundAnchorX: number;
  groundAnchorY: number;
  collisionZone?: Phaser.GameObjects.Zone;
  footprint?: PhysicalFootprint;
}

export class EnvironmentComposer {
  private scene: Phaser.Scene;
  private collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  private resolvedObjects: Map<string, ResolvedEnvironmentObject> = new Map();

  constructor(scene: Phaser.Scene, collisionGroup: Phaser.Physics.Arcade.StaticGroup) {
    this.scene = scene;
    this.collisionGroup = collisionGroup;
  }

  public composeAll(placements: EnvironmentPlacement[]): ResolvedEnvironmentObject[] {
    // 1. Separate roots from children
    const roots: EnvironmentPlacement[] = [];
    const children: EnvironmentPlacement[] = [];

    for (const p of placements) {
      if (p.parentPlacementId) {
        children.push(p);
      } else {
        roots.push(p);
      }
    }

    // Compose roots first so children can attach
    for (const root of roots) {
      this.compose(root);
    }

    // Compose children relative to resolved roots
    for (const child of children) {
      this.compose(child);
    }

    return Array.from(this.resolvedObjects.values());
  }

  public compose(placement: EnvironmentPlacement): ResolvedEnvironmentObject | null {
    const asset = EnvironmentAssetCatalog.getAsset(placement.assetId);

    // Resolve textureKey and frame (handles atlas and standalone textures)
    const textureKey = placement.textureKey ?? asset?.textureKey ?? placement.assetId;
    const frame = placement.frame ?? asset?.frame;

    if (!this.scene.textures.exists(textureKey)) {
      return null;
    }

    // Check parent attachment linkage
    let worldX = placement.x;
    let worldY = placement.y;
    let parentResolved: ResolvedEnvironmentObject | undefined;

    if (placement.parentPlacementId) {
      parentResolved = this.resolvedObjects.get(placement.parentPlacementId);
      if (parentResolved) {
        worldX = parentResolved.sprite.x + placement.x;
        worldY = parentResolved.sprite.y + placement.y;
      }
    }

    // Instantiate sprite (with frame if atlas)
    let sprite: Phaser.GameObjects.Sprite;
    if (frame && this.scene.textures.get(textureKey).has(frame)) {
      sprite = this.scene.add.sprite(worldX, worldY, textureKey, frame);
    } else {
      sprite = this.scene.add.sprite(worldX, worldY, textureKey);
    }

    // 1. Resolve Anchor and Origins
    const anchorPreset = placement.anchorPreset ?? asset?.anchorPreset ?? 'center';
    const origins = getAnchorOrigin(anchorPreset);
    sprite.setOrigin(
      placement.originX ?? origins.originX,
      placement.originY ?? origins.originY
    );

    // Scale & Flip
    let flipX = placement.flipX ?? false;
    let flipY = placement.flipY ?? false;
    if (parentResolved && placement.inheritParentFlip) {
      if (parentResolved.sprite.flipX) flipX = !flipX;
      if (parentResolved.sprite.flipY) flipY = !flipY;
    }
    sprite.setFlip(flipX, flipY);

    let scaleX = placement.scaleX ?? placement.scale ?? 1;
    let scaleY = placement.scaleY ?? placement.scale ?? 1;
    if (parentResolved && placement.inheritParentScale) {
      scaleX *= parentResolved.sprite.scaleX;
      scaleY *= parentResolved.sprite.scaleY;
    }
    sprite.setScale(scaleX, scaleY);

    if (placement.alpha !== undefined) {
      sprite.setAlpha(placement.alpha);
    }

    // 2. Resolve Ground Anchor Position
    const groundAnchorX = worldX;
    const groundAnchorY =
      origins.originY === 1.0
        ? worldY
        : worldY + (1.0 - origins.originY) * (sprite.height * scaleY);

    // 3. Resolve Depth
    if (placement.explicitDepth !== undefined) {
      sprite.setDepth(placement.explicitDepth);
    } else if (parentResolved) {
      // Child surface attachment: render relative to parent depth
      const surfaceOffset = placement.depthOffset ?? 2;
      sprite.setDepth(parentResolved.sprite.depth + surfaceOffset);
    } else {
      const depthClass = placement.depthClass ?? asset?.depthClass ?? 'dynamic-solid';
      const depthOffset = placement.depthOffset ?? 0;
      const depth = resolveDepthForClass(depthClass, groundAnchorY, depthOffset);
      sprite.setDepth(depth);
    }

    // 4. Resolve Physical Collision Footprint
    let collisionZone: Phaser.GameObjects.Zone | undefined;
    let activeFootprint: PhysicalFootprint | undefined;

    // By default, children attached to parent surfaces do NOT create independent collision
    if (!placement.disableCollision && !placement.parentPlacementId) {
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

    const resolved: ResolvedEnvironmentObject = {
      placement,
      asset,
      sprite,
      groundAnchorX,
      groundAnchorY,
      collisionZone,
      footprint: activeFootprint,
    };

    this.resolvedObjects.set(placement.id, resolved);
    return resolved;
  }

  public getResolvedObjects(): ResolvedEnvironmentObject[] {
    return Array.from(this.resolvedObjects.values());
  }

  public getResolvedObject(id: string): ResolvedEnvironmentObject | undefined {
    return this.resolvedObjects.get(id);
  }
}
