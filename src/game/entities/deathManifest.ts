import { CharacterManifest } from './CharacterManifest';

export const DEATH_MANIFEST: CharacterManifest = {
  id: 'death',
  displayName: 'Death',
  textureKey: 'death_walk',
  texturePath: 'game-assets/characters/death/overworld/walk.png',
  frameWidth: 128,
  frameHeight: 128,
  frameRate: 6,
  footBaseline: 112,
  animations: {
    walk_down: {
      frames: [0, 1, 2, 3],
      idleFrame: 3,
    },
    walk_left: {
      frames: [4, 5, 6, 7],
      idleFrame: 7,
    },
    walk_right: {
      frames: [8, 9, 10, 11],
      idleFrame: 11,
    },
    walk_up: {
      frames: [12, 13, 14, 15],
      idleFrame: 15,
    },
  },
};
