import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { DEATH_MANIFEST } from '../entities/deathManifest';
import { Direction } from '../entities/CharacterManifest';

export class AssetLabScene extends Phaser.Scene {
  private currentDirectionIndex: number = 0;
  private readonly directions: Direction[] = ['down', 'left', 'right', 'up'];
  private isWalking: boolean = false;
  private showGuides: boolean = true;

  private previewSprite!: Phaser.GameObjects.Sprite;
  private guidesGraphics!: Phaser.GameObjects.Graphics;
  private infoText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'AssetLabScene' });
  }

  public create(): void {
    const cx = GAME_CONFIG.WIDTH / 2;
    const cy = GAME_CONFIG.HEIGHT / 2 - 20;

    // Dark neutral background
    const bg = this.add.graphics();
    bg.fillStyle(0x14141c, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Title / Header
    this.add
      .text(cx, 28, '— ASSET LAB (DEVELOPER QA) —', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#b0a4c8',
      })
      .setOrigin(0.5);

    // Visual Guides (128x128 box & red baseline at Y=112)
    this.guidesGraphics = this.add.graphics();
    this.drawGuides(cx, cy);

    // Character Sprite
    const initialDir = this.directions[this.currentDirectionIndex]!;
    this.previewSprite = this.add.sprite(
      cx,
      cy,
      DEATH_MANIFEST.textureKey,
      DEATH_MANIFEST.animations[`walk_${initialDir}`].idleFrame
    );
    this.previewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Info overlay text
    this.infoText = this.add.text(24, GAME_CONFIG.HEIGHT - 110, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#dcd4ec',
      lineSpacing: 4,
    });

    // Instructions
    this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT - 16,
        '[Arrows] Direction | [Space] Walk/Idle | [G] Guides | [Esc] Return to Title',
        {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#7a7288',
        }
      )
      .setOrigin(0.5);

    // Keyboard inputs
    this.input.keyboard?.on('keydown-LEFT', () => {
      this.cycleDirection(-1);
    });

    this.input.keyboard?.on('keydown-RIGHT', () => {
      this.cycleDirection(1);
    });

    this.input.keyboard?.on('keydown-UP', () => {
      this.setDirection('up');
    });

    this.input.keyboard?.on('keydown-DOWN', () => {
      this.setDirection('down');
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.toggleAnimation();
    });

    this.input.keyboard?.on('keydown-G', () => {
      this.showGuides = !this.showGuides;
      this.guidesGraphics.setVisible(this.showGuides);
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });

    this.updateDisplay();
  }

  public update(): void {
    const dir = this.directions[this.currentDirectionIndex]!;
    const animState = this.isWalking ? 'WALK (Looping)' : 'IDLE';
    const currentFrame = this.previewSprite.frame?.name ?? '0';

    this.infoText.setText([
      `Character: ${DEATH_MANIFEST.displayName} (${DEATH_MANIFEST.id})`,
      `Direction: ${dir.toUpperCase()} (Index ${this.currentDirectionIndex})`,
      `State:     ${animState}`,
      `Cell:      ${DEATH_MANIFEST.frameWidth} × ${DEATH_MANIFEST.frameHeight} px (Foot Baseline Y=${DEATH_MANIFEST.footBaseline}, Frame #${currentFrame})`,
      `Filter:    NEAREST`,
    ]);
  }

  private cycleDirection(delta: number): void {
    this.currentDirectionIndex =
      (this.currentDirectionIndex + delta + this.directions.length) % this.directions.length;
    this.applyDirection();
  }

  private setDirection(dir: Direction): void {
    const idx = this.directions.indexOf(dir);
    if (idx !== -1) {
      this.currentDirectionIndex = idx;
      this.applyDirection();
    }
  }

  private toggleAnimation(): void {
    this.isWalking = !this.isWalking;
    this.applyDirection();
  }

  private applyDirection(): void {
    const dir = this.directions[this.currentDirectionIndex]!;
    const animKey = `${DEATH_MANIFEST.id}_walk_${dir}`;

    if (this.isWalking) {
      this.previewSprite.play(animKey, true);
    } else {
      this.previewSprite.anims.stop();
      this.previewSprite.setFrame(DEATH_MANIFEST.animations[`walk_${dir}`].idleFrame);
    }
  }

  private drawGuides(cx: number, cy: number): void {
    this.guidesGraphics.clear();
    const halfCell = DEATH_MANIFEST.frameWidth / 2; // 64

    // 128x128 bounding box in subtle cyan
    this.guidesGraphics.lineStyle(1, 0x3d85a8, 0.65);
    this.guidesGraphics.strokeRect(
      cx - halfCell,
      cy - halfCell,
      DEATH_MANIFEST.frameWidth,
      DEATH_MANIFEST.frameHeight
    );

    // Red foot baseline (Y=112 in cell: cy - 64 + 112 = cy + 48)
    const baselineY = cy - halfCell + DEATH_MANIFEST.footBaseline;
    this.guidesGraphics.lineStyle(1, 0xd43d48, 0.85);
    this.guidesGraphics.lineBetween(
      cx - halfCell,
      baselineY,
      cx + halfCell,
      baselineY
    );
  }

  private updateDisplay(): void {
    this.applyDirection();
  }
}
