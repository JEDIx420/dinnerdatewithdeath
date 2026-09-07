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
    const cy = GAME_CONFIG.HEIGHT / 2 - 10;

    // Dark neutral background
    const bg = this.add.graphics();
    bg.fillStyle(0x14141c, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Title / Header
    this.add.text(cx, 14, '— ASSET LAB (DEV QA) —', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#a094b8',
    }).setOrigin(0.5);

    // Visual Guides (64x64 box & red baseline)
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

    // Info overlay text
    this.infoText = this.add.text(12, GAME_CONFIG.HEIGHT - 48, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#d0c8e0',
      lineSpacing: 3,
    });

    // Instructions
    this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 10,
      '[Left/Right] Direction | [Space] Walk/Idle | [G] Guides | [Esc] Title',
      {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#706880',
      }
    ).setOrigin(0.5);

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
      `Frame:     #${currentFrame} (64x64 cell, Foot Baseline Y=56)`,
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
    const halfCell = 32;

    // 64x64 bounding box in subtle cyan
    this.guidesGraphics.lineStyle(1, 0x3d85a8, 0.6);
    this.guidesGraphics.strokeRect(cx - halfCell, cy - halfCell, 64, 64);

    // Red foot baseline (Y=56 in cell, so cy - halfCell + 56 = cy - 32 + 56 = cy + 24)
    const baselineY = cy - halfCell + DEATH_MANIFEST.footBaseline;
    this.guidesGraphics.lineStyle(1, 0xd43d48, 0.8);
    this.guidesGraphics.lineBetween(cx - halfCell, baselineY, cx + halfCell, baselineY);
  }

  private updateDisplay(): void {
    this.applyDirection();
  }
}
