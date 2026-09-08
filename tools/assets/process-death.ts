import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

interface ExtractionManifest {
  id: string;
  displayName: string;
  sourceFile: string;
  targetSheet: {
    width: number;
    height: number;
    cellWidth: number;
    cellHeight: number;
    cols: number;
    rows: number;
  };
  characterScaleHeight: number;
  footBaseline: number;
  backgroundRemoval: {
    method: string;
    threshold: number;
    cleanStrayArtifacts: boolean;
  };
  directions: Record<string, { row: number; frames: number[]; idleFrame: number }>;
}

async function processDeath(): Promise<void> {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'art/manifests/death.json');
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest: ExtractionManifest = JSON.parse(manifestRaw);

  const sourcePath = path.join(rootDir, manifest.sourceFile);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at: ${sourcePath}`);
  }

  console.log(`[Asset Pipeline] Loading source: ${manifest.sourceFile}`);
  const sourceImage = sharp(sourcePath);
  const metadata = await sourceImage.metadata();
  const srcW = metadata.width!;
  const srcH = metadata.height!;

  // Convert to RGBA raw buffer
  const rawRgba = await sourceImage.ensureAlpha().raw().toBuffer();
  const channels = 4;

  console.log(`[Asset Pipeline] Source dimensions: ${srcW}x${srcH}`);

  // 1. Exterior 8-connected flood fill background removal
  const threshold = manifest.backgroundRemoval.threshold;
  const isBgCandidate = (x: number, y: number): boolean => {
    const idx = (y * srcW + x) * channels;
    const r = rawRgba[idx]!;
    const g = rawRgba[idx + 1]!;
    const b = rawRgba[idx + 2]!;
    return r > threshold && g > threshold && b > threshold;
  };

  const bgMask = new Uint8Array(srcW * srcH); // 1 = background, 0 = foreground
  const queue: [number, number][] = [];

  // Seed boundary pixels
  for (let x = 0; x < srcW; x++) {
    for (const y of [0, srcH - 1]) {
      if (isBgCandidate(x, y) && bgMask[y * srcW + x] === 0) {
        bgMask[y * srcW + x] = 1;
        queue.push([x, y]);
      }
    }
  }
  for (let y = 0; y < srcH; y++) {
    for (const x of [0, srcW - 1]) {
      if (isBgCandidate(x, y) && bgMask[y * srcW + x] === 0) {
        bgMask[y * srcW + x] = 1;
        queue.push([x, y]);
      }
    }
  }

  // 8-way flood fill
  const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1],
  ];

  let head = 0;
  while (head < queue.length) {
    const [cx, cy] = queue[head++]!;
    for (const [dx, dy] of neighbors) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < srcW && ny >= 0 && ny < srcH) {
        const nIdx = ny * srcW + nx;
        if (bgMask[nIdx] === 0 && isBgCandidate(nx, ny)) {
          bgMask[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Set alpha = 0 for background pixels
  for (let y = 0; y < srcH; y++) {
    for (let x = 0; x < srcW; x++) {
      const idx = (y * srcW + x) * channels;
      if (bgMask[y * srcW + x] === 1) {
        rawRgba[idx + 3] = 0;
      }
    }
  }

  // 2. Clean stray AI marks in row 2 (near bottom of Row 2 / y ~ 920-940)
  if (manifest.backgroundRemoval.cleanStrayArtifacts) {
    const r2Start = Math.floor(2 * (srcH / 4) + 280);
    const r2End = Math.floor(3 * (srcH / 4));
    for (let y = r2Start; y < r2End; y++) {
      for (let x = 0; x < srcW; x++) {
        const idx = (y * srcW + x) * channels;
        rawRgba[idx + 3] = 0;
      }
    }
  }

  // 3. Process 4x4 cells into target sheet
  const targetCols = manifest.targetSheet.cols;
  const targetRows = manifest.targetSheet.rows;
  const targetCellW = manifest.targetSheet.cellWidth;
  const targetCellH = manifest.targetSheet.cellHeight;
  const targetSheetW = manifest.targetSheet.width;
  const targetSheetH = manifest.targetSheet.height;

  // Single uniform character scale across all 16 frames
  const nominalMaxHeight = 280.0;
  const scale = manifest.characterScaleHeight / nominalMaxHeight;
  const footBaseline = manifest.footBaseline;

  console.log(
    `[Asset Pipeline] Target sheet: ${targetSheetW}x${targetSheetH} (${targetCellW}x${targetCellH} cells), Scale: ${scale.toFixed(4)}, Baseline: Y=${footBaseline}`
  );

  // Target sheet buffer (RGBA, transparent)
  const targetBuffer = new Uint8Array(targetSheetW * targetSheetH * 4);

  // Cell width and height in source
  const srcCellW = srcW / targetCols;
  const srcCellH = srcH / targetRows;

  for (let r = 0; r < targetRows; r++) {
    for (let c = 0; c < targetCols; c++) {
      const cellX0 = Math.floor(c * srcCellW);
      const cellY0 = Math.floor(r * srcCellH);
      const cellX1 = Math.floor((c + 1) * srcCellW);
      const cellY1 = Math.floor((r + 1) * srcCellH);

      // Find foreground bounding box in this cell
      let minX = cellX1;
      let maxX = cellX0;
      let minY = cellY1;
      let maxY = cellY0;
      let hasFg = false;

      for (let y = cellY0; y < cellY1; y++) {
        for (let x = cellX0; x < cellX1; x++) {
          const idx = (y * srcW + x) * channels;
          if (rawRgba[idx + 3]! > 0) {
            hasFg = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (!hasFg) continue;

      const fgW = maxX - minX + 1;
      const fgH = maxY - minY + 1;

      // Extract foreground crop into separate buffer
      const fgBuffer = Buffer.alloc(fgW * fgH * 4);
      for (let y = 0; y < fgH; y++) {
        for (let x = 0; x < fgW; x++) {
          const srcIdx = ((minY + y) * srcW + (minX + x)) * channels;
          const dstIdx = (y * fgW + x) * 4;
          fgBuffer[dstIdx] = rawRgba[srcIdx]!;
          fgBuffer[dstIdx + 1] = rawRgba[srcIdx + 1]!;
          fgBuffer[dstIdx + 2] = rawRgba[srcIdx + 2]!;
          fgBuffer[dstIdx + 3] = rawRgba[srcIdx + 3]!;
        }
      }

      // Rescale with high-fidelity lanczos3 kernel
      const scaledW = Math.max(1, Math.round(fgW * scale));
      const scaledH = Math.max(1, Math.round(fgH * scale));

      const scaledBuffer = await sharp(fgBuffer, {
        raw: { width: fgW, height: fgH, channels: 4 },
      })
        .resize(scaledW, scaledH, { kernel: 'lanczos3' })
        .raw()
        .toBuffer();

      // Place in target cell:
      // Horizontally centered: c * targetCellW + (targetCellW / 2 - scaledW / 2)
      // Foot baseline aligned: r * targetCellH + (footBaseline - scaledH)
      const destX = c * targetCellW + Math.round(targetCellW / 2 - scaledW / 2);
      const destY = r * targetCellH + (footBaseline - scaledH);

      for (let y = 0; y < scaledH; y++) {
        for (let x = 0; x < scaledW; x++) {
          const targetX = destX + x;
          const targetY = destY + y;
          if (targetX >= 0 && targetX < targetSheetW && targetY >= 0 && targetY < targetSheetH) {
            const sIdx = (y * scaledW + x) * 4;
            const tIdx = (targetY * targetSheetW + targetX) * 4;
            const sa = scaledBuffer[sIdx + 3]! / 255.0;
            if (sa > 0.05) {
              targetBuffer[tIdx] = scaledBuffer[sIdx]!;
              targetBuffer[tIdx + 1] = scaledBuffer[sIdx + 1]!;
              targetBuffer[tIdx + 2] = scaledBuffer[sIdx + 2]!;
              targetBuffer[tIdx + 3] = Math.round(scaledBuffer[sIdx + 3]!);
            }
          }
        }
      }
    }
  }

  // 4. Save production runtime sprite sheet (512x512 PNG)
  const runtimeDir = path.join(rootDir, 'public/game-assets/characters/death');
  fs.mkdirSync(path.join(runtimeDir, 'overworld'), { recursive: true });
  const runtimeSheetPath = path.join(runtimeDir, 'overworld/walk.png');

  await sharp(targetBuffer, {
    raw: { width: targetSheetW, height: targetSheetH, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(runtimeSheetPath);

  console.log(`[Asset Pipeline] Written runtime sheet: ${runtimeSheetPath}`);

  // 5. Save runtime manifest
  const runtimeManifest = {
    id: manifest.id,
    displayName: manifest.displayName,
    textureKey: 'death_walk',
    texturePath: 'game-assets/characters/death/overworld/walk.png',
    frameWidth: targetCellW,
    frameHeight: targetCellH,
    frameRate: 6,
    footBaseline: manifest.footBaseline,
    animations: {
      walk_down: {
        frames: [0, 1, 2, 3],
        idleFrame: 3,
      },
      walk_left: {
        frames: [4, 5, 6, 7],
        idleFrame: 7,
      },
      walk_right: {
        frames: [8, 9, 10, 11],
        idleFrame: 11,
      },
      walk_up: {
        frames: [12, 13, 14, 15],
        idleFrame: 15,
      },
    },
  };

  const runtimeManifestPath = path.join(runtimeDir, 'manifest.json');
  fs.writeFileSync(runtimeManifestPath, JSON.stringify(runtimeManifest, null, 2), 'utf-8');
  console.log(`[Asset Pipeline] Written runtime manifest: ${runtimeManifestPath}`);

  // 6. Generate QA Preview Sheet with grid boundaries and ground baseline
  const previewDir = path.join(rootDir, 'art/previews/death');
  fs.mkdirSync(previewDir, { recursive: true });

  const previewBuffer = new Uint8Array(targetBuffer);
  // Overlay cell boundaries (semi-transparent cyan) and foot baseline (semi-transparent red)
  for (let y = 0; y < targetSheetH; y++) {
    for (let x = 0; x < targetSheetW; x++) {
      const isColBoundary = x % targetCellW === 0 || x === targetSheetW - 1;
      const isRowBoundary = y % targetCellH === 0 || y === targetSheetH - 1;
      const isBaseline = y % targetCellH === footBaseline;

      const idx = (y * targetSheetW + x) * 4;

      if (isBaseline) {
        // Red baseline guide
        previewBuffer[idx] = 230;
        previewBuffer[idx + 1] = 40;
        previewBuffer[idx + 2] = 50;
        previewBuffer[idx + 3] = 220;
      } else if (isColBoundary || isRowBoundary) {
        // Subtle cyan cell grid
        previewBuffer[idx] = 60;
        previewBuffer[idx + 1] = 160;
        previewBuffer[idx + 2] = 220;
        previewBuffer[idx + 3] = 180;
      }
    }
  }

  const previewSheetPath = path.join(previewDir, 'death-walk-sheet-preview.png');
  await sharp(previewBuffer, {
    raw: { width: targetSheetW, height: targetSheetH, channels: 4 },
  })
    .png()
    .toFile(previewSheetPath);
  console.log(`[Asset Pipeline] Written QA preview sheet: ${previewSheetPath}`);

  // 7. Generate directional strips
  const directions = ['down', 'left', 'right', 'up'];
  for (let r = 0; r < targetRows; r++) {
    const dirName = directions[r]!;
    const stripBuffer = Buffer.alloc(targetCellW * 4 * targetCellH * 4);

    for (let c = 0; c < targetCols; c++) {
      for (let y = 0; y < targetCellH; y++) {
        for (let x = 0; x < targetCellW; x++) {
          const srcIdx = ((r * targetCellH + y) * targetSheetW + (c * targetCellW + x)) * 4;
          const dstIdx = (y * (targetCellW * 4) + (c * targetCellW + x)) * 4;
          stripBuffer[dstIdx] = targetBuffer[srcIdx]!;
          stripBuffer[dstIdx + 1] = targetBuffer[srcIdx + 1]!;
          stripBuffer[dstIdx + 2] = targetBuffer[srcIdx + 2]!;
          stripBuffer[dstIdx + 3] = targetBuffer[srcIdx + 3]!;
        }
      }
    }

    const stripPath = path.join(previewDir, `strip_${dirName}.png`);
    await sharp(stripBuffer, {
      raw: { width: targetCellW * 4, height: targetCellH, channels: 4 },
    })
      .png()
      .toFile(stripPath);
  }

  console.log('[Asset Pipeline] Extraction completed successfully!');
}

processDeath().catch((err) => {
  console.error('[Asset Pipeline] Fatal error:', err);
  process.exit(1);
});
