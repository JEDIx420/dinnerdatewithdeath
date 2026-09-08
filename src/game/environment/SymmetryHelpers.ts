import { EnvironmentPlacement } from './EnvironmentPlacement';

export interface MirroredPairOptions {
  groupId?: string;
  zone?: string;
  role?: string;
  depthOffset?: number;
  scale?: number;
  flipXRight?: boolean;
  collisionProfile?: EnvironmentPlacement['collisionProfile'];
}

export interface RepeatedSpanOptions {
  groupId?: string;
  zone?: string;
  role?: string;
  depthOffset?: number;
  scale?: number;
  collisionProfile?: EnvironmentPlacement['collisionProfile'];
  snapStep?: number;
}

export interface PortalFrameOptions {
  groupId?: string;
  zone?: string;
  pillarOffset?: number;
  headerYOffset?: number;
  scale?: number;
  leftPillarCollision?: EnvironmentPlacement['collisionProfile'];
  rightPillarCollision?: EnvironmentPlacement['collisionProfile'];
}

/**
 * Creates an exact mathematically mirrored pair around a central axis.
 * Guarantees: (left.x + right.x) / 2 === centerAxis
 */
export function placeMirroredPair(
  idPrefix: string,
  centerAxis: number,
  distanceFromAxis: number,
  groundY: number,
  leftAssetId: string,
  rightAssetId: string = leftAssetId,
  options: MirroredPairOptions = {}
): [EnvironmentPlacement, EnvironmentPlacement] {
  const leftX = Math.round(centerAxis - distanceFromAxis);
  const rightX = Math.round(centerAxis + distanceFromAxis);
  const symGroup = options.groupId ?? `${idPrefix}_pair`;

  const leftPlacement: EnvironmentPlacement = {
    id: `${idPrefix}_left`,
    assetId: leftAssetId,
    x: leftX,
    y: groundY,
    zone: options.zone,
    role: options.role,
    groupId: options.groupId,
    symmetryGroup: symGroup,
    depthOffset: options.depthOffset,
    scale: options.scale,
    collisionProfile: options.collisionProfile,
  };

  const rightPlacement: EnvironmentPlacement = {
    id: `${idPrefix}_right`,
    assetId: rightAssetId,
    x: rightX,
    y: groundY,
    zone: options.zone,
    role: options.role,
    groupId: options.groupId,
    symmetryGroup: symGroup,
    depthOffset: options.depthOffset,
    scale: options.scale,
    flipX: options.flipXRight,
    collisionProfile: options.collisionProfile,
  };

  return [leftPlacement, rightPlacement];
}

/**
 * Places items across a horizontal span with consistent integer spacing.
 */
export function placeRepeatedSpan(
  idPrefix: string,
  startX: number,
  endX: number,
  stepWidth: number,
  groundY: number,
  assetId: string,
  options: RepeatedSpanOptions = {}
): EnvironmentPlacement[] {
  const placements: EnvironmentPlacement[] = [];
  const span = endX - startX;
  if (span <= 0 || stepWidth <= 0) return placements;

  const count = Math.max(1, Math.round(span / stepWidth));
  const exactStep = span / count;

  for (let i = 0; i <= count; i++) {
    const x = Math.round(startX + i * exactStep);
    placements.push({
      id: `${idPrefix}_${i}`,
      assetId,
      x,
      y: groundY,
      zone: options.zone,
      role: options.role,
      groupId: options.groupId,
      depthOffset: options.depthOffset,
      scale: options.scale,
      collisionProfile: options.collisionProfile,
    });
  }

  return placements;
}

/**
 * Frames an opening or portal with symmetrical left/right supports and an overhead header.
 */
export function frameOpening(
  idPrefix: string,
  centerAxis: number,
  halfOpeningWidth: number,
  groundY: number,
  pillarAssetId: string,
  headerAssetId?: string,
  options: PortalFrameOptions = {}
): EnvironmentPlacement[] {
  const placements: EnvironmentPlacement[] = [];
  const offset = options.pillarOffset ?? halfOpeningWidth;

  const [leftPillar, rightPillar] = placeMirroredPair(
    `${idPrefix}_pillar`,
    centerAxis,
    offset,
    groundY,
    pillarAssetId,
    pillarAssetId,
    {
      zone: options.zone,
      role: 'opening_pillar',
      groupId: options.groupId ?? `${idPrefix}_frame`,
      scale: options.scale,
      flipXRight: true,
      collisionProfile: options.leftPillarCollision ?? 'half_column',
    }
  );

  placements.push(leftPillar, rightPillar);

  if (headerAssetId) {
    placements.push({
      id: `${idPrefix}_header`,
      assetId: headerAssetId,
      x: centerAxis,
      y: groundY + (options.headerYOffset ?? -140),
      zone: options.zone,
      role: 'opening_header',
      groupId: options.groupId ?? `${idPrefix}_frame`,
      scale: options.scale,
      depthClass: 'foreground-structure',
    });
  }

  return placements;
}
