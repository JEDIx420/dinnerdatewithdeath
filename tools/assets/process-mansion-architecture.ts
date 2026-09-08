import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

interface ArchitectureAssetDef {
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

interface ArchitectureManifest {
  name: string;
  sourceImage: string;
  sourceDimensions: {
    width: number;
    height: number;
  };
  categories: string[];
  assets: ArchitectureAssetDef[];
}

export async function processMansionArchitecture(): Promise<void> {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'art/manifests/mansion-architecture.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const manifest: ArchitectureManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Resolve source file (support both without (1) and with (1))
  let sourcePath = path.join(rootDir, manifest.sourceImage);
  if (!fs.existsSync(sourcePath)) {
    const fallbackPath = path.join(rootDir, 'art/source/environment/mansion/DDWD_ENV_01 — Mansion Architecture(1).png');
    if (fs.existsSync(fallbackPath)) {
      sourcePath = fallbackPath;
    } else {
      const rootFallback = path.join(rootDir, 'DDWD_ENV_01 — Mansion Architecture.png');
      if (fs.existsSync(rootFallback)) {
        sourcePath = rootFallback;
      } else {
        throw new Error(`Source image not found: ${sourcePath}`);
      }
    }
  }

  console.log(`[Architecture Pipeline] Processing source: ${sourcePath}`);
  const baseOutDir = path.join(rootDir, 'public/game-assets/environment/mansion/architecture');
  const previewDir = path.join(rootDir, 'art/previews/environment/mansion/architecture');

  fs.mkdirSync(baseOutDir, { recursive: true });
  fs.mkdirSync(previewDir, { recursive: true });

  for (const cat of manifest.categories) {
    fs.mkdirSync(path.join(baseOutDir, cat), { recursive: true });
  }

  // Load source image into memory once
  const sourceImage = sharp(sourcePath);
  const metadata = await sourceImage.metadata();
  console.log(`[Architecture Pipeline] Source format: ${metadata.format} ${metadata.width}x${metadata.height}`);

  const extractedList: Array<{ id: string; category: string; width: number; height: number; path: string }> = [];

  for (const asset of manifest.assets) {
    const rect = asset.sourceRect;
    // Validate boundaries
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > (metadata.width ?? 1448) || rect.y + rect.height > (metadata.height ?? 1086)) {
      throw new Error(`Asset ${asset.id} bounds out of range: ${JSON.stringify(rect)}`);
    }

    const catPath = path.join(baseOutDir, asset.category, `${asset.id}.png`);
    const flatPath = path.join(baseOutDir, `${asset.id}.png`);

    // Extract exactly as authored with nearest pixel integrity
    const extracted = sharp(sourcePath).extract({
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
    }).png();

    await extracted.toFile(catPath);
    // Also copy to flat directory for easy key resolution
    fs.copyFileSync(catPath, flatPath);

    extractedList.push({
      id: asset.id,
      category: asset.category,
      width: rect.width,
      height: rect.height,
      path: catPath,
    });
  }

  console.log(`[Architecture Pipeline] Successfully extracted ${extractedList.length} architectural sprites.`);

  // Build a labeled visual QA contact sheet
  // Canvas width: 1500, dynamic height based on categories
  const contactW = 1500;
  const margin = 20;
  const catSpacing = 40;
  let currentY = margin;

  const composites: sharp.OverlayOptions[] = [];

  // Group by category
  for (const cat of manifest.categories) {
    const catAssets = extractedList.filter((a) => a.category === cat);
    if (catAssets.length === 0) continue;

    // Header label for category
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

      // Checkered background under item to display alpha
      const itemBuffer = await sharp(item.path).toBuffer();
      composites.push({
        input: itemBuffer,
        top: currentY,
        left: rowX,
      });

      // Label below item
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
  console.log(`[Architecture Pipeline] Generating Contact Sheet (${contactW}x${contactH})...`);

  // Background dark field
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

  console.log(`[Architecture Pipeline] Contact sheet saved at: art/previews/environment/mansion/architecture/contact-sheet.png`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  processMansionArchitecture().catch((err) => {
    console.error('[Architecture Pipeline] Error:', err);
    process.exit(1);
  });
}
