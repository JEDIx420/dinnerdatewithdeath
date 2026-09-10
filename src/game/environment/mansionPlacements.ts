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
  // Proper visible window on north wall bay with rain outside glass.
  // =========================================================================
  // 1. Visible Gothic Arched Window on North-West wall bay (y: 155 aligns window top nicely on north wall)
  placements.push({
    id: 'bedchamber_window',
    assetId: 'env02_window_gothic_tall',
    x: 95,
    y: 155,
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
    x: 90,
    y: 235,
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
    x: 180,
    y: 126,
    scale: 0.45,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'wardrobe',
    depthClass: 'dynamic-solid',
    collisionProfile: 'wardrobe_large',
  });

  // 4. Dressing Vanity with antique mirror (clean wall, no extra frame/panel behind it)
  placements.push({
    id: 'bedchamber_vanity',
    assetId: 'bed03_vanity_ornate',
    x: 330,
    y: 126,
    scale: 0.45,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'vanity',
    depthClass: 'dynamic-solid',
    collisionProfile: 'vanity',
  });

  // 5. Hero Grand Gothic Four-Poster Bed (anchored at x: 180, y: 270, pristine floor around it)
  placements.push({
    id: 'bedchamber_bed',
    assetId: 'bed03_bed_grand_gothic',
    x: 180,
    y: 270,
    scale: 0.46,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'bed',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bed_large',
  });

  // Bedside Nightstand on left side of bed (leaving right-side spawn completely clear)
  placements.push({
    id: 'bedchamber_nightstand',
    assetId: 'bed03_bedside_cabinet',
    x: 118,
    y: 260,
    scale: 0.40,
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
    scale: 0.30,
    parentPlacementId: 'bedchamber_nightstand',
    zone: 'bedchamber',
    role: 'candle',
    disableCollision: true,
  });

  // North wall wainscot panel (East bay only, leaving window bay on raw stone wall)
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
  // Ceremonial, open, elegant. Symmetrical and uncluttered.
  // Balanced architectural statuary flanking staircase balustrade.
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
  // Hero chandelier overhead at y: 480 with exact candle-wick lights.
  // Monumental statues flanking columns in outer gallery.
  // =========================================================================
  // 1. Singular Grand Chandelier lifted overhead at x: 640, y: 480 (revealing floor medallion)
  placements.push({
    id: 'hall_chandelier',
    assetId: 'hall04_chandelier_grand',
    x: AXIS_X,
    y: 480,
    scale: 0.46,
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

  // 3. Terminal Staircase Arrival Newels at y: 552 (Framing stair opening, no clutter)
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

  // Symmetrical Standing Statues in outer gallery corners beside lower massive columns
  const [hallStatueL, hallStatueR] = placeMirroredPair(
    'hall_statue_lower',
    AXIS_X,
    160,
    800,
    'clutter08_statues_02',
    'clutter08_statues_02',
    {
      zone: 'great_hall',
      role: 'statue',
      scale: 0.42,
      flipXRight: true,
      collisionProfile: 'statue_base',
    }
  );
  placements.push(hallStatueL, hallStatueR);

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

  // 2. Love's & Death's Captain Chairs (properly facing the table)
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
    flipX: true, // Faces RIGHT toward the table
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
    flipX: false, // Faces LEFT toward the table
  });

  // 3. Table Setting: Center Candelabra, individual porcelain plate settings with cutlery, and goblets
  placements.push({
    id: 'dining_candelabra',
    assetId: 'lounge06_candelabra_gold',
    x: 0,
    y: -26,
    scale: 0.52,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'candelabra',
    disableCollision: true,
  });
  placements.push({
    id: 'dining_setting_love',
    assetId: 'dining05_tableware_65',
    x: -55,
    y: -28,
    scale: 0.48,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'tableware',
    disableCollision: true,
  });
  placements.push({
    id: 'dining_setting_death',
    assetId: 'dining05_tableware_68',
    x: 55,
    y: -28,
    scale: 0.48,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'tableware',
    disableCollision: true,
  });
  placements.push({
    id: 'dining_goblet_love',
    assetId: 'dining05_tableware_69',
    x: -38,
    y: -34,
    scale: 0.60,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'tableware',
    disableCollision: true,
  });
  placements.push({
    id: 'dining_goblet_death',
    assetId: 'dining05_tableware_69',
    x: 38,
    y: -34,
    scale: 0.60,
    parentPlacementId: 'dining_table',
    zone: 'dining_room',
    role: 'tableware',
    disableCollision: true,
  });

  // 4. Fear's Velvet Chaise Lounge: Scaled up to match table/chairs (0.58) and rotated facing table
  placements.push({
    id: 'dining_couch_fear',
    assetId: 'lounge06_couch_loveseat',
    x: 120,
    y: 840,
    scale: 0.58,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'sofa_fear',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
    angle: -90, // Rotated 90 deg counter-clockwise so seat faces up/toward the table
  });

  // 5. North Wall Oak Wine Credenza (clean centered sideboard)
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

  // 6. Paired Gothic Arched Windows with interior rain masks on North Wall (y: 550)
  placements.push({
    id: 'dining_window_left',
    assetId: 'env02_window_gothic_tall',
    x: 105,
    y: 550,
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
    y: 550,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'window',
    depthClass: 'back-wall-detail',
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
  // Warm, lived-in, cohesive hearth composition.
  // Recomposed: Enlarged coffee table, enlarged TV on right facing seating,
  // single armchair opposite TV, sofas framing table, visible window.
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

  // 4. Tall Leather-Bound Bookshelf with Globe on West wall bay
  placements.push({
    id: 'lounge_bookshelf',
    assetId: 'lounge06_bookshelf_tall',
    x: 885,
    y: 525,
    scale: 0.50,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'bookshelf',
    depthClass: 'dynamic-solid',
    collisionProfile: 'bookshelf',
  });

  // 5. Visible Gothic Arched Window on North Wall bay (y: 550)
  placements.push({
    id: 'lounge_window',
    assetId: 'env02_window_gothic_tall',
    x: 1180,
    y: 550,
    scale: 0.65,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'window',
    depthClass: 'back-wall-detail',
  });

  // 6. Larger Centered Coffee Table with candelabra & book (scale: 0.60)
  placements.push({
    id: 'lounge_coffee_table',
    assetId: 'lounge06_coffee_table_wood',
    x: 1040,
    y: 720,
    scale: 0.60,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'coffee_table',
    depthClass: 'dynamic-solid',
    collisionProfile: 'coffee_table',
  });

  // 7. Framing Sofas: North Sofa & South Sofa (or West & East)
  // Two sofas on either side of the table framing the seating area cleanly
  placements.push({
    id: 'lounge_sofa',
    assetId: 'lounge06_sofa_ornate',
    x: 1040,
    y: 650,
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'sofa',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
  });
  placements.push({
    id: 'lounge_sofa_south',
    assetId: 'lounge06_sofa_ornate',
    x: 1040,
    y: 795,
    scale: 0.44,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'sofa',
    depthClass: 'dynamic-solid',
    collisionProfile: 'sofa',
  });

  // 8. Single Armchair opposite the TV (West side of table, facing TV/table)
  placements.push({
    id: 'lounge_armchair',
    assetId: 'lounge06_armchair_velvet',
    x: 915,
    y: 720,
    scale: 0.48,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'armchair',
    depthClass: 'dynamic-solid',
    collisionProfile: 'armchair',
    flipX: true, // Faces right toward table and TV
  });

  // 9. Larger Retro TV Console on the RIGHT side, facing the seating/table zone
  placements.push({
    id: 'lounge_tv',
    assetId: 'lounge06_tv_retro',
    x: 1165,
    y: 720,
    scale: 0.56,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'tv',
    depthClass: 'dynamic-solid',
    collisionProfile: 'tv_console',
    flipX: true, // Faces left toward the seating area
  });

  // 10. Restrained Architectural Statuary: Classical statue in South-East corner
  placements.push({
    id: 'lounge_statue_corner',
    assetId: 'clutter08_statues_02',
    x: 1180,
    y: 860,
    scale: 0.46,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'statue',
    depthClass: 'dynamic-solid',
    collisionProfile: 'statue_base',
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

