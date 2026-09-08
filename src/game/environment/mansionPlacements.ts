import { EnvironmentPlacement } from './EnvironmentPlacement';
import { placeMirroredPair } from './SymmetryHelpers';

/**
 * Authoritative production environment placements for Death's Grand Mansion.
 * Grounded on the 640px central symmetry axis with baseline anchor coordinates.
 */
export function buildMansionPlacements(): EnvironmentPlacement[] {
  const placements: EnvironmentPlacement[] = [];

  const AXIS_X = 640;

  // =========================================================================
  // ZONE 1: DEATH'S BEDCHAMBER (Upper West: x: 48..448, y: 72..320)
  // Mirror at x: 200, y: 84. Wainscots, cornices, doorway pillars.
  // =========================================================================
  // Mirror framing cornice (above mirror)
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

  // Mirror flanking columns (ground baseline at y: 130)
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
      collisionProfile: 'none', // Behind vanity/mirror, decorative
    }
  );
  placements.push(mirrorColL, mirrorColR);

  // North wall panel fields
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

  // Bedchamber Upper Cornices along ceiling
  placements.push({
    id: 'bedchamber_cornice_west',
    assetId: 'trim_cornice_wood_b',
    x: 100,
    y: 24,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'cornice',
    depthClass: 'back-wall-detail',
  });
  placements.push({
    id: 'bedchamber_cornice_east',
    assetId: 'trim_cornice_wood_b',
    x: 370,
    y: 24,
    anchorPreset: 'bottom-center',
    zone: 'bedchamber',
    role: 'cornice',
    depthClass: 'back-wall-detail',
  });

  // Bedchamber Doorway to Landing (Doorway span y: 128..248, center y: 188)
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
  // ZONE 2: UPPER LANDING & BALUSTRADE (Upper East: x: 448..832, y: 72..288)
  // Ceremonial runner along y: 160..216. Symmetrical balustrade at y: 268.
  // =========================================================================
  // North Wall Decorative Paneling (mirrored around 640)
  const [landingPanelL, landingPanelR] = placeMirroredPair(
    'landing_panel',
    AXIS_X,
    110,
    84,
    'wall_panel_fleur_ornate',
    'wall_panel_fleur_ornate',
    {
      zone: 'upper_landing',
      role: 'panel',
    }
  );
  placements.push(landingPanelL, landingPanelR);

  // North wall cornices (mirrored around 640)
  const [landingCorniceL, landingCorniceR] = placeMirroredPair(
    'landing_cornice',
    AXIS_X,
    100,
    24,
    'trim_cornice_studded',
    'trim_cornice_studded',
    {
      zone: 'upper_landing',
      role: 'cornice',
    }
  );
  placements.push(landingCorniceL, landingCorniceR);

  // Upper Landing Balustrade Overlook flanking staircase mouth (mouth: 560..720)
  // Left balustrade span: 448..560. Right balustrade span: 720..832.
  // Place continuous visual balustrade sections
  const [balustradeL, balustradeR] = placeMirroredPair(
    'landing_balustrade',
    AXIS_X,
    136, // center at 504 and 776
    268,
    'balustrade_section',
    'balustrade_section',
    {
      zone: 'upper_landing',
      role: 'balustrade',
      flipXRight: true,
      collisionProfile: 'balustrade_span_wide', // Continuous physical barrier
    }
  );
  placements.push(balustradeL, balustradeR);

  // Newel Posts terminating the balustrade overlook:
  // Inner hero newels at the staircase mouth (x: 556 and x: 724)
  const [mouthNewelL, mouthNewelR] = placeMirroredPair(
    'landing_mouth_newel',
    AXIS_X,
    84, // 640 - 84 = 556, 640 + 84 = 724
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

  // Outer terminal balustrade posts at wall junctions (x: 448 and x: 832)
  const [wallNewelL, wallNewelR] = placeMirroredPair(
    'landing_wall_newel',
    AXIS_X,
    192, // 640 - 192 = 448, 640 + 192 = 832
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

  // =========================================================================
  // ZONE 3: GREAT HALL / CENTRAL GALLERY (Ground Center: x: 448..832, y: 520..920)
  // Symmetrical massive columns, staircase descent framing arches, bust niche.
  // =========================================================================
  // Pointed Gothic Arches flanking staircase descent (x: 504 and x: 776, y: 470)
  const [hallArchL, hallArchR] = placeMirroredPair(
    'hall_arch',
    AXIS_X,
    136, // 640 - 136 = 504, 640 + 136 = 776
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

  // Spandrels flanking arches
  const [hallSpandrelL, hallSpandrelR] = placeMirroredPair(
    'hall_spandrel',
    AXIS_X,
    180, // 460 and 820
    462,
    'arch_spandrel_left',
    'arch_spandrel_right',
    {
      zone: 'great_hall',
      role: 'spandrel',
    }
  );
  placements.push(hallSpandrelL, hallSpandrelR);

  // Center North Wall Bust Niche on axis above staircase arrival
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

  // Great Hall Paired Hero Columns (Top Row: y: 640, Bottom Row: y: 880)
  // With anchorPreset = 'bottom-center', the base sits firmly on the marble floor!
  const [colTopL, colTopR] = placeMirroredPair(
    'hall_col_top',
    AXIS_X,
    160, // 640 - 160 = 480, 640 + 160 = 800
    640, // Base resting on floor
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
    160, // 640 - 160 = 480, 640 + 160 = 800
    890, // Base resting on floor
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

  // Staircase bottom terminal newel posts (x: 556 and x: 724, arrival at y: 552)
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

  // =========================================================================
  // ZONE 4: DINING ROOM (Ground West: x: 48..448, y: 520..920)
  // Rich crimson panels, Corinthian entrance columns, carved crest.
  // =========================================================================
  // North Wall Damask Panels
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
    x: 250,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'panel',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'dining_damask_east',
    assetId: 'wall_panel_damask_crimson',
    x: 400,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'panel',
    depthClass: 'back-wall',
  });

  // Entrance portal pillars from Great Hall into Dining Room (x: 440)
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

  // Escutcheon crest above sideboard
  placements.push({
    id: 'dining_crest',
    assetId: 'ornament_foliage_crest_b',
    x: 240,
    y: 450,
    anchorPreset: 'bottom-center',
    zone: 'dining_room',
    role: 'ornament',
    depthClass: 'back-wall-detail',
  });

  // =========================================================================
  // ZONE 5: LOUNGE & HEARTH (Ground East: x: 832..1232, y: 520..920)
  // Hearth niche, oak wainscots, Great Hall entrance columns.
  // =========================================================================
  // Fireplace niche backing
  placements.push({
    id: 'lounge_hearth_niche',
    assetId: 'wall_niche_empty',
    x: 1040,
    y: 510,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'niche',
    depthClass: 'back-wall-detail',
  });

  // North wall horizontal oak panels
  placements.push({
    id: 'lounge_wood_panel_west',
    assetId: 'wall_panel_wood_horizontal',
    x: 880,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'panel',
    depthClass: 'back-wall',
  });
  placements.push({
    id: 'lounge_wood_panel_east',
    assetId: 'wall_panel_wood_horizontal',
    x: 1200,
    y: 520,
    anchorPreset: 'bottom-center',
    zone: 'lounge',
    role: 'panel',
    depthClass: 'back-wall',
  });

  // Entrance portal pillars from Great Hall into Lounge (x: 840)
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
