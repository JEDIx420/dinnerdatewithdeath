import Phaser from 'phaser';
import { phaserGameConfig } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { TitleScene } from './game/scenes/TitleScene';
import { PrototypeScene } from './game/scenes/PrototypeScene';

const config: Phaser.Types.Core.GameConfig = {
  ...phaserGameConfig,
  scene: [BootScene, TitleScene, PrototypeScene],
};

window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(config);
});
