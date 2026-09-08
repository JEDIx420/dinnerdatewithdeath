import { DepthClass } from '../systems/DepthSystem';
import { AnchorPreset } from './EnvironmentAsset';
import { CollisionProfileId, PhysicalFootprint } from './CollisionProfile';

export interface EnvironmentPlacement {
  id: string;
  assetId: string;
  textureKey?: string;
  frame?: string;

  // Spatial coordinates
  x: number;
  y: number;

  // Ground anchor override (if different from asset default)
  anchorPreset?: AnchorPreset;

  // Visual transforms
  originX?: number;
  originY?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  flipX?: boolean;
  flipY?: boolean;
  alpha?: number;

  // Depth control
  depthClass?: DepthClass;
  depthOffset?: number;
  explicitDepth?: number;

  // Physical collision override
  collisionProfile?: CollisionProfileId;
  collisionFootprint?: PhysicalFootprint;
  disableCollision?: boolean;

  // Surface attachment parent linkage
  parentPlacementId?: string;
  surfaceName?: string;
  inheritParentScale?: boolean;
  inheritParentFlip?: boolean;

  // Spatial grouping & narrative role
  zone?: string;
  role?: string;
  groupId?: string;
  symmetryGroup?: string;
}
