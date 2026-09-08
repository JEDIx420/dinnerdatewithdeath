import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();

export interface ManifestAsset {
  id: string;
  category: string;
  sourceRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PackManifest {
  packId: string;
  environmentId?: string;
  name: string;
  sourceImage: string;
  sourceDimensions: { width: number; height: number };
  categories: string[];
  assets: ManifestAsset[];
}

export async function packManifestToAtlas(manifestPath: string): Promise<void> {
  const manifest: PackManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const packId = manifest.packId || path.basename(manifestPath, '.json');
  const envId = manifest.environmentId || 'mansion';
  console.log(`[Atlas Builder] Packing ${packId} (${envId})...`);

  const sourcePath = path.isAbsolute(manifest.sourceImage)
    ? manifest.sourceImage
    : path.join(ROOT_DIR, manifest.sourceImage);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  // Determine output paths
  const outAtlasDir = path.join(ROOT_DIR, 'public/game-assets/environment', envId, 'packs');
  const outPreviewDir = path.join(ROOT_DIR, 'art/previews/environment', envId, packId);
  fs.mkdirSync(outAtlasDir, { recursive: true });
  fs.mkdirSync(outPreviewDir, { recursive: true });

  const atlasPngPath = path.join(outAtlasDir, `${packId}.png`);
  const atlasJsonPath = path.join(outAtlasDir, `${packId}.json`);
  const contactSheetPath = path.join(outPreviewDir, 'contact-sheet.png');

  const items: {
    id: string;
    category: string;
    width: number;
    height: number;
    buffer: Buffer;
    asset: ManifestAsset;
  }[] = [];

  for (const asset of manifest.assets) {
    const { x, y, width, height } = asset.sourceRect;
    if (width <= 0 || height <= 0) continue;

    const buffer = await sharp(sourcePath)
      .extract({ left: x, top: y, width, height })
      .png()
      .toBuffer();

    items.push({
      id: asset.id,
      category: asset.category,
      width,
      height,
      buffer,
      asset,
    });
  }

  // Deterministic Shelf Packing (Max Width 2048)
  const ATLAS_MAX_WIDTH = 2048;
  const PADDING = 4;

  const sorted = [...items].sort((a, b) => b.height - a.height);

  let currentX = PADDING;
  let currentY = PADDING;
  let rowHeight = 0;
  let maxW = 0;

  const frames: Record<string, unknown> = {};
  const composites: sharp.OverlayOptions[] = [];

  for (const item of sorted) {
    if (currentX + item.width + PADDING > ATLAS_MAX_WIDTH) {
      currentX = PADDING;
      currentY += rowHeight + PADDING;
      rowHeight = 0;
    }

    const frameX = currentX;
    const frameY = currentY;

    composites.push({
      input: item.buffer,
      left: frameX,
      top: frameY,
    });

    frames[item.id] = {
      frame: { x: frameX, y: frameY, w: item.width, h: item.height },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: item.width, h: item.height },
      sourceSize: { w: item.width, h: item.height },
      pivot: { x: 0.5, y: 1.0 },
    };

    currentX += item.width + PADDING;
    rowHeight = Math.max(rowHeight, item.height);
    maxW = Math.max(maxW, currentX);
  }

  const finalWidth = Math.max(512, Math.min(ATLAS_MAX_WIDTH, maxW + PADDING));
  const finalHeight = currentY + rowHeight + PADDING;

  console.log(`  Atlas dimensions: ${finalWidth}x${finalHeight}, ${items.length} frames`);

  await sharp({
    create: {
      width: finalWidth,
      height: finalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png({ compressionLevel: 8 })
    .toFile(atlasPngPath);

  const atlasData = {
    frames,
    meta: {
      app: 'DDWD Environment Atlas Packer',
      version: '1.0',
      image: `${packId}.png`,
      format: 'RGBA8888',
      size: { w: finalWidth, h: finalHeight },
      scale: 1,
    },
  };
  fs.writeFileSync(atlasJsonPath, JSON.stringify(atlasData, null, 2));

  // Visual Contact Sheet Preview (with dark grid and labels)
  const maxItemWidth = items.reduce((max, it) => Math.max(max, it.width), 0);
  const contactW = Math.max(1280, maxItemWidth + 60);

  let cY = 40;
  const cMargin = 24;
  const cComposites: sharp.OverlayOptions[] = [];

  const safeTitle = manifest.name.replace(/&/g, 'AND').toUpperCase();
  const titleSvg = `<svg width="${contactW}" height="32">
    <text x="${cMargin}" y="24" font-family="monospace" font-size="18" font-weight="bold" fill="#ffffff">${safeTitle} (${items.length} ITEMS)</text>
  </svg>`;
  cComposites.push({ input: Buffer.from(titleSvg), top: 8, left: 0 });

  let rX = cMargin;
  let rMaxH = 0;

  for (const item of items) {
    if (rX + item.width + 16 > contactW - cMargin) {
      rX = cMargin;
      cY += rMaxH + 28;
      rMaxH = 0;
    }

    cComposites.push({
      input: item.buffer,
      top: cY,
      left: rX,
    });

    const labelSvg = `<svg width="${Math.max(item.width + 8, 90)}" height="22">
      <text x="0" y="9" font-family="monospace" font-size="8" fill="#e0c060">${item.id.slice(0, 16)}</text>
      <text x="0" y="18" font-family="monospace" font-size="8" fill="#8888aa">${item.width}x${item.height}</text>
    </svg>`;
    cComposites.push({
      input: Buffer.from(labelSvg),
      top: cY + item.height + 2,
      left: rX,
    });

    rMaxH = Math.max(rMaxH, item.height + 24);
    rX += item.width + 16;
  }

  const contactH = cY + rMaxH + cMargin;
  await sharp({
    create: {
      width: contactW,
      height: contactH,
      channels: 4,
      background: { r: 16, g: 14, b: 22, alpha: 1 },
    },
  })
    .composite(cComposites)
    .png()
    .toFile(contactSheetPath);

  console.log(`  Saved atlas: ${atlasPngPath}`);
  console.log(`  Saved contact sheet: ${contactSheetPath}`);
}

async function main(): Promise<void> {
  const manifests = [
    'art/manifests/ddwd_env_02.json',
    'art/manifests/ddwd_env_03.json',
    'art/manifests/ddwd_env_04.json',
    'art/manifests/ddwd_env_05.json',
    'art/manifests/ddwd_env_06.json',
    'art/manifests/ddwd_env_07.json',
    'art/manifests/ddwd_env_08.json',
    'art/manifests/ddwd_env_11.json',
  ];

  for (const m of manifests) {
    const fullPath = path.join(ROOT_DIR, m);
    if (fs.existsSync(fullPath)) {
      await packManifestToAtlas(fullPath);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('Atlas Packing Error:', err);
    process.exit(1);
  });
}
