import { ArchitecturalSpriteDef } from './RoomDefinition';

/**
 * Production Mansion Architecture Placements for Death's Grand Residence.
 * Placed purposefully across all 5 story-driven zones using the extracted production assets.
 */
export const MANSION_ARCHITECTURE_ELEMENTS: ArchitecturalSpriteDef[] = [
  // =========================================================================
  // ZONE 1: DEATH'S BEDCHAMBER (Upper West: x: 48..448, y: 72..320)
  // Intimate private quarters where Death awakens facing his grand ornate mirror.
  // =========================================================================

  // Bedchamber North Wall Wainscoting & Trims
  {
    id: 'arch_bedchamber_wainscot_1',
    textureKey: 'wall_panel_wood_wainscot_a',
    x: 96,
    y: 76,
    zone: 'bedchamber',
    role: 'wainscot',
    depthOffset: -130,
  },
  {
    id: 'arch_bedchamber_wainscot_2',
    textureKey: 'wall_panel_wood_wainscot_b',
    x: 376,
    y: 76,
    zone: 'bedchamber',
    role: 'wainscot',
    depthOffset: -130,
  },
  // Bedchamber Upper Cornices
  {
    id: 'arch_bedchamber_cornice_west',
    textureKey: 'trim_cornice_wood_b',
    x: 100,
    y: 24,
    zone: 'bedchamber',
    role: 'cornice',
    depthOffset: -140,
  },
  {
    id: 'arch_bedchamber_cornice_east',
    textureKey: 'trim_cornice_wood_b',
    x: 370,
    y: 24,
    zone: 'bedchamber',
    role: 'cornice',
    depthOffset: -140,
  },
  // Bedchamber Doorway to Landing (x: 440, doorway y: 128..248)
  {
    id: 'arch_bedchamber_door_col_top',
    textureKey: 'half_column_wood_gold',
    x: 440,
    y: 128,
    zone: 'bedchamber',
    role: 'doorway',
    depthOffset: -40,
    collision: { width: 24, height: 20, offsetY: 10 },
  },
  {
    id: 'arch_bedchamber_door_col_bottom',
    textureKey: 'half_column_wood_gold',
    x: 440,
    y: 248,
    zone: 'bedchamber',
    role: 'doorway',
    depthOffset: 20,
    collision: { width: 24, height: 20, offsetY: 10 },
  },

  // Upper Cornice run
  {
    id: 'arch_landing_cornice_left',
    textureKey: 'trim_cornice_studded',
    x: 540,
    y: 24,
    zone: 'upper_landing',
    role: 'cornice',
    depthOffset: -140,
  },
  {
    id: 'arch_landing_cornice_right',
    textureKey: 'trim_cornice_studded',
    x: 740,
    y: 24,
    zone: 'upper_landing',
    role: 'cornice',
    depthOffset: -140,
  },
  // Horizontal moulding running along the corridor
  {
    id: 'arch_landing_moulding_left',
    textureKey: 'trim_moulding_horizontal',
    x: 520,
    y: 78,
    zone: 'upper_landing',
    role: 'trim',
    depthOffset: -125,
  },
  {
    id: 'arch_landing_moulding_right',
    textureKey: 'trim_moulding_horizontal',
    x: 760,
    y: 78,
    zone: 'upper_landing',
    role: 'trim',
    depthOffset: -125,
  },
  // Balustrade Overlook sections flanking staircase (South edge of landing: y: 268)
  {
    id: 'arch_balustrade_overlook_l1',
    textureKey: 'balustrade_section',
    x: 480,
    y: 268,
    zone: 'upper_landing',
    role: 'balustrade',
    depthOffset: 16,
  },
  {
    id: 'arch_balustrade_overlook_l2',
    textureKey: 'balustrade_section',
    x: 528,
    y: 268,
    zone: 'upper_landing',
    role: 'balustrade',
    depthOffset: 16,
  },
  {
    id: 'arch_balustrade_overlook_r1',
    textureKey: 'balustrade_section',
    x: 752,
    y: 268,
    zone: 'upper_landing',
    role: 'balustrade',
    depthOffset: 16,
  },
  {
    id: 'arch_balustrade_overlook_r2',
    textureKey: 'balustrade_section',
    x: 800,
    y: 268,
    zone: 'upper_landing',
    role: 'balustrade',
    depthOffset: 16,
  },
  // Newel Posts terminating the balustrade overlook
  {
    id: 'arch_newel_overlook_l_far',
    textureKey: 'balustrade_post',
    x: 448,
    y: 268,
    zone: 'upper_landing',
    role: 'newel',
    depthOffset: 18,
  },
  {
    id: 'arch_newel_overlook_l_near',
    textureKey: 'newel_post_large',
    x: 556,
    y: 268,
    zone: 'upper_landing',
    role: 'newel',
    depthOffset: 18,
  },
  {
    id: 'arch_newel_overlook_r_near',
    textureKey: 'newel_post_large',
    x: 724,
    y: 268,
    zone: 'upper_landing',
    role: 'newel',
    depthOffset: 18,
  },
  {
    id: 'arch_newel_overlook_r_far',
    textureKey: 'balustrade_post',
    x: 832,
    y: 268,
    zone: 'upper_landing',
    role: 'newel',
    depthOffset: 18,
  },

  // =========================================================================
  // ZONE 3: GREAT HALL / CENTRAL GALLERY (Ground Center: x: 448..832, y: 520..920)
  // Grand reception area with stone columns, pointed arches, and bust niche.
  // =========================================================================

  // Classical Stone Columns supporting the hall ceiling
  {
    id: 'arch_hall_col_left_top',
    textureKey: 'column_stone_massive',
    x: 480,
    y: 560,
    zone: 'great_hall',
    role: 'column',
    depthOffset: 10,
    collision: { width: 24, height: 16, offsetY: 24 },
  },
  {
    id: 'arch_hall_col_right_top',
    textureKey: 'column_stone_massive',
    x: 800,
    y: 560,
    zone: 'great_hall',
    role: 'column',
    depthOffset: 10,
    collision: { width: 24, height: 16, offsetY: 24 },
  },
  {
    id: 'arch_hall_col_left_bottom',
    textureKey: 'column_stone_massive',
    x: 480,
    y: 840,
    zone: 'great_hall',
    role: 'column',
    depthOffset: 10,
    collision: { width: 24, height: 16, offsetY: 24 },
  },
  {
    id: 'arch_hall_col_right_bottom',
    textureKey: 'column_stone_massive',
    x: 800,
    y: 840,
    zone: 'great_hall',
    role: 'column',
    depthOffset: 10,
    collision: { width: 24, height: 16, offsetY: 24 },
  },

  // Fluted Wood / Corinthian Columns at Dining entrance archway
  {
    id: 'arch_dining_col_entry_top',
    textureKey: 'column_wood_corinthian',
    x: 440,
    y: 544,
    zone: 'dining_room',
    role: 'column',
    depthOffset: 12,
    collision: { width: 20, height: 16, offsetY: 24 },
  },
  {
    id: 'arch_dining_col_entry_bottom',
    textureKey: 'column_wood_corinthian',
    x: 440,
    y: 864,
    zone: 'dining_room',
    role: 'column',
    depthOffset: 12,
    collision: { width: 20, height: 16, offsetY: 24 },
  },
  // Carved escutcheon / foliage crest ornament above dining sideboard
  {
    id: 'arch_dining_crest',
    textureKey: 'ornament_foliage_crest_b',
    x: 240,
    y: 450,
    zone: 'dining_room',
    role: 'ornament',
    depthOffset: -130,
  },

  // =========================================================================
  // ZONE 5: LOUNGE & HEARTH (Ground East: x: 832..1232, y: 520..920)
  // Warm library lounge with glowing hearth and oak wainscot.
  // =========================================================================
  // Hearth Niche Recess Backing (Fireplace at x: 1040, y: 520)
  {
    id: 'arch_hearth_niche_recess',
    textureKey: 'wall_niche_empty',
    x: 1040,
    y: 486,
    zone: 'lounge',
    role: 'fireplace',
    depthOffset: -135,
  },
  // Grotesque / Shield Corbel Brackets supporting the heavy stone mantel
  {
    id: 'arch_hearth_corbel_left',
    textureKey: 'corbel_shield_fleur',
    x: 994,
    y: 480,
    zone: 'lounge',
    role: 'corbel',
    depthOffset: -120,
  },
  {
    id: 'arch_hearth_corbel_right',
    textureKey: 'corbel_shield_fleur',
    x: 1086,
    y: 480,
    zone: 'lounge',
    role: 'corbel',
    depthOffset: -120,
  },
  // Inset Wood Gold section on east lounge wall
  {
    id: 'arch_lounge_panel_inset',
    textureKey: 'panel_inset_wood_gold',
    x: 900,
    y: 472,
    zone: 'lounge',
    role: 'bookcase',
    depthOffset: -130,
  },
  // Fluted Stone / Gold Columns at Lounge entrance archway
  {
    id: 'arch_lounge_col_entry_top',
    textureKey: 'column_stone_fluted',
    x: 824,
    y: 544,
    zone: 'lounge',
    role: 'column',
    depthOffset: 12,
    collision: { width: 20, height: 16, offsetY: 24 },
  },
  {
    id: 'arch_lounge_col_entry_bottom',
    textureKey: 'column_stone_fluted',
    x: 824,
    y: 864,
    zone: 'lounge',
    role: 'column',
    depthOffset: 12,
    collision: { width: 20, height: 16, offsetY: 24 },
  },
  // Foliage Corbels along lounge cornice
  {
    id: 'arch_lounge_corbel_1',
    textureKey: 'corbel_ornate_foliage',
    x: 960,
    y: 440,
    zone: 'lounge',
    role: 'corbel',
    depthOffset: -140,
  },
  {
    id: 'arch_lounge_corbel_2',
    textureKey: 'corbel_ornate_foliage',
    x: 1120,
    y: 440,
    zone: 'lounge',
    role: 'corbel',
    depthOffset: -140,
  },
  // Medallion Rosette Ornament in Lounge
  {
    id: 'arch_lounge_rosette',
    textureKey: 'ornament_medallion_rosette_large',
    x: 1040,
    y: 440,
    zone: 'lounge',
    role: 'ornament',
    depthOffset: -138,
  },
];
