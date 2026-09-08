/**
 * Pure game configuration constants independent of Phaser runtime.
 * Upgraded in v0.0.5 to 768x432 (exact 2x of 384x216, maintaining 16:9).
 */
export const GAME_CONFIG = {
  // Logical virtual resolution (16:9 ratio)
  WIDTH: 768,
  HEIGHT: 432,
  TILE_SIZE: 32,
  CHARACTER_CELL_SIZE: 128,
  CHARACTER_FOOT_BASELINE: 112,
  BACKGROUND_COLOR: '#0a0a0f',
} as const;
