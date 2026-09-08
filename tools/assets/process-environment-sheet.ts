import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

interface EnvironmentAssetDef {
  id: string;
  category: string;
  sourceRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  repeatable?: boolean;
  notes?: string;
}

interface EnvironmentManifest {
  name: string;
  sourceImage: string;
  sourceDimensions: {
    width: number;
    height: number;
  };
  categories: string[];
  assets: EnvironmentAssetDef[];
}

/**
 * Generic environment sheet processor.
 * Reads a JSON manifest and slices irregular sprite assets from any source sheet,
 * saving them to public/game-assets/... and generating a preview contact sheet.
 */
export async function processEnvironmentSheet(manifestRelativePath?: string): Promise<void> {
  const rootDir = process.cwd();
  const manifestRel = manifestRelativePath || process.argv[2] || 'art/manifests/mansion-architecture.json';
  const manifestPath = path.isAbsolute(manifestRel) ? manifestRel : path.join(rootDir, manifestRel);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const manifest: EnvironmentManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`[Environment Pipeline] Processing manifest: ${manifest.name} (${manifestRel})`);

  // Resolve source image path
  let sourcePath = path.join(rootDir, manifest.sourceImage);
  if (!fs.existsSync(sourcePath)) {
    // Check common fallbacks
    const basename = path.basename(manifest.sourceImage);
    const candidate1 = path.join(rootDir, 'art/source/environment/mansion', basename);
    const candidate2 = path.join(rootDir, basename);
    if (fs.existsSync(candidate1)) {
      sourcePath = candidate1;
    } else if (fs.existsSync(candidate2)) {
      sourcePath = candidate2;
    } else {
      throw new Error(`Source image not found: ${sourcePath}`);
    }
  }

  console.log(`[Environment Pipeline] Source image resolved: ${sourcePath}`);

  // Determine output directory based on manifest relative path or name
  const manifestDirName = path.basename(manifestRel, path.extname(manifestRel));
  const baseOutDir = path.join(rootDir, 'public/game-assets/environment/mansion', manifestDirName);
  const previewDir = path.join(rootDir, 'art/previews/environment/mansion', manifestDirName);

  fs.mkdirSync(baseOutDir, { recursive: true });
  fs.mkdirSync(previewDir, { recursive: true });

  const metadata = await sharp(sourcePath).metadata();
  console.log(`[Environment Pipeline] Source metadata: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Category subdirectories
  for (const cat of manifest.categories) {
    fs.mkdirSync(path.join(baseOutDir, cat), { recursive: true });
  }

  const processedAssets: Array<{
    id: string;
    category: string;
    width: number;
    height: number;
    path: string;
  }> = [];

  for (const asset of manifest.assets) {
    const { x, y, width, height } = asset.sourceRect;
    if (width <= 0 || height <= 0) {
      console.warn(`[Environment Pipeline] Skipping invalid crop for ${asset.id}: ${width}x${height}`);
      continue;
    }

    const outFileName = `${asset.id}.png`;
    const outFilePath = path.join(baseOutDir, asset.category, outFileName);

    await sharp(sourcePath)
      .extract({ left: x, top: y, width, height })
      .png()
      .toFile(outFilePath);

    processedAssets.push({
      id: asset.id,
      category: asset.category,
      width,
      height,
      path: outFilePath,
    });
  }

  console.log(`[Environment Pipeline] Extracted ${processedAssets.length} assets to ${baseOutDir}`);

  // Generate visual contact sheet preview
  const contactW = 1200;
  let currentY = 40;
  const margin = 30;
  const catSpacing = 40;
  const composites: sharp.OverlayOptions[] = [];

  // Title header
  const titleSvg = `<svg width="${contactW}" height="40">
    <text x="${margin}" y="28" font-family="monospace" font-size="20" font-weight="bold" fill="#ffffff">${manifest.name.toUpperCase()} - CONTACT SHEET</text>
  </svg>`;
  composites.push({
    input: Buffer.from(titleSvg),
    top: 10,
    left: 0,
  });

  for (const cat of manifest.categories) {
    const catAssets = processedAssets.filter((a) => a.category === cat);
    if (catAssets.length === 0) continue;

    const catHeaderSvg = `<svg width="400" height="24">
      <text x="0" y="18" font-family="monospace" font-size="16" font-weight="bold" fill="#ffd700">${cat.toUpperCase()} (${catAssets.length})</text>
    </svg>`;
    composites.push({
      input: Buffer.from(catHeaderSvg),
      top: currentY,
      left: margin,
    });
    currentY += 30;

    let rowX = margin;
    let maxRowH = 0;

    for (const item of catAssets) {
      if (rowX + item.width + 16 > contactW - margin) {
        rowX = margin;
        currentY += maxRowH + 20;
        maxRowH = 0;
      }

      const itemBuffer = await sharp(item.path).toBuffer();
      composites.push({
        input: itemBuffer,
        top: currentY,
        left: rowX,
      });

      const labelSvg = `<svg width="${Math.max(item.width + 10, 80)}" height="14">
        <text x="0" y="11" font-family="monospace" font-size="9" fill="#a0a0b8">${item.width}x${item.height}</text>
      </svg>`;
      composites.push({
        input: Buffer.from(labelSvg),
        top: currentY + item.height + 2,
        left: rowX,
      });

      maxRowH = Math.max(maxRowH, item.height + 16);
      rowX += item.width + 16;
    }

    currentY += maxRowH + catSpacing;
  }

  const contactH = currentY + margin;
  await sharp({
    create: {
      width: contactW,
      height: contactH,
      channels: 4,
      background: { r: 18, g: 16, b: 24, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(previewDir, 'contact-sheet.png'));

  console.log(`[Environment Pipeline] Contact sheet saved at: ${path.join(previewDir, 'contact-sheet.png')}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processEnvironmentSheet().catch((err) => {
    console.error('[Environment Pipeline] Error:', err);
    process.exit(1);
  });
}
