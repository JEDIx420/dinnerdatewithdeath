export type Direction = 'down' | 'left' | 'right' | 'up';

export interface DirectionAnimationDef {
  frames: number[];
  idleFrame: number;
}

export interface CharacterManifest {
  id: string;
  displayName: string;
  textureKey: string;
  texturePath: string;
  frameWidth: number;
  frameHeight: number;
  frameRate: number;
  footBaseline: number;
  animations: {
    walk_down: DirectionAnimationDef;
    walk_left: DirectionAnimationDef;
    walk_right: DirectionAnimationDef;
    walk_up: DirectionAnimationDef;
  };
}
