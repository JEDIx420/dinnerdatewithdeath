import Phaser from 'phaser';

export const MANSION_PACK_IDS = [
  'ddwd_env_02',
  'ddwd_env_03',
  'ddwd_env_04',
  'ddwd_env_05',
  'ddwd_env_06',
  'ddwd_env_07',
  'ddwd_env_08',
] as const;

export const CEMETERY_PACK_IDS = [
  'ddwd_env_11',
] as const;

export type MansionPackId = (typeof MANSION_PACK_IDS)[number];
export type CemeteryPackId = (typeof CEMETERY_PACK_IDS)[number];
export type EnvironmentPackId = MansionPackId | CemeteryPackId;

/**
 * Preloads a single texture atlas pack.
 */
export function preloadEnvironmentPack(scene: Phaser.Scene, packId: EnvironmentPackId): void {
  if (scene.textures.exists(packId)) return;

  const envFolder = packId.startsWith('ddwd_env_11') ? 'cemetery' : 'mansion';
  const pngPath = `game-assets/environment/${envFolder}/packs/${packId}.png`;
  const jsonPath = `game-assets/environment/${envFolder}/packs/${packId}.json`;

  scene.load.atlas(packId, pngPath, jsonPath);
}

/**
 * Preloads all environment packs required for Death's Grand Mansion.
 * Excludes cemetery pack.
 */
export function preloadMansionPacks(scene: Phaser.Scene): void {
  for (const packId of MANSION_PACK_IDS) {
    preloadEnvironmentPack(scene, packId);
  }
}
