export interface Point2D {
  x: number;
  y: number;
}

export interface LightningBranch {
  points: Point2D[];
  parentIndex: number;
  thicknessRatio: number;
}

export interface LightningBoltData {
  mainPoints: Point2D[];
  branches: LightningBranch[];
  intensity: 'distant' | 'medium' | 'hero';
}

export interface LightningPathConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  minSegments?: number;
  maxSegments?: number;
  roughness?: number;
  branchCount?: number;
  intensity?: 'distant' | 'medium' | 'hero';
  bounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export type RngFn = () => number;

/**
 * Pure function to generate jagged, branching lightning polyline data.
 * Fully deterministic when given a seeded pseudo-random number generator.
 */
export function generateLightningBolt(
  config: LightningPathConfig,
  rng: RngFn = Math.random
): LightningBoltData {
  const minSegments = config.minSegments ?? 8;
  const maxSegments = config.maxSegments ?? 14;
  const segmentCount = Math.floor(minSegments + rng() * (maxSegments - minSegments + 1));
  const roughness = config.roughness ?? 28;
  const intensity = config.intensity ?? 'medium';

  const dx = config.endX - config.startX;
  const dy = config.endY - config.startY;
  const totalDist = Math.sqrt(dx * dx + dy * dy) || 1;

  // Normal vector perpendicular to main progression
  const nx = -dy / totalDist;
  const ny = dx / totalDist;

  const mainPoints: Point2D[] = [];
  mainPoints.push({ x: config.startX, y: config.startY });

  for (let i = 1; i < segmentCount; i++) {
    const progress = i / segmentCount;
    // Base position along direct line
    const baseX = config.startX + dx * progress;
    const baseY = config.startY + dy * progress;

    // Bell envelope: max displacement in middle, tapering at ends
    const envelope = Math.sin(progress * Math.PI);
    const lateralDisp = (rng() * 2 - 1) * roughness * envelope;

    // Slight forward/backward longitudinal jitter
    const longJitter = (rng() * 2 - 1) * (totalDist / segmentCount) * 0.25;

    let px = baseX + nx * lateralDisp + (dx / totalDist) * longJitter;
    let py = baseY + ny * lateralDisp + (dy / totalDist) * longJitter;

    if (config.bounds) {
      px = Math.max(config.bounds.minX, Math.min(config.bounds.maxX, px));
      py = Math.max(config.bounds.minY, Math.min(config.bounds.maxY, py));
    }

    mainPoints.push({ x: px, y: py });
  }

  mainPoints.push({ x: config.endX, y: config.endY });

  // Generate forking branches
  const maxBranches = config.branchCount ?? (intensity === 'hero' ? 3 : intensity === 'medium' ? 2 : 1);
  const branches: LightningBranch[] = [];

  if (segmentCount >= 4 && maxBranches > 0) {
    const candidateIndices: number[] = [];
    for (let i = 2; i < segmentCount - 1; i++) {
      candidateIndices.push(i);
    }

    // Shuffle candidate indices using rng
    for (let i = candidateIndices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = candidateIndices[i]!;
      candidateIndices[i] = candidateIndices[j]!;
      candidateIndices[j] = temp;
    }

    const actualBranchCount = Math.min(maxBranches, candidateIndices.length);

    for (let b = 0; b < actualBranchCount; b++) {
      const pIdx = candidateIndices[b]!;
      const parentPt = mainPoints[pIdx]!;

      // Branch forks at an angle (~25-50 degrees off main segment direction)
      const prevPt = mainPoints[pIdx - 1]!;
      const segDx = parentPt.x - prevPt.x;
      const segDy = parentPt.y - prevPt.y;
      const segLen = Math.sqrt(segDx * segDx + segDy * segDy) || 1;

      // Choose fork direction (left or right)
      const forkSign = rng() > 0.5 ? 1 : -1;
      const forkAngle = (Math.PI / 6 + rng() * (Math.PI / 6)) * forkSign;
      const cosA = Math.cos(forkAngle);
      const sinA = Math.sin(forkAngle);

      const forkDirX = (segDx * cosA - segDy * sinA) / segLen;
      const forkDirY = (segDx * sinA + segDy * cosA) / segLen;

      const branchLength = totalDist * (0.15 + rng() * 0.25);
      const branchSegs = Math.floor(3 + rng() * 3);

      const branchPoints: Point2D[] = [{ x: parentPt.x, y: parentPt.y }];

      for (let s = 1; s <= branchSegs; s++) {
        const bProgress = s / branchSegs;
        const bBaseX = parentPt.x + forkDirX * branchLength * bProgress;
        const bBaseY = parentPt.y + forkDirY * branchLength * bProgress;

        const bDisp = (rng() * 2 - 1) * (roughness * 0.45) * Math.sin(bProgress * Math.PI);
        let bpx = bBaseX - forkDirY * bDisp;
        let bpy = bBaseY + forkDirX * bDisp;

        if (config.bounds) {
          bpx = Math.max(config.bounds.minX, Math.min(config.bounds.maxX, bpx));
          bpy = Math.max(config.bounds.minY, Math.min(config.bounds.maxY, bpy));
        }

        branchPoints.push({ x: bpx, y: bpy });
      }

      branches.push({
        points: branchPoints,
        parentIndex: pIdx,
        thicknessRatio: 0.55 + rng() * 0.25,
      });
    }
  }

  return {
    mainPoints,
    branches,
    intensity,
  };
}

/**
 * Returns preset start/end configs for authored or procedural strikes.
 */
export function getAuthoringStrikeConfig(
  type: 'intro_hero' | 'screen_diagonal_left' | 'screen_diagonal_right' | 'window_top_left' | 'window_top_right',
  screenW: number = 768,
  _screenH: number = 432
): LightningPathConfig {
  switch (type) {
    case 'intro_hero':
      // Sweeping dramatic stroke across upper widescreen
      return {
        startX: -10,
        startY: 50,
        endX: screenW * 0.76,
        endY: 155,
        minSegments: 10,
        maxSegments: 14,
        roughness: 34,
        branchCount: 3,
        intensity: 'hero',
      };
    case 'screen_diagonal_left':
      return {
        startX: 40,
        startY: -15,
        endX: screenW * 0.65,
        endY: 180,
        minSegments: 9,
        maxSegments: 13,
        roughness: 30,
        branchCount: 2,
        intensity: 'medium',
      };
    case 'screen_diagonal_right':
      return {
        startX: screenW + 15,
        startY: 40,
        endX: screenW * 0.32,
        endY: 170,
        minSegments: 9,
        maxSegments: 13,
        roughness: 30,
        branchCount: 2,
        intensity: 'medium',
      };
    case 'window_top_left':
      return {
        startX: screenW * 0.15,
        startY: -20,
        endX: screenW * 0.28,
        endY: 130,
        minSegments: 6,
        maxSegments: 9,
        roughness: 20,
        branchCount: 1,
        intensity: 'distant',
      };
    case 'window_top_right':
      return {
        startX: screenW * 0.85,
        startY: -20,
        endX: screenW * 0.72,
        endY: 130,
        minSegments: 6,
        maxSegments: 9,
        roughness: 20,
        branchCount: 1,
        intensity: 'distant',
      };
  }
}
