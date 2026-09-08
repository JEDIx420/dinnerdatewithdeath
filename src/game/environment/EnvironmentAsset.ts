import { DepthClass } from '../systems/DepthSystem';
import { CollisionProfileId } from './CollisionProfile';

export type AnchorPreset =
  | 'center'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'ground-center';

export type PhysicalClass =
  | 'none'          // No collision (wallpapers, trims, mouldings, rugs, floor tiles)
  | 'floor-solid'   // Free-standing solid object on floor (columns, newels, statues, furniture)
  | 'barrier'       // Continuous safety barrier (balustrades, stair walls, room boundaries)
  | 'overhead';     // Passes over player (arch headers)

export interface EnvironmentAssetDef {
  id: string;
  category: string;
  textureKey: string;
  nativeWidth: number;
  nativeHeight: number;
  anchorPreset: AnchorPreset;
  depthClass: DepthClass;
  physicalClass: PhysicalClass;
  collisionProfile: CollisionProfileId;
  mirrorSafe?: boolean;
  repeatable?: boolean;
  tags?: string[];
  notes?: string;
}

/**
 * Returns origin numbers (0.0 to 1.0) corresponding to an AnchorPreset.
 */
export function getAnchorOrigin(preset: AnchorPreset): { originX: number; originY: number } {
  switch (preset) {
    case 'bottom-center':
    case 'ground-center':
      return { originX: 0.5, originY: 1.0 };
    case 'bottom-left':
      return { originX: 0.0, originY: 1.0 };
    case 'bottom-right':
      return { originX: 1.0, originY: 1.0 };
    case 'top-center':
      return { originX: 0.5, originY: 0.0 };
    case 'top-left':
      return { originX: 0.0, originY: 0.0 };
    case 'center':
    default:
      return { originX: 0.5, originY: 0.5 };
  }
}
