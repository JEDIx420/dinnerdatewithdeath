import { EnvironmentPlacement } from './EnvironmentPlacement';
import { placeMirroredPair } from './SymmetryHelpers';

/**
 * Authoritative production environment placements for Death's Grand Mansion.
 * Restored to clean, restrained, grand architectural baseline with curated hero pieces,
 * strict keep-clear zones, and zero dollhouse clutter.
 */
export function buildMansionPlacements(): EnvironmentPlacement[] {
  const placements: EnvironmentPlacement[] = [];
  const AXIS_X = 640;

  // =========================================================================
  // ZONE 1: DEATH'S BEDCHAMBER (Upper West: x: 48..448, y: 72..320)
  // Private, quiet, gothic elegance. Clean sitting corner on left, away from door.
  // No hidden windows behind wardrobes. Zero clutter.
  // =========================================================================
  // 1. Visible Gothic Arched Window on North-West wall bay
  placements.push({
    id: 'bedchamber_window',
    assetId: 'env02_window_gothic_tall',
    x: 95,
    y: 75,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // 2. Left Sitting Corner: Plush Crimson Armchair by the window (away from door!)
  placements.push({
    id: 'bedchamber_armchair',
    assetId: 'bed03_armchair_crimson',
    x: 95,
    y: 220,
    scale: 0.45,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'armchair',
    depthClass: 'dynamic-solid',
    collisionProfile: 'armchair',
  });

  // 3. Tall Carved Wardrobe against solid wainscot wall (NO window behind it!)
  placements.push({
    id: 'bedchamber_wardrobe',
    assetId: 'bed03_wardrobe_tall',
    x: 205,
    y: 130,
    scale: 0.45,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'wardrobe',
    depthClass: 'dynamic-solid',
    collisionProfile: 'wardrobe_large',
  });

  // 4. Dressing Vanity with antique mirror
  placements.push({
    id: 'bedchamber_vanity',
    assetId: 'bed03_vanity_ornate',
    x: 320,
    y: 130,
    scale: 0.45,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'vanity',
    depthClass: 'dynamic-solid',
    collisionProfile: 'vanity',
  });

  // Curated Portrait Art above vanity
  placements.push({
    id: 'bedchamber_art_portrait',
    assetId: 'art07_paintings_03',
    x: 320,
    y: 55,
    scale: 0.42,
    anchorPreset: 'center',
    zone: 'bedchamber',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 5. Hero Grand Gothic Four-Poster Bed
  placements.push({
    id: 'bedchamber_bed',
    assetId: 'bed03_bed_grand_gothic',
    x: 205,
    y: 290,
    scale: 0.46,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'bed',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bed_large',
  });

  // Bedside Nightstand
  placements.push({
    id: 'bedchamber_nightstand',
    assetId: 'bed03_bedside_cabinet',
    x: 295,
    y: 280,
    scale: 0.42,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'nightstand',
    depthClass: 'dynamic-solid',
    collisionProfile: 'nightstand',
  });

  // Candle fixture on nightstand
  placements.push({
    id: 'bedchamber_candle',
    assetId: 'lounge06_candelabra_gold',
    x: 0,
    y: -22,
    scale: 0.35,
    parentPlacementId: 'bedchamber_nightstand',
    zone: 'bedchamber',
    role: 'candle',
    disableCollision: true,
  });

  // Hallway Edge Art leading from bedroom
  placements.push({
    id: 'bedchamber_art_hallway_edge',
    assetId: 'art07_paintings_02',
    x: 420,
    y: 65,
    scale: 0.42,
    anchorPreset: 'center',
    zone: 'bedchamber',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // North wall wainscot panels
  placements.push({
    id: 'bedchamber_wainscot_west',
    assetId: 'wall_panel_wood_wainscot_a',
    x: 96,
    y: 84,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'wainscot',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'bedchamber_wainscot_east',
    assetId: 'wall_panel_wood_wainscot_b',
    x: 376,
    y: 84,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'wainscot',
    depthClass: 'back-wall',
  });

  // Clean Doorway Portal: Half-columns framing open walkthrough passage into Landing (x: 440)
  placements.push({
    id: 'bedchamber_door_pillar_top',
    assetId: 'half_column_wood_gold',
    x: 440,
    y: 136,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'doorway',
    depthClass: 'dynamic-solid',
    collisionProfile: 'door_jamb',
  });
  placements.push({
    id: 'bedchamber_door_pillar_bottom',
    assetId: 'half_column_wood_gold',
    x: 440,
    y: 248,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'doorway',
    depthClass: 'dynamic-solid',
    collisionProfile: 'door_jamb',
  });

  // =========================================================================
  // ZONE 2: UPPER LANDING & BALUSTRADE OVERLOOK (Upper East: x: 448..832, y: 72..288)
  // Ceremonial, open, elegant. Grey framed panels removed. Symmetrical and uncluttered.
  // =========================================================================
  // Symmetrical Balustrades at y: 268
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

  // Landing Terminal Newels at staircase mouth
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

  // Outer terminal balustrade posts at wall junctions
  const [wallNewelL, wallNewelR] = placeMirroredPair(
    'landing_wall_newel',
    AXIS_X,
    192,
    268,
    'balustrade_post',
    'balustrade_post',
    {
      zone: 'upper_landing',
      role: 'newel',
      flipXRight: true,
      collisionProfile: 'newel_small',
    }
  );
  placements.push(wallNewelL, wallNewelR);

  // Symmetrical Wall Sconces with soft warm light
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
      scale: 0.65,
      flipXRight: true,
      collisionProfile: 'none',
    }
  );
  placements.push(sconceL, sconceR);

  // Curated Fine Art: 2 Symmetrical portraits flanking center axis on valid wall bays
  placements.push({
    id: 'landing_art_portrait_west',
    assetId: 'art07_paintings_06',
    x: AXIS_X - 65,
    y: 60,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'upper_landing',
    role: 'art',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'landing_art_portrait_east',
    assetId: 'art07_paintings_01',
    x: AXIS_X + 65,
    y: 60,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'upper_landing',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // =========================================================================
  // ZONE 3: GREAT HALL & GALLERY (Ground Center: x: 448..832, y: 520..920)
  // Grand, monumental. Bottom of stairs is a STRICT keep-clear zone (zero clutter).
  // Hero chandelier moved deeper into hall overhead.
  // =========================================================================
  // 1. Singular Grand Chandelier placed deeper into hall at x: 640, y: 640
  placements.push({
    id: 'hall_chandelier',
    assetId: 'hall04_chandelier_grand',
    x: AXIS_X,
    y: 640,
    scale: 0.52,
    anchorPreset: 'top-center',
    zone: 'great_hall',
    role: 'chandelier',
    depthClass: 'foreground-structure',
    disableCollision: true,
  });

  // 2. Symmetrical Massive Stone Columns (Top Row: y: 680, Bottom Row: y: 900)
  const [colTopL, colTopR] = placeMirroredPair(
    'hall_col_top',
    AXIS_X,
    160,
    680,
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
    900,
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

  // 3. Staircase Descent Framing Arches & Spandrels
  const [hallArchL, hallArchR] = placeMirroredPair(
    'hall_arch',
    AXIS_X,
    136,
    470,
    'arch_gothic_pointed_stone',
    'arch_gothic_pointed_stone',
    {
      zone: 'great_hall',
      role: 'arch',
      flipXRight: true,
      collisionProfile: 'none',
    }
  );
  placements.push(hallArchL, hallArchR);

  const [hallSpandrelL, hallSpandrelR] = placeMirroredPair(
    'hall_spandrel',
    AXIS_X,
    180,
    462,
    'arch_spandrel_left',
    'arch_spandrel_right',
    {
      zone: 'great_hall',
      role: 'spandrel',
    }
  );
  placements.push(hallSpandrelL, hallSpandrelR);

  // Bust niche centered above staircase arrival
  placements.push({
    id: 'hall_bust_niche',
    assetId: 'wall_niche_bust',
    x: AXIS_X,
    y: 466,
    anchorPreset: 'bottom-center',
    zone: 'great_hall',
    role: 'niche',
    depthClass: 'back-wall-detail',
  });

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

  // 5. Curated Fine Art: Celestial Chart & Battlefield on upper wall bays
  placements.push({
    id: 'hall_art_celestial',
    assetId: 'art07_paintings_04',
    x: AXIS_X - 120,
    y: 465,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'great_hall',
    role: 'art',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'hall_art_battlefield',
    assetId: 'art07_paintings_07',
    x: AXIS_X + 120,
    y: 465,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'great_hall',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // =========================================================================
  // ZONE 4: HERO DINING ROOM (Ground West: x: 48..448, y: 520..920)
  // Intimate, formal, romantic dinner for two. Clean isolated banquet table,
  // 2 high-backed chairs, Fear's chaise lounge along south-west wall, 2 windows.
  // =========================================================================
  // 1. Clean Hero Banquet Table centered on red carpet at x: 240, y: 720
  placements.push({
    id: 'dining_table',
    assetId: 'dining05_table_banquet_runner',
    x: 240,
    y: 720,
    scale: 0.72,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'banquet_table',
    depthClass: 'dynamic-solid',
    collisionProfile: 'dining_table_large',
  });

  // 2. Love's & Death's Captain Chairs
  placements.push({
    id: 'dining_chair_love',
    assetId: 'dining05_chair_tufted',
    x: 136,
    y: 710,
    scale: 0.44,
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
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'chair_death',
    depthClass: 'dynamic-solid',
    collisionProfile: 'dining_chair',
    flipX: true,
  });

  // 3. Single Candelabra Fixture on Dining Table runner
  placements.push({
    id: 'dining_candelabra',
    assetId: 'lounge06_candelabra_gold',
    x: 0,
    y: -26,
    scale: 0.55,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'candelabra',
    disableCollision: true,
  });

  // 4. Fear's Velvet Chaise Lounge (along south-west wall, completely out of transit corridor)
  placements.push({
    id: 'dining_couch_fear',
    assetId: 'lounge06_couch_loveseat',
    x: 110,
    y: 840,
    scale: 0.46,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'sofa_fear',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
  });

  // 5. North Wall Oak Wine Credenza
  placements.push({
    id: 'dining_sideboard',
    assetId: 'dining05_sideboard_oak',
    x: 240,
    y: 530,
    scale: 0.52,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'sideboard',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sideboard',
  });

  // 6. Curated Feast Still-Life Painting above Credenza
  placements.push({
    id: 'dining_art_feast',
    assetId: 'art07_paintings_08',
    x: 240,
    y: 440,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'dining_room',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 7. Paired Gothic Arched Windows with interior rain masks
  placements.push({
    id: 'dining_window_left',
    assetId: 'env02_window_gothic_tall',
    x: 105,
    y: 470,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'window',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'dining_window_right',
    assetId: 'env02_window_gothic_tall',
    x: 375,
    y: 470,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // North wall damask and gold stone panels
  placements.push({
    id: 'dining_damask_west',
    assetId: 'wall_panel_damask_crimson',
    x: 100,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'panel',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'dining_panel_center',
    assetId: 'wall_panel_stone_framed_gold',
    x: 240,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'panel',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'dining_damask_east',
    assetId: 'wall_panel_damask_crimson',
    x: 380,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'panel',
    depthClass: 'back-wall',
  });

  // Clean Entrance Portal: Corinthian columns framing open passage into Great Hall (x: 440)
  placements.push({
    id: 'dining_entry_col_top',
    assetId: 'column_wood_corinthian',
    x: 440,
    y: 580,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'column',
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
    role: 'column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });

  // =========================================================================
  // ZONE 5: LOUNGE & HEARTH (Ground East: x: 832..1232, y: 520..920)
  // Warm, lived-in, cohesive single fireplace composition. Zero scattered fires.
  // =========================================================================
  // 1. Hero Lit Stone Fireplace Hearth at x: 1040, y: 525
  placements.push({
    id: 'lounge_fireplace',
    assetId: 'lounge06_fireplace_stone',
    x: 1040,
    y: 525,
    scale: 0.85,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'fireplace',
    depthClass: 'dynamic-solid',
    collisionProfile: 'fireplace_hearth',
  });

  // 2. Firewood Basket beside hearth
  placements.push({
    id: 'lounge_firewood',
    assetId: 'lounge06_basket_firewood',
    x: 975,
    y: 535,
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'decor',
    depthClass: 'dynamic-solid',
    collisionProfile: 'none',
  });

  // 3. Ghost Ship Painting above Hearth Mantle
  placements.push({
    id: 'lounge_art_ship',
    assetId: 'lounge06_art_ship',
    x: 1040,
    y: 430,
    scale: 0.44,
    anchorPreset: 'center',
    zone: 'lounge',
    role: 'art',
    depthClass: 'back-wall-detail',
  });

  // 4. Plush 3-Seater Velvet Sofa facing the Hearth
  placements.push({
    id: 'lounge_sofa',
    assetId: 'lounge06_sofa_ornate',
    x: 1040,
    y: 740,
    scale: 0.52,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'sofa',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
  });

  // 5. Low Wood Coffee Table with candelabra & book
  placements.push({
    id: 'lounge_coffee_table',
    assetId: 'lounge06_coffee_table_wood',
    x: 1040,
    y: 665,
    scale: 0.46,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'coffee_table',
    depthClass: 'dynamic-solid',
    collisionProfile: 'coffee_table',
  });

  // 6. Fireside Velvet Armchair
  placements.push({
    id: 'lounge_armchair',
    assetId: 'lounge06_armchair_velvet',
    x: 920,
    y: 690,
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'armchair',
    depthClass: 'dynamic-solid',
    collisionProfile: 'armchair',
  });

  // 7. Tall Leather-Bound Bookshelf with Globe
  placements.push({
    id: 'lounge_bookshelf',
    assetId: 'lounge06_bookshelf_tall',
    x: 890,
    y: 530,
    scale: 0.52,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'bookshelf',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bookshelf',
  });

  // 8. Vintage Retro Television Console
  placements.push({
    id: 'lounge_tv',
    assetId: 'lounge06_tv_retro',
    x: 1190,
    y: 690,
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'tv',
    depthClass: 'dynamic-solid',
    collisionProfile: 'tv_console',
  });

  // 9. Visible Gothic Arched Window with interior rain mask
  placements.push({
    id: 'lounge_window',
    assetId: 'env02_window_gothic_tall',
    x: 1180,
    y: 470,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // North wall dark damask panels
  placements.push({
    id: 'lounge_damask_west',
    assetId: 'wall_panel_damask_crimson',
    x: 890,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'panel',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'lounge_damask_east',
    assetId: 'wall_panel_damask_crimson',
    x: 1180,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'panel',
    depthClass: 'back-wall',
  });

  // Clean Entrance Portal: Wood columns framing open passage into Great Hall (x: 840)
  placements.push({
    id: 'lounge_entry_col_top',
    assetId: 'column_wood_gold_trim',
    x: 840,
    y: 580,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'column',
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
    role: 'column',
    depthClass: 'dynamic-solid',
    collisionProfile: 'column_wood',
  });

  return placements;
}
