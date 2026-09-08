import Phaser from 'phaser';
import { phaserGameConfig } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { TitleScene } from './game/scenes/TitleScene';
import { MansionScene } from './game/scenes/MansionScene';
import { AssetLabScene } from './game/scenes/AssetLabScene';

const config: Phaser.Types.Core.GameConfig = {
  ...phaserGameConfig,
  scene: [BootScene, TitleScene, MansionScene, AssetLabScene],
};

window.addEventListener('DOMContentLoaded', () => {
  (window as unknown as { __PHASER_GAME__: Phaser.Game }).__PHASER_GAME__ = new Phaser.Game(config);
});
