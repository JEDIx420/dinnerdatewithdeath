import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { DEATH_MANIFEST } from '../entities/deathManifest';
import { Direction } from '../entities/CharacterManifest';
import {
  ARCHITECTURE_TEXTURE_KEYS,
  CATEGORY_MAP,
  ArchitectureCategory,
} from '../assets/mansionArchitecture';

type LabTab = 'characters' | 'architecture';

export class AssetLabScene extends Phaser.Scene {
  private activeTab: LabTab = 'characters';

  // --- Character QA state ---
  private currentDirectionIndex: number = 0;
  private readonly directions: Direction[] = ['down', 'left', 'right', 'up'];
  private isWalking: boolean = false;
  private showGuides: boolean = true;
  private charContainer!: Phaser.GameObjects.Container;
  private previewSprite!: Phaser.GameObjects.Sprite;
  private guidesGraphics!: Phaser.GameObjects.Graphics;
  private charInfoText!: Phaser.GameObjects.Text;

  // --- Architecture QA state ---
  private archContainer!: Phaser.GameObjects.Container;
  private readonly archCategories: ArchitectureCategory[] = [
    'floors',
    'carpets',
    'walls',
    'trims',
    'columns_arches',
    'stairs_balustrade',
    'ornaments',
  ];
  private selectedCategoryIndex: number = 0;
  private selectedAssetIndex: number = 0;
  private archInfoText!: Phaser.GameObjects.Text;
  private archPreviewSprite!: Phaser.GameObjects.Sprite;
  private archGuidesGraphics!: Phaser.GameObjects.Graphics;
  private headerText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'AssetLabScene' });
  }

  public create(): void {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'architecture') {
      this.activeTab = 'architecture';
    }

    // Dark neutral background
    const bg = this.add.graphics();
    bg.fillStyle(0x14141c, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    // Title / Header
    this.headerText = this.add
      .text(GAME_CONFIG.WIDTH / 2, 22, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#b0a4c8',
      })
      .setOrigin(0.5);

    // Instructions bar at bottom
    this.add
      .text(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT - 16,
        '[Tab / C / A] Switch Mode | [Esc] Return to Title',
        {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#7a7288',
        }
      )
      .setOrigin(0.5);

    this.createCharacterQA();
    this.createArchitectureQA();

    // Setup input listeners
    this.setupInputs();

    this.switchTab(this.activeTab);
  }

  private createCharacterQA(): void {
    const cx = GAME_CONFIG.WIDTH / 2;
    const cy = GAME_CONFIG.HEIGHT / 2 - 20;

    this.charContainer = this.add.container(0, 0);

    // Visual Guides (128x128 box & red baseline at Y=112)
    this.guidesGraphics = this.add.graphics();
    this.drawCharGuides(cx, cy);
    this.charContainer.add(this.guidesGraphics);

    // Character Sprite
    const initialDir = this.directions[this.currentDirectionIndex]!;
    this.previewSprite = this.add.sprite(
      cx,
      cy,
      DEATH_MANIFEST.textureKey,
      DEATH_MANIFEST.animations[`walk_${initialDir}`].idleFrame
    );
    this.previewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.charContainer.add(this.previewSprite);

    // Info overlay text
    this.charInfoText = this.add.text(24, GAME_CONFIG.HEIGHT - 110, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#dcd4ec',
      lineSpacing: 4,
    });
    this.charContainer.add(this.charInfoText);

    const charControls = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 38,
      '[Arrows] Direction | [Space] Walk/Idle | [G] Guides',
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#9a90b4',
      }
    ).setOrigin(0.5);
    this.charContainer.add(charControls);
  }

  private createArchitectureQA(): void {
    const cx = GAME_CONFIG.WIDTH / 2;
    const cy = GAME_CONFIG.HEIGHT / 2 - 25;

    this.archContainer = this.add.container(0, 0);

    // Guides graphics for architecture
    this.archGuidesGraphics = this.add.graphics();
    this.archContainer.add(this.archGuidesGraphics);

    // Preview Sprite
    const initialKey = ARCHITECTURE_TEXTURE_KEYS[0];
    this.archPreviewSprite = this.add.sprite(cx, cy, initialKey);
    this.archPreviewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.archContainer.add(this.archPreviewSprite);

    // Info text
    this.archInfoText = this.add.text(24, GAME_CONFIG.HEIGHT - 120, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#dcd4ec',
      lineSpacing: 4,
    });
    this.archContainer.add(this.archInfoText);

    const archControls = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 38,
      '[Left/Right] Asset | [Up/Down] Category | [1-5] Composed Samples',
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#9a90b4',
      }
    ).setOrigin(0.5);
    this.archContainer.add(archControls);
  }

  private setupInputs(): void {
    this.input.keyboard?.on('keydown-TAB', (e: KeyboardEvent) => {
      e.preventDefault();
      this.switchTab(this.activeTab === 'characters' ? 'architecture' : 'characters');
    });

    this.input.keyboard?.on('keydown-C', () => {
      this.switchTab('characters');
    });

    this.input.keyboard?.on('keydown-A', () => {
      this.switchTab('architecture');
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });

    // Character QA keys
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.activeTab === 'characters') {
        this.toggleAnimation();
      }
    });

    this.input.keyboard?.on('keydown-G', () => {
      if (this.activeTab === 'characters') {
        this.showGuides = !this.showGuides;
        this.guidesGraphics.setVisible(this.showGuides);
      }
    });

    // Arrow keys
    this.input.keyboard?.on('keydown-LEFT', () => {
      if (this.activeTab === 'characters') {
        this.cycleDirection(-1);
      } else {
        this.cycleArchAsset(-1);
      }
    });

    this.input.keyboard?.on('keydown-RIGHT', () => {
      if (this.activeTab === 'characters') {
        this.cycleDirection(1);
      } else {
        this.cycleArchAsset(1);
      }
    });

    this.input.keyboard?.on('keydown-UP', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('up');
      } else {
        this.cycleArchCategory(-1);
      }
    });

    this.input.keyboard?.on('keydown-DOWN', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('down');
      } else {
        this.cycleArchCategory(1);
      }
    });
  }

  private switchTab(tab: LabTab): void {
    this.activeTab = tab;
    if (tab === 'characters') {
      this.headerText.setText('— ASSET LAB: CHARACTER QA [C] —');
      this.charContainer.setVisible(true);
      this.archContainer.setVisible(false);
      this.applyDirection();
    } else {
      this.headerText.setText('— ASSET LAB: ARCHITECTURE QA [A] —');
      this.charContainer.setVisible(false);
      this.archContainer.setVisible(true);
      this.updateArchDisplay();
    }
  }

  public update(): void {
    if (this.activeTab === 'characters') {
      const dir = this.directions[this.currentDirectionIndex]!;
      const animState = this.isWalking ? 'WALK (Looping)' : 'IDLE';
      const currentFrame = this.previewSprite.frame?.name ?? '0';

      this.charInfoText.setText([
        `Character: ${DEATH_MANIFEST.displayName} (${DEATH_MANIFEST.id})`,
        `Direction: ${dir.toUpperCase()} (Index ${this.currentDirectionIndex})`,
        `State:     ${animState}`,
        `Cell:      ${DEATH_MANIFEST.frameWidth} × ${DEATH_MANIFEST.frameHeight} px (Foot Baseline Y=${DEATH_MANIFEST.footBaseline}, Frame #${currentFrame})`,
        `Filter:    NEAREST`,
      ]);
    }
  }

  // --- Character Logic ---
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

  private drawCharGuides(cx: number, cy: number): void {
    this.guidesGraphics.clear();
    const halfCell = DEATH_MANIFEST.frameWidth / 2; // 64

    this.guidesGraphics.lineStyle(1, 0x3d85a8, 0.65);
    this.guidesGraphics.strokeRect(
      cx - halfCell,
      cy - halfCell,
      DEATH_MANIFEST.frameWidth,
      DEATH_MANIFEST.frameHeight
    );

    const baselineY = cy - halfCell + DEATH_MANIFEST.footBaseline;
    this.guidesGraphics.lineStyle(1, 0xd43d48, 0.85);
    this.guidesGraphics.lineBetween(
      cx - halfCell,
      baselineY,
      cx + halfCell,
      baselineY
    );
  }

  // --- Architecture Logic ---
  private getCategoryAssets(): string[] {
    const cat = this.archCategories[this.selectedCategoryIndex]!;
    return ARCHITECTURE_TEXTURE_KEYS.filter((key) => CATEGORY_MAP[key] === cat);
  }

  private cycleArchCategory(delta: number): void {
    this.selectedCategoryIndex =
      (this.selectedCategoryIndex + delta + this.archCategories.length) %
      this.archCategories.length;
    this.selectedAssetIndex = 0;
    this.updateArchDisplay();
  }

  private cycleArchAsset(delta: number): void {
    const assets = this.getCategoryAssets();
    if (assets.length === 0) return;
    this.selectedAssetIndex =
      (this.selectedAssetIndex + delta + assets.length) % assets.length;
    this.updateArchDisplay();
  }

  private updateArchDisplay(): void {
    const cat = this.archCategories[this.selectedCategoryIndex]!;
    const assets = this.getCategoryAssets();
    const key = assets[this.selectedAssetIndex] || assets[0];

    if (!key) return;

    this.archPreviewSprite.setTexture(key);
    this.archPreviewSprite.setPosition(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2 - 25);
    this.archPreviewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const frame = this.archPreviewSprite.frame;
    const w = frame ? frame.width : 0;
    const h = frame ? frame.height : 0;

    // Draw bounding box
    this.archGuidesGraphics.clear();
    this.archGuidesGraphics.lineStyle(1, 0x5a7090, 0.7);
    this.archGuidesGraphics.strokeRect(
      GAME_CONFIG.WIDTH / 2 - w / 2,
      GAME_CONFIG.HEIGHT / 2 - 25 - h / 2,
      w,
      h
    );

    // Crosshairs
    this.archGuidesGraphics.lineStyle(1, 0x3d4860, 0.4);
    this.archGuidesGraphics.lineBetween(
      GAME_CONFIG.WIDTH / 2 - w / 2 - 10,
      GAME_CONFIG.HEIGHT / 2 - 25,
      GAME_CONFIG.WIDTH / 2 + w / 2 + 10,
      GAME_CONFIG.HEIGHT / 2 - 25
    );
    this.archGuidesGraphics.lineBetween(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 25 - h / 2 - 10,
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 25 + h / 2 + 10
    );

    this.archInfoText.setText([
      `Category:    ${cat.toUpperCase()} (${this.selectedCategoryIndex + 1}/${this.archCategories.length})`,
      `Asset Key:   ${key} (${this.selectedAssetIndex + 1}/${assets.length})`,
      `Dimensions:  ${w} × ${h} px`,
      `Category Total: ${assets.length} items | Architecture Total: ${ARCHITECTURE_TEXTURE_KEYS.length} items`,
      `Filter:      NEAREST (Pixel-Crisp)`,
    ]);
  }
}
