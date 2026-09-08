import { EnvironmentPlacement } from './EnvironmentPlacement';
import { placeMirroredPair } from './SymmetryHelpers';

/**
 * Authoritative production environment placements for Death's Grand Mansion.
 * Covers all 5 zones with production furnishings, curated art, light fixtures,
 * clean portal doorways, and surface-attached tableware/clutter.
 */
export function buildMansionPlacements(): EnvironmentPlacement[] {
  const placements: EnvironmentPlacement[] = [];
  const AXIS_X = 640;

  // =========================================================================
  // ZONE 1: DEATH'S BEDCHAMBER (Upper West: x: 48..448, y: 72..320)
  // =========================================================================
  // 1. Focal Vanity & Mirror at x: 200, y: 130
  placements.push({
    id: 'bedchamber_vanity',
    assetId: 'bed03_vanity_ornate',
    x: 200,
    y: 140,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'focal_mirror',
    depthClass: 'dynamic-solid',
    collisionProfile: 'vanity',
  });

  // Framing cornice above mirror
  placements.push({
    id: 'bedchamber_mirror_cornice',
    assetId: 'trim_cornice_wood_a',
    x: 200,
    y: 50,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'framing',
    depthClass: 'back-wall-detail',
  });

  // Flanking columns behind vanity
  const [mirrorColL, mirrorColR] = placeMirroredPair(
    'bedchamber_mirror_col',
    200,
    46,
    130,
    'column_wood_fluted',
    'column_wood_fluted',
    {
      zone: 'bedchamber',
      role: 'framing',
      scale: 0.85,
      collisionProfile: 'none',
    }
  );
  placements.push(mirrorColL, mirrorColR);

  // 2. Hero Grand Gothic Bed at North-West
  placements.push({
    id: 'bedchamber_bed',
    assetId: 'bed03_bed_grand_gothic',
    x: 320,
    y: 190,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'bed',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bed_large',
  });

  // 3. Tall Carved Wardrobe along West wall
  placements.push({
    id: 'bedchamber_wardrobe',
    assetId: 'bed03_wardrobe_tall',
    x: 90,
    y: 180,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'wardrobe',
    depthClass: 'dynamic-solid',
    collisionProfile: 'wardrobe_large',
  });

  // 4. Bedside Nightstand
  placements.push({
    id: 'bedchamber_nightstand',
    assetId: 'bed03_bedside_cabinet',
    x: 396,
    y: 190,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'nightstand',
    depthClass: 'dynamic-solid',
    collisionProfile: 'nightstand',
  });

  // Candle fixture on nightstand (surface attached)
  placements.push({
    id: 'bedchamber_nightstand_candle',
    assetId: 'dining05_candelabra_three_branch',
    x: 0,
    y: -28,
    scale: 0.6,
    parentPlacementId: 'bedchamber_nightstand',
    zone: 'bedchamber',
    role: 'candle',
    disableCollision: true,
  });

  // 5. Upholstered Crimson Armchair
  placements.push({
    id: 'bedchamber_armchair',
    assetId: 'bed03_armchair_crimson',
    x: 340,
    y: 280,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'armchair',
    depthClass: 'dynamic-solid',
    collisionProfile: 'armchair',
  });

  // 6. Production Window with masked rain
  placements.push({
    id: 'bedchamber_window',
    assetId: 'env02_window_gothic_tall',
    x: 100,
    y: 100,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // 7. Intimate Curated Wall Art
  placements.push({
    id: 'bedchamber_art_portrait',
    assetId: 'art07_paintings_03',
    x: 200,
    y: 70,
    anchorPreset: 'center',
    zone: 'bedchamber',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 8. Clean Portal Doorway from Bedchamber into Upper Landing (x: 440)
  placements.push({
    id: 'bedchamber_portal_jamb_top',
    assetId: 'env02_door_jamb_portal',
    x: 440,
    y: 120,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'portal',
    depthClass: 'dynamic-solid',
    collisionProfile: 'door_jamb',
  });
  placements.push({
    id: 'bedchamber_portal_jamb_bottom',
    assetId: 'env02_door_jamb_portal',
    x: 440,
    y: 260,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'portal',
    depthClass: 'dynamic-solid',
    collisionProfile: 'door_jamb',
  });

  // =========================================================================
  // ZONE 2: UPPER LANDING & BALUSTRADE OVERLOOK (Upper East: x: 448..832, y: 72..288)
  // =========================================================================
  // Mirrored Balustrades at y: 268
  const [balustradeL, balustradeR] = placeMirroredPair(
    'landing_balustrade',
    AXIS_X,
    136,
    268,
    'balustrade_section',
    'balustrade_section',
    {
      zone: 'upper_landing',
      role: 'balustrade',
      flipXRight: true,
      collisionProfile: 'balustrade_span_wide',
    }
  );
  placements.push(balustradeL, balustradeR);

  // Landing Terminal Newels
  const [mouthNewelL, mouthNewelR] = placeMirroredPair(
    'landing_mouth_newel',
    AXIS_X,
    84,
    268,
    'newel_post_large',
    'newel_post_large',
    {
      zone: 'upper_landing',
      role: 'newel',
      flipXRight: true,
      collisionProfile: 'newel_large',
    }
  );
  placements.push(mouthNewelL, mouthNewelR);

  // Symmetrical Wall Sconces with localized flame sockets
  const [sconceL, sconceR] = placeMirroredPair(
    'landing_sconce',
    AXIS_X,
    110,
    90,
    'env02_sconce_bronze',
    'env02_sconce_bronze',
    {
      zone: 'upper_landing',
      role: 'sconce',
      flipXRight: true,
      collisionProfile: 'none',
    }
  );
  placements.push(sconceL, sconceR);

  // Curated Art: Aristocratic study and Memento Mori
  placements.push({
    id: 'landing_art_portrait',
    assetId: 'art07_paintings_06',
    x: AXIS_X - 110,
    y: 65,
    anchorPreset: 'center',
    zone: 'upper_landing',
    role: 'art',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'landing_art_celestial',
    assetId: 'art07_paintings_01',
    x: AXIS_X + 110,
    y: 65,
    anchorPreset: 'center',
    zone: 'upper_landing',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // =========================================================================
  // ZONE 3: GREAT HALL & GALLERY (Ground Center: x: 448..832, y: 520..920)
  // =========================================================================
  // 1. Hero Grand Chandelier on central axis X = 640
  placements.push({
    id: 'hall_chandelier',
    assetId: 'hall04_chandelier_grand',
    x: AXIS_X,
    y: 560,
    anchorPreset: 'top-center',
    zone: 'great_hall',
    role: 'chandelier',
    depthClass: 'foreground-structure',
    disableCollision: true,
  });

  // 2. Marble Statues & Bust Displays along lateral flanks
  placements.push({
    id: 'hall_statue_left',
    assetId: 'hall04_statue_bust_marble',
    x: AXIS_X - 160,
    y: 760,
    anchorPreset: 'bottom-center',
    zone: 'great_hall',
    role: 'statue',
    depthClass: 'dynamic-solid',
    collisionProfile: 'statue_base',
  });
  placements.push({
    id: 'hall_statue_right',
    assetId: 'hall04_statue_bust_marble',
    x: AXIS_X + 160,
    y: 760,
    anchorPreset: 'bottom-center',
    zone: 'great_hall',
    role: 'statue',
    depthClass: 'dynamic-solid',
    collisionProfile: 'statue_base',
    flipX: true,
  });

  // 3. Hero Columns (Top Row: y: 640, Bottom Row: y: 890)
  const [colTopL, colTopR] = placeMirroredPair(
    'hall_col_top',
    AXIS_X,
    160,
    640,
    'column_stone_massive',
    'column_stone_massive',
    {
      zone: 'great_hall',
      role: 'column',
      flipXRight: true,
      collisionProfile: 'column_massive',
    }
  );
  placements.push(colTopL, colTopR);

  const [colBottomL, colBottomR] = placeMirroredPair(
    'hall_col_bottom',
    AXIS_X,
    160,
    890,
    'column_stone_massive',
    'column_stone_massive',
    {
      zone: 'great_hall',
      role: 'column',
      flipXRight: true,
      collisionProfile: 'column_massive',
    }
  );
  placements.push(colBottomL, colBottomR);

  // 4. Terminal Staircase Arrival Newels at y: 552
  const [stairBottomNewelL, stairBottomNewelR] = placeMirroredPair(
    'stair_bottom_newel',
    AXIS_X,
    84,
    552,
    'newel_post_large',
    'newel_post_large',
    {
      zone: 'great_hall',
      role: 'newel',
      flipXRight: true,
      collisionProfile: 'newel_large',
    }
  );
  placements.push(stairBottomNewelL, stairBottomNewelR);

  // 5. Curated Fine Art: Celestial Chart & Battlefield
  placements.push({
    id: 'hall_art_celestial',
    assetId: 'art07_paintings_04',
    x: AXIS_X - 110,
    y: 470,
    anchorPreset: 'center',
    zone: 'great_hall',
    role: 'art',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'hall_art_battlefield',
    assetId: 'art07_paintings_07',
    x: AXIS_X + 110,
    y: 470,
    anchorPreset: 'center',
    zone: 'great_hall',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // =========================================================================
  // ZONE 4: HERO DINING ROOM (Ground West: x: 48..448, y: 520..920)
  // =========================================================================
  // 1. Hero Banquet Table at x: 240, y: 720
  placements.push({
    id: 'dining_table',
    assetId: 'dining05_table_banquet_runner',
    x: 240,
    y: 720,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'banquet_table',
    depthClass: 'dynamic-solid',
    collisionProfile: 'dining_table_large',
  });

  // 2. Love's & Death's Dining Chairs
  placements.push({
    id: 'dining_chair_love',
    assetId: 'dining05_chair_tufted',
    x: 136,
    y: 710,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'chair_love',
    depthClass: 'dynamic-solid',
    collisionProfile: 'dining_chair',
  });
  placements.push({
    id: 'dining_chair_death',
    assetId: 'dining05_chair_tufted',
    x: 344,
    y: 710,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'chair_death',
    depthClass: 'dynamic-solid',
    collisionProfile: 'dining_chair',
    flipX: true,
  });

  // 3. Surface-Attached Place Settings & Tableware
  // Candelabra left and right with multi-point flame sockets
  placements.push({
    id: 'dining_candelabra_left',
    assetId: 'dining05_candelabra_three_branch',
    x: -50,
    y: -38,
    scale: 0.75,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'candelabra',
    disableCollision: true,
  });
  placements.push({
    id: 'dining_candelabra_right',
    assetId: 'dining05_candelabra_three_branch',
    x: 50,
    y: -38,
    scale: 0.75,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'candelabra',
    disableCollision: true,
  });

  // Centerpiece Wine & Decanter
  placements.push({
    id: 'dining_table_wine',
    assetId: 'dining05_tableware_10',
    x: 0,
    y: -34,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'wine',
    disableCollision: true,
  });

  // Love's setting (left)
  placements.push({
    id: 'dining_plate_love',
    assetId: 'dining05_tableware_02',
    x: -30,
    y: -26,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'place_setting',
    disableCollision: true,
  });
  // Death's setting (right)
  placements.push({
    id: 'dining_plate_death',
    assetId: 'dining05_tableware_02',
    x: 30,
    y: -26,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'place_setting',
    disableCollision: true,
  });

  // 4. North Wall Sideboard Credenza
  placements.push({
    id: 'dining_sideboard',
    assetId: 'dining05_sideboard_oak',
    x: 240,
    y: 530,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'sideboard',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sideboard',
  });

  // 5. Curated Art above Sideboard
  placements.push({
    id: 'dining_art_feast',
    assetId: 'art07_paintings_08',
    x: 240,
    y: 450,
    anchorPreset: 'center',
    zone: 'dining_room',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 6. Paired Windows with interior rain masks
  placements.push({
    id: 'dining_window_left',
    assetId: 'env02_window_gothic_tall',
    x: 100,
    y: 470,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'window',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'dining_window_right',
    assetId: 'env02_window_gothic_tall',
    x: 380,
    y: 470,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // 7. Clean Entryway Columns framing portal into Great Hall (x: 440)
  placements.push({
    id: 'dining_entry_col_top',
    assetId: 'column_wood_corinthian',
    x: 440,
    y: 580,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'portal_column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });
  placements.push({
    id: 'dining_entry_col_bottom',
    assetId: 'column_wood_corinthian',
    x: 440,
    y: 870,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'portal_column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });

  // =========================================================================
  // ZONE 5: LOUNGE & HEARTH (Ground East: x: 832..1232, y: 520..920)
  // =========================================================================
  // 1. Hero Production Fireplace at x: 1040, y: 530
  placements.push({
    id: 'lounge_fireplace',
    assetId: 'lounge06_fireplace_stone',
    x: 1040,
    y: 530,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'fireplace',
    depthClass: 'dynamic-solid',
    collisionProfile: 'fireplace_hearth',
  });

  // 2. Hero Tufted Velvet Sofa facing Fireplace
  placements.push({
    id: 'lounge_sofa',
    assetId: 'lounge06_sofa_ornate',
    x: 1040,
    y: 730,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'sofa',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
  });

  // 3. Lounge Coffee Table
  placements.push({
    id: 'lounge_coffee_table',
    assetId: 'lounge06_coffee_table_wood',
    x: 1040,
    y: 650,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'coffee_table',
    depthClass: 'dynamic-solid',
    collisionProfile: 'coffee_table',
  });

  // 4. Fireside Armchair
  placements.push({
    id: 'lounge_armchair',
    assetId: 'lounge06_armchair_velvet',
    x: 910,
    y: 660,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'armchair',
    depthClass: 'dynamic-solid',
    collisionProfile: 'armchair',
  });

  // 5. Antique Bookshelf along East wall
  placements.push({
    id: 'lounge_bookshelf',
    assetId: 'lounge06_bookshelf_tall',
    x: 1200,
    y: 640,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'bookshelf',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bookshelf',
  });

  // 6. Vintage Retro Television Console
  placements.push({
    id: 'lounge_tv',
    assetId: 'lounge06_tv_retro',
    x: 1190,
    y: 780,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'tv',
    depthClass: 'dynamic-solid',
    collisionProfile: 'tv_console',
  });

  // 7. Curated Art over Bookshelf
  placements.push({
    id: 'lounge_art_landscape',
    assetId: 'art07_paintings_09',
    x: 1040,
    y: 430,
    anchorPreset: 'center',
    zone: 'lounge',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 8. Lounge Window with interior rain
  placements.push({
    id: 'lounge_window',
    assetId: 'env02_window_gothic_tall',
    x: 1160,
    y: 470,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // 9. Clean Entryway Columns from Great Hall into Lounge (x: 840)
  placements.push({
    id: 'lounge_entry_col_top',
    assetId: 'column_wood_gold_trim',
    x: 840,
    y: 580,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'portal_column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });
  placements.push({
    id: 'lounge_entry_col_bottom',
    assetId: 'column_wood_gold_trim',
    x: 840,
    y: 870,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'portal_column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });

  return placements;
}
