import Phaser from 'phaser';

/**
 * Central configuration for the game's logical viewport and rendering.
 * All resolutions and scaling rules are centralized here.
 */
export const GAME_CONFIG = {
  // Logical pixel-art virtual resolution (16:9 ratio)
  WIDTH: 384,
  HEIGHT: 216,
  TILE_SIZE: 16,
  BACKGROUND_COLOR: '#0a0a0f',
} as const;

export const phaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
};
