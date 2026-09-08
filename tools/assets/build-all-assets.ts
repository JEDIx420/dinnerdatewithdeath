import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { extractComponents, ExtractedComponent } from './build-environment-manifests';
import { packManifestToAtlas } from './build-pack-atlases';
import { buildCompiledCatalog } from './build-compiled-catalog';
import { EnvironmentAssetDef } from '../../src/game/environment/EnvironmentAsset';

const ROOT_DIR = process.cwd();

interface PackConfig {
  packId: string;
  environmentId: string;
  name: string;
  prefix: string;
  sourceImage: string;
  sourceDimensions: { width: number; height: number };
  categories: string[];
  classify: (b: ExtractedComponent) => {
    category: string;
    anchorPreset: EnvironmentAssetDef['anchorPreset'];
    depthClass: EnvironmentAssetDef['depthClass'];
  };
}

const PACK_CONFIGS: PackConfig[] = [
  {
    packId: 'ddwd_env_02',
    environmentId: 'mansion',
    name: 'Doors Windows Staircase',
    prefix: 'env02',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_02 — Doors Windows Staircase.png',
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['doors', 'windows', 'curtains', 'stairs', 'lighting'],
    classify: (b) => {
      if (b.y < 350) {
        if (b.x > 1150) return { category: 'lighting', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
        return { category: 'windows', anchorPreset: 'bottom-center', depthClass: 'back-wall-detail' };
      } else if (b.y < 700) {
        if (b.width < 80 && b.height > 100) return { category: 'curtains', anchorPreset: 'top-center', depthClass: 'back-wall-detail' };
        return { category: 'doors', anchorPreset: 'bottom-center', depthClass: 'back-wall' };
      } else {
        return { category: 'stairs', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      }
    },
  },
  {
    packId: 'ddwd_env_03',
    environmentId: 'mansion',
    name: 'Death Bedchamber',
    prefix: 'bed03',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_03 — Death Bedchamber.png',
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['furniture', 'personal', 'decor', 'lighting'],
    classify: (b) => {
      if (b.width > 120 && b.height > 120) return { category: 'furniture', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      if (b.width < 50 && b.height < 50) return { category: 'personal', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      return { category: 'decor', anchorPreset: 'bottom-center', depthClass: 'back-wall-detail' };
    },
  },
  {
    packId: 'ddwd_env_04',
    environmentId: 'mansion',
    name: 'Great Hall & Gallery',
    prefix: 'hall04',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_04 — Great Hall & Gallery.png',
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['lighting', 'sculpture', 'furniture', 'art', 'curios'],
    classify: (b) => {
      if (b.y < 350 && b.width > 120) return { category: 'lighting', anchorPreset: 'top-center', depthClass: 'foreground-structure' };
      if (b.height > 100) return { category: 'sculpture', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      return { category: 'curios', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
    },
  },
  {
    packId: 'ddwd_env_06',
    environmentId: 'mansion',
    name: 'Lounge & Fireplace',
    prefix: 'lounge06',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_06 — Lounge & Fireplace.png',
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['fireplace', 'furniture', 'flame', 'curios', 'decor'],
    classify: (b) => {
      if (b.width > 120 && b.height > 100) return { category: 'fireplace', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      if (b.width < 60 && b.height > 40 && b.y > 600) return { category: 'flame', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      return { category: 'furniture', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
    },
  },
  {
    packId: 'ddwd_env_07',
    environmentId: 'mansion',
    name: "Death's Art Collection",
    prefix: 'art07',
    sourceImage: "art/source/environment/mansion/DDWD_ENV_07 — Death's Art Collection.png",
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['paintings', 'portraits', 'studies', 'frames'],
    classify: () => ({ category: 'paintings', anchorPreset: 'center', depthClass: 'back-wall-detail' }),
  },
  {
    packId: 'ddwd_env_08',
    environmentId: 'mansion',
    name: 'Busts Statues & Clutter',
    prefix: 'clutter08',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_08 — Busts Statues & Clutter.png',
    sourceDimensions: { width: 1448, height: 1086 },
    categories: ['statues', 'busts', 'pedestals', 'clutter'],
    classify: (b) => {
      if (b.height > 120) return { category: 'statues', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      if (b.width < 50 && b.height < 50) return { category: 'clutter', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      return { category: 'busts', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
    },
  },
  {
    packId: 'ddwd_env_11',
    environmentId: 'cemetery',
    name: 'Cemetery',
    prefix: 'cem11',
    sourceImage: 'art/source/environment/cemetery/DDWD_ENV_11 — Cemetery.png',
    sourceDimensions: { width: 1254, height: 1254 },
    categories: ['graves', 'buildings', 'statues', 'vegetation', 'lighting', 'clutter'],
    classify: (b) => {
      if (b.width > 120 && b.height > 120) return { category: 'buildings', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      if (b.height > 80) return { category: 'statues', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
      return { category: 'graves', anchorPreset: 'bottom-center', depthClass: 'dynamic-solid' };
    },
  },
];

async function extractDiningAssets(): Promise<ExtractedComponent[]> {
  const imgPath = path.join(ROOT_DIR, 'art/source/environment/mansion/DDWD_ENV_05 — Dining Room.png');
  const img = sharp(imgPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  const rowBands = [
    { minY: 46, maxY: 212 },
    { minY: 218, maxY: 343 },
    { minY: 349, maxY: 482 },
    { minY: 488, maxY: 619 },
    { minY: 625, maxY: 736 },
    { minY: 742, maxY: 851 },
    { minY: 857, maxY: 1000 },
  ];

  const boxes: ExtractedComponent[] = [];
  for (let r = 0; r < rowBands.length; r++) {
    const band = rowBands[r];
    const bandH = band.maxY - band.minY + 1;
    const visited = new Uint8Array(w * bandH);

    for (let by = 0; by < bandH; by += 2) {
      const y = band.minY + by;
      for (let x = 20; x < w - 20; x += 2) {
        const vidx = by * w + x;
        if (visited[vidx]) continue;
        const alpha = data[(y * w + x) * 4 + 3];
        if (alpha > 35) {
          let minX = x;
          let maxX = x;
          let minY = y;
          let maxY = y;
          let count = 0;
          const q = [x, y];
          visited[vidx] = 1;
          let head = 0;
          while (head < q.length) {
            const cx = q[head++];
            const cy = q[head++];
            count++;
            if (cx < minX) minX = cx;
            if (cx > maxX) maxX = cx;
            if (cy < minY) minY = cy;
            if (cy > maxY) maxY = cy;

            const neighbors = [
              [cx + 2, cy],
              [cx - 2, cy],
              [cx, cy + 2],
              [cx, cy - 2],
              [cx + 3, cy],
              [cx - 3, cy],
            ];
            for (const [nx, ny] of neighbors) {
              if (nx >= 20 && nx < w - 20 && ny >= band.minY && ny <= band.maxY) {
                const nby = ny - band.minY;
                const nvidx = nby * w + nx;
                if (!visited[nvidx]) {
                  visited[nvidx] = 1;
                  if (data[(ny * w + nx) * 4 + 3] > 35) {
                    q.push(nx, ny);
                  }
                }
              }
            }
          }

          const bw = maxX - minX + 1;
          const bh = maxY - minY + 1;
          if (bw >= 12 && bh >= 12 && bw < 800 && count >= 50) {
            let trueMinX = minX;
            let trueMaxX = maxX;
            let trueMinY = minY;
            let trueMaxY = maxY;
            for (let cy = minY; cy <= maxY; cy++) {
              for (let cx = minX; cx <= maxX; cx++) {
                if (data[(cy * w + cx) * 4 + 3] > 35) {
                  if (cx < trueMinX) trueMinX = cx;
                  if (cx > trueMaxX) trueMaxX = cx;
                  if (cy < trueMinY) trueMinY = cy;
                  if (cy > trueMaxY) trueMaxY = cy;
                }
              }
            }
            const finalW = trueMaxX - trueMinX + 1;
            const finalH = trueMaxY - trueMinY + 1;
            if (finalW >= 12 && finalH >= 12 && finalW < 750) {
              boxes.push({ x: trueMinX, y: trueMinY, width: finalW, height: finalH, pixels: count });
            }
          }
        }
      }
    }
  }

  boxes.sort((a, b) => {
    const rowA = Math.floor(a.y / 60);
    const rowB = Math.floor(b.y / 60);
    return rowA - rowB || a.x - b.x;
  });

  return boxes;
}

export async function buildAllAssets(): Promise<void> {
  console.log('=== STEP 1: GENERATING MANIFESTS WITH STRICT UNIQUE IDS & HERO DEFINITIONS ===');
  fs.mkdirSync(path.join(ROOT_DIR, 'art/manifests'), { recursive: true });

  for (const cfg of PACK_CONFIGS) {
    console.log(`Processing ${cfg.packId} (${cfg.name})...`);
    const fullSourcePath = path.join(ROOT_DIR, cfg.sourceImage);
    const boxes = await extractComponents(fullSourcePath);

    boxes.sort((a, b) => {
      const rowA = Math.floor(a.y / 60);
      const rowB = Math.floor(b.y / 60);
      return rowA - rowB || a.x - b.x;
    });

    const assets: unknown[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      const cls = cfg.classify(b);
      let id = `${cfg.prefix}_${cls.category}_${String(i + 1).padStart(2, '0')}`;

      let lightSockets = undefined;
      let windowMasks = undefined;
      const surfaces = undefined;
      let collisionProfile: EnvironmentAssetDef['collisionProfile'] = 'none';

      if (cfg.packId === 'ddwd_env_02') {
        if (i === 0) {
          id = 'env02_window_gothic_tall';
          b.x = 28; b.y = 28; b.width = 72; b.height = 160;
          windowMasks = [{ localX: 10, localY: 16, width: 52, height: 130 }];
        } else if (i === 10) {
          id = 'env02_sconce_bronze';
          b.x = 61; b.y = 73; b.width = 50; b.height = 70;
          lightSockets = [{ id: 'sconce_candle', localX: 25, localY: 8, radius: 44, intensity: 0.4, flameMode: 'overlay' }];
        } else if (i === 20) {
          id = 'env02_door_jamb_portal';
        }
      } else if (cfg.packId === 'ddwd_env_03') {
        if (i === 0) {
          id = 'bed03_bed_grand_gothic';
          b.x = 580; b.y = 56; b.width = 221; b.height = 364;
          collisionProfile = 'bed_large';
        } else if (i === 1) {
          id = 'bed03_vanity_ornate';
          b.x = 125; b.y = 164; b.width = 106; b.height = 251;
          collisionProfile = 'vanity';
        } else if (i === 2) {
          id = 'bed03_wardrobe_tall';
          b.x = 230; b.y = 108; b.width = 121; b.height = 304;
          collisionProfile = 'wardrobe_large';
        } else if (i === 3) {
          id = 'bed03_bedside_cabinet';
          b.x = 1170; b.y = 130; b.width = 110; b.height = 180;
          collisionProfile = 'nightstand';
        } else if (i === 9) {
          id = 'bed03_armchair_crimson';
          b.x = 460; b.y = 206; b.width = 121; b.height = 214;
          collisionProfile = 'armchair';
        }
      } else if (cfg.packId === 'ddwd_env_04') {
        if (i === 0) {
          id = 'hall04_chandelier_grand';
          b.x = 163; b.y = 33; b.width = 134; b.height = 227;
          lightSockets = [
            { id: 'candle_1', localX: 18, localY: 22, radius: 40, intensity: 0.35, flameMode: 'overlay' },
            { id: 'candle_2', localX: 42, localY: 26, radius: 40, intensity: 0.35, flameMode: 'overlay' },
            { id: 'candle_3', localX: 68, localY: 28, radius: 44, intensity: 0.4, flameMode: 'overlay' },
            { id: 'candle_4', localX: 94, localY: 26, radius: 40, intensity: 0.35, flameMode: 'overlay' },
            { id: 'candle_5', localX: 118, localY: 22, radius: 40, intensity: 0.35, flameMode: 'overlay' },
          ];
        } else if (i === 1) {
          // Statues: Weeping Angel sculpture
          id = 'hall04_statue_bust_marble';
          b.x = 880; b.y = 380; b.width = 111; b.height = 201;
          cls.category = 'sculpture';
          cls.anchorPreset = 'bottom-center';
          cls.depthClass = 'dynamic-solid';
          collisionProfile = 'statue_large';
        }
      } else if (cfg.packId === 'ddwd_env_05') {
        if (i === 0) {
          id = 'dining05_table_banquet_runner';
          b.x = 28; b.y = 79; b.width = 213; b.height = 123;
          collisionProfile = 'dining_table_large';
        } else if (i === 1) {
          id = 'dining05_chair_tufted';
          b.x = 270; b.y = 50; b.width = 91; b.height = 171;
          collisionProfile = 'dining_chair';
        } else if (i === 2) {
          id = 'dining05_sideboard_oak';
          b.x = 370; b.y = 50; b.width = 128; b.height = 161;
          collisionProfile = 'sideboard';
        }
      } else if (cfg.packId === 'ddwd_env_06') {
        if (i === 0) {
          id = 'lounge06_fireplace_stone';
          b.x = 126; b.y = 88; b.width = 114; b.height = 130;
          collisionProfile = 'fireplace_hearth';
          lightSockets = [{ id: 'hearth_fire', localX: 57, localY: 95, radius: 80, intensity: 0.55, kind: 'fireplace', flameMode: 'none' }];
        } else if (i === 9) {
          id = 'lounge06_sofa_ornate';
          b.x = 470; b.y = 235; b.width = 230; b.height = 145;
          collisionProfile = 'sofa';
        } else if (i === 5) {
          id = 'lounge06_armchair_velvet';
          b.x = 880; b.y = 230; b.width = 110; b.height = 155;
          collisionProfile = 'armchair';
        } else if (i === 21) {
          id = 'lounge06_bookshelf_tall';
          b.x = 412; b.y = 410; b.width = 118; b.height = 174;
          collisionProfile = 'bookshelf';
        } else if (i === 8) {
          id = 'lounge06_coffee_table_wood';
          b.x = 1198; b.y = 258; b.width = 156; b.height = 134;
          collisionProfile = 'coffee_table';
        } else if (i === 11) {
          id = 'lounge06_tv_retro';
          b.x = 552; b.y = 448; b.width = 130; b.height = 132;
          collisionProfile = 'tv_console';
        } else if (i === 20) {
          id = 'lounge06_basket_firewood';
          b.x = 242; b.y = 266; b.width = 112; b.height = 124;
          collisionProfile = 'none';
        } else if (i === 18) {
          id = 'lounge06_art_ship';
          b.x = 1148; b.y = 440; b.width = 170; b.height = 140;
          cls.category = 'art';
          cls.depthClass = 'back-wall-detail';
        } else if (i === 14) {
          id = 'lounge06_couch_loveseat';
          b.x = 705; b.y = 235; b.width = 170; b.height = 145;
          collisionProfile = 'sofa';
        } else if (i === 22) {
          id = 'lounge06_candelabra_gold';
          b.x = 1295; b.y = 262; b.width = 55; b.height = 70;
          cls.category = 'decor';
          cls.depthClass = 'dynamic-solid';
          lightSockets = [
            { id: 'left_flame', localX: 12, localY: 18, radius: 36, intensity: 0.38, flameMode: 'none' },
            { id: 'mid_flame', localX: 28, localY: 8, radius: 44, intensity: 0.45, flameMode: 'none' },
            { id: 'right_flame', localX: 44, localY: 18, radius: 36, intensity: 0.38, flameMode: 'none' },
          ];
        }
      }

      let finalId = id;
      let counter = 1;
      while (usedIds.has(finalId)) {
        finalId = `${id}_${counter++}`;
      }
      usedIds.add(finalId);

      assets.push({
        id: finalId,
        category: cls.category,
        sourceRect: { x: b.x, y: b.y, width: b.width, height: b.height },
        anchorPreset: cls.anchorPreset,
        depthClass: cls.depthClass,
        physicalClass: cls.depthClass === 'dynamic-solid' ? 'floor-solid' : 'none',
        collisionProfile,
        lightSockets,
        windowMasks,
        surfaces,
        notes: `${cfg.name} asset (${b.width}x${b.height})`,
      });
    }

    const manifest = {
      packId: cfg.packId,
      environmentId: cfg.environmentId,
      name: cfg.name,
      sourceImage: cfg.sourceImage,
      sourceDimensions: cfg.sourceDimensions,
      categories: cfg.categories,
      assets,
    };
    fs.writeFileSync(path.join(ROOT_DIR, `art/manifests/${cfg.packId}.json`), JSON.stringify(manifest, null, 2));
    console.log(`  Saved ${cfg.packId}.json with ${assets.length} unique assets.`);
  }

  // ENV_05 (Dining Room)
  console.log('Processing ddwd_env_05 (Dining Room)...');
  const diningBoxes = await extractDiningAssets();
  const diningAssets: unknown[] = [];
  const diningUsedIds = new Set<string>();

  for (let i = 0; i < diningBoxes.length; i++) {
    const b = diningBoxes[i];
    let cat = 'decor';
    const depth: EnvironmentAssetDef['depthClass'] = 'dynamic-solid';
    let col: EnvironmentAssetDef['collisionProfile'] = 'none';
    const anchor: EnvironmentAssetDef['anchorPreset'] = 'bottom-center';
    let lightSockets = undefined;
    let surfaces = undefined;

    if (b.width > 120 || b.height > 90) cat = 'furniture';
    else if (b.width < 45 && b.height < 45) cat = 'tableware';
    else if (b.height > 50 && b.width < 50) cat = 'lighting';

    let id = `dining05_${cat}_${String(i + 1).padStart(2, '0')}`;

    if (i === 0) {
      id = 'dining05_table_banquet_runner';
      b.x = 28; b.y = 80; b.width = 240; b.height = 124;
      col = 'dining_table_large';
      surfaces = {
        runner: { id: 'runner', name: 'runner', localX: 30, localY: 20, width: b.width - 60, height: b.height - 35 },
      };
    } else if (i === 1) {
      id = 'dining05_sideboard_oak';
      b.x = 944; b.y = 60; b.width = 124; b.height = 152;
      col = 'sideboard';
    } else if (i === 3) {
      id = 'dining05_chair_tufted';
      b.x = 536; b.y = 48; b.width = 80; b.height = 164;
      col = 'dining_chair';
    } else if (i === 13) {
      id = 'dining05_candelabra_three_branch';
      b.x = 1297; b.y = 262; b.width = 50; b.height = 60;
      lightSockets = [
        { id: 'left_flame', localX: 11, localY: 16, radius: 40, intensity: 0.38, flameMode: 'none' },
        { id: 'center_flame', localX: 25, localY: 8, radius: 44, intensity: 0.42, flameMode: 'none' },
        { id: 'right_flame', localX: 39, localY: 16, radius: 40, intensity: 0.38, flameMode: 'none' },
      ];
    } else if (i === 32) {
      id = 'dining05_tableware_10';
    } else if (i === 33) {
      id = 'dining05_tableware_02';
    }

    let finalId = id;
    let counter = 1;
    while (diningUsedIds.has(finalId)) {
      finalId = `${id}_${counter++}`;
    }
    diningUsedIds.add(finalId);

    diningAssets.push({
      id: finalId,
      category: cat,
      sourceRect: { x: b.x, y: b.y, width: b.width, height: b.height },
      anchorPreset: anchor,
      depthClass: depth,
      physicalClass: cat === 'furniture' ? 'floor-solid' : 'none',
      collisionProfile: col,
      lightSockets,
      surfaces,
      notes: `Dining Room asset (${b.width}x${b.height})`,
    });
  }

  const diningManifest = {
    packId: 'ddwd_env_05',
    environmentId: 'mansion',
    name: 'Dining Room',
    sourceImage: 'art/source/environment/mansion/DDWD_ENV_05 — Dining Room.png',
    sourceDimensions: { width: 1536, height: 1024 },
    categories: ['furniture', 'tableware', 'lighting', 'decor'],
    assets: diningAssets,
  };
  fs.writeFileSync(path.join(ROOT_DIR, 'art/manifests/ddwd_env_05.json'), JSON.stringify(diningManifest, null, 2));
  console.log(`  Saved ddwd_env_05.json with ${diningAssets.length} unique assets.`);

  // STEP 2: BUILD TEXTURE ATLASES AND CONTACT SHEETS
  console.log('\n=== STEP 2: BUILDING TEXTURE ATLASES AND CONTACT SHEETS ===');
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

  // STEP 3: BUILD COMPILED CATALOG
  console.log('\n=== STEP 3: COMPILING UNIFIED ENVIRONMENT ASSET CATALOG ===');
  buildCompiledCatalog();

  console.log('\nAll assets successfully generated and compiled!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildAllAssets().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
