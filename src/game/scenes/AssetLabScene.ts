import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { DEATH_MANIFEST } from '../entities/deathManifest';
import { Direction } from '../entities/CharacterManifest';
import { EnvironmentAssetCatalog } from '../environment/EnvironmentAssetCatalog';
import { getCollisionProfile } from '../environment/CollisionProfile';
import { EnvironmentAssetDef } from '../environment/EnvironmentAsset';

type LabTab = 'characters' | 'environment';

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

  // --- Environment QA state ---
  private envContainer!: Phaser.GameObjects.Container;
  private readonly packIds: string[] = [
    'mansion_architecture',
    'ddwd_env_02',
    'ddwd_env_03',
    'ddwd_env_04',
    'ddwd_env_05',
    'ddwd_env_06',
    'ddwd_env_07',
    'ddwd_env_08',
    'ddwd_env_11',
  ];
  private selectedPackIndex: number = 0;
  private selectedCategoryIndex: number = 0;
  private selectedAssetIndex: number = 0;
  private envInfoText!: Phaser.GameObjects.Text;
  private envPreviewSprite!: Phaser.GameObjects.Sprite;
  private envGuidesGraphics!: Phaser.GameObjects.Graphics;
  private headerText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'AssetLabScene' });
  }

  public create(): void {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'architecture' || params.get('tab') === 'environment') {
      this.activeTab = 'environment';
    }

    const bg = this.add.graphics();
    bg.fillStyle(0x14141c, 1);
    bg.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);

    this.headerText = this.add.text(GAME_CONFIG.WIDTH / 2, 22, '', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#c8bfe7',
      align: 'center',
    }).setOrigin(0.5);

    this.createCharacterQA();
    this.createEnvironmentQA();
    this.setupInputs();

    this.switchTab(this.activeTab);
  }

  private switchTab(tab: LabTab): void {
    this.activeTab = tab;
    if (tab === 'characters') {
      this.charContainer.setVisible(true);
      this.envContainer.setVisible(false);
      this.headerText.setText('— ASSET LAB: CHARACTER QA [C] —');
      this.updateCharDisplay();
    } else {
      this.charContainer.setVisible(false);
      this.envContainer.setVisible(true);
      this.headerText.setText('— ASSET LAB: ENVIRONMENT PACK QA [E] —');
      this.updateEnvDisplay();
    }
  }

  private createCharacterQA(): void {
    const cx = GAME_CONFIG.WIDTH / 2;
    const cy = GAME_CONFIG.HEIGHT / 2 - 25;

    this.charContainer = this.add.container(0, 0);

    this.guidesGraphics = this.add.graphics();
    this.drawCharGuides(cx, cy);
    this.charContainer.add(this.guidesGraphics);

    const initialDir = this.directions[this.currentDirectionIndex]!;
    this.previewSprite = this.add.sprite(
      cx,
      cy,
      DEATH_MANIFEST.textureKey,
      DEATH_MANIFEST.animations[`walk_${initialDir}`].idleFrame
    );
    this.previewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.charContainer.add(this.previewSprite);

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

  private createEnvironmentQA(): void {
    const cx = GAME_CONFIG.WIDTH / 2;
    const cy = GAME_CONFIG.HEIGHT / 2 - 25;

    this.envContainer = this.add.container(0, 0);

    this.envGuidesGraphics = this.add.graphics();
    this.envContainer.add(this.envGuidesGraphics);

    const allAssets = EnvironmentAssetCatalog.getAllAssets();
    const firstAsset = allAssets[0]!;

    this.envPreviewSprite = this.add.sprite(cx, cy, firstAsset.textureKey);
    this.envPreviewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.envContainer.add(this.envPreviewSprite);

    this.envInfoText = this.add.text(24, GAME_CONFIG.HEIGHT - 130, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#dcd4ec',
      lineSpacing: 3,
    });
    this.envContainer.add(this.envInfoText);

    const envControls = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 28,
      '[P] Cycle Pack | [Up/Down] Category | [Left/Right] Asset | [Tab] Switch Mode',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#9a90b4',
      }
    ).setOrigin(0.5);
    this.envContainer.add(envControls);
  }

  private setupInputs(): void {
    this.input.keyboard?.on('keydown-TAB', (e: KeyboardEvent) => {
      e.preventDefault();
      this.switchTab(this.activeTab === 'characters' ? 'environment' : 'characters');
    });

    this.input.keyboard?.on('keydown-C', () => this.switchTab('characters'));
    this.input.keyboard?.on('keydown-A', () => this.switchTab('environment'));
    this.input.keyboard?.on('keydown-E', () => this.switchTab('environment'));

    this.input.keyboard?.on('keydown-P', () => {
      if (this.activeTab === 'environment') {
        this.selectedPackIndex = (this.selectedPackIndex + 1) % this.packIds.length;
        this.selectedCategoryIndex = 0;
        this.selectedAssetIndex = 0;
        this.updateEnvDisplay();
      }
    });

    this.input.keyboard?.on('keydown-UP', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('up');
      } else {
        this.cycleCategory(-1);
      }
    });
    this.input.keyboard?.on('keydown-DOWN', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('down');
      } else {
        this.cycleCategory(1);
      }
    });
    this.input.keyboard?.on('keydown-LEFT', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('left');
      } else {
        this.cycleAsset(-1);
      }
    });
    this.input.keyboard?.on('keydown-RIGHT', () => {
      if (this.activeTab === 'characters') {
        this.setDirection('right');
      } else {
        this.cycleAsset(1);
      }
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.activeTab === 'characters') {
        this.isWalking = !this.isWalking;
        this.updateCharDisplay();
      }
    });

    this.input.keyboard?.on('keydown-G', () => {
      if (this.activeTab === 'characters') {
        this.showGuides = !this.showGuides;
        this.guidesGraphics.setVisible(this.showGuides);
      }
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('TitleScene');
    });
  }

  private setDirection(dir: Direction): void {
    const idx = this.directions.indexOf(dir);
    if (idx !== -1) {
      this.currentDirectionIndex = idx;
      this.updateCharDisplay();
    }
  }

  private updateCharDisplay(): void {
    const dir = this.directions[this.currentDirectionIndex]!;
    const animKey = `${DEATH_MANIFEST.id}_walk_${dir}`;

    if (this.isWalking) {
      if (!this.previewSprite.anims.isPlaying || this.previewSprite.anims.currentAnim?.key !== animKey) {
        this.previewSprite.play(animKey);
      }
    } else {
      this.previewSprite.anims.stop();
      this.previewSprite.setFrame(DEATH_MANIFEST.animations[`walk_${dir}`].idleFrame);
    }

    this.charInfoText.setText([
      `Character:   ${DEATH_MANIFEST.displayName} (${DEATH_MANIFEST.id})`,
      `Direction:   ${dir.toUpperCase()}`,
      `State:       ${this.isWalking ? 'WALKING (Animated)' : 'IDLE (Static Frame)'}`,
      `Frame Rate:  ${DEATH_MANIFEST.frameRate} FPS`,
      `Cell Size:   ${DEATH_MANIFEST.frameWidth} × ${DEATH_MANIFEST.frameHeight} px`,
    ]);
  }

  private drawCharGuides(cx: number, cy: number): void {
    this.guidesGraphics.clear();
    const halfCell = DEATH_MANIFEST.frameWidth / 2;

    this.guidesGraphics.lineStyle(1, 0x3d85a8, 0.65);
    this.guidesGraphics.strokeRect(cx - halfCell, cy - halfCell, DEATH_MANIFEST.frameWidth, DEATH_MANIFEST.frameHeight);

    const baselineY = cy - halfCell + DEATH_MANIFEST.footBaseline;
    this.guidesGraphics.lineStyle(1, 0xd43d48, 0.85);
    this.guidesGraphics.lineBetween(cx - halfCell, baselineY, cx + halfCell, baselineY);
  }

  // --- Environment Pack Logic ---
  private getCurrentPackAssets(): EnvironmentAssetDef[] {
    const packId = this.packIds[this.selectedPackIndex]!;
    return EnvironmentAssetCatalog.getAssetsByPack(packId);
  }

  private getCurrentPackCategories(): string[] {
    const assets = this.getCurrentPackAssets();
    return Array.from(new Set(assets.map((a) => a.category)));
  }

  private getCategoryAssets(): EnvironmentAssetDef[] {
    const cats = this.getCurrentPackCategories();
    const currentCat = cats[this.selectedCategoryIndex] || cats[0];
    return this.getCurrentPackAssets().filter((a) => a.category === currentCat);
  }

  private cycleCategory(delta: number): void {
    const cats = this.getCurrentPackCategories();
    if (cats.length === 0) return;
    this.selectedCategoryIndex = (this.selectedCategoryIndex + delta + cats.length) % cats.length;
    this.selectedAssetIndex = 0;
    this.updateEnvDisplay();
  }

  private cycleAsset(delta: number): void {
    const assets = this.getCategoryAssets();
    if (assets.length === 0) return;
    this.selectedAssetIndex = (this.selectedAssetIndex + delta + assets.length) % assets.length;
    this.updateEnvDisplay();
  }

  private updateEnvDisplay(): void {
    const packId = this.packIds[this.selectedPackIndex]!;
    const cats = this.getCurrentPackCategories();
    const cat = cats[this.selectedCategoryIndex] || cats[0] || 'all';
    const assets = this.getCategoryAssets();
    const assetDef = assets[this.selectedAssetIndex] || assets[0];

    if (!assetDef) return;

    if (assetDef.frame && this.textures.get(assetDef.textureKey).has(assetDef.frame)) {
      this.envPreviewSprite.setTexture(assetDef.textureKey, assetDef.frame);
    } else {
      this.envPreviewSprite.setTexture(assetDef.textureKey);
    }

    const centerX = GAME_CONFIG.WIDTH / 2;
    const centerY = GAME_CONFIG.HEIGHT / 2 - 25;
    this.envPreviewSprite.setPosition(centerX, centerY);
    this.envPreviewSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    const frame = this.envPreviewSprite.frame;
    const w = frame ? frame.width : assetDef.nativeWidth;
    const h = frame ? frame.height : assetDef.nativeHeight;

    const spriteLeft = centerX - w / 2;
    const spriteTop = centerY - h / 2;
    const spriteBottom = centerY + h / 2;

    this.envGuidesGraphics.clear();

    // 1. Sprite bounding box (slate blue)
    this.envGuidesGraphics.lineStyle(1, 0x5a7090, 0.7);
    this.envGuidesGraphics.strokeRect(spriteLeft, spriteTop, w, h);

    // 2. Crosshairs through center
    this.envGuidesGraphics.lineStyle(1, 0x3d4860, 0.3);
    this.envGuidesGraphics.lineBetween(spriteLeft - 10, centerY, spriteLeft + w + 10, centerY);
    this.envGuidesGraphics.lineBetween(centerX, spriteTop - 10, centerX, spriteBottom + 10);

    // 3. Ground Anchor point (Yellow crosshair + dot)
    let anchorX = centerX;
    let anchorY = spriteBottom;
    if (assetDef.anchorPreset === 'top-left') {
      anchorX = spriteLeft;
      anchorY = spriteTop;
    } else if (assetDef.anchorPreset === 'center') {
      anchorX = centerX;
      anchorY = centerY;
    } else if (assetDef.anchorPreset === 'bottom-left') {
      anchorX = spriteLeft;
      anchorY = spriteBottom;
    } else if (assetDef.anchorPreset === 'bottom-right') {
      anchorX = spriteLeft + w;
      anchorY = spriteBottom;
    }

    this.envGuidesGraphics.lineStyle(1, 0xffe600, 0.9);
    this.envGuidesGraphics.lineBetween(anchorX - 8, anchorY, anchorX + 8, anchorY);
    this.envGuidesGraphics.lineBetween(anchorX, anchorY - 8, anchorX, anchorY + 8);
    this.envGuidesGraphics.fillStyle(0xffe600, 1.0);
    this.envGuidesGraphics.fillCircle(anchorX, anchorY, 2.5);

    // 4. Physical Collision Footprint (Green outline)
    const colProfile = getCollisionProfile(assetDef.collisionProfile);
    if (colProfile && colProfile.id !== 'none' && colProfile.footprint.width > 0) {
      const fp = colProfile.footprint;
      const fpLeft = anchorX - fp.width / 2 + fp.offsetX;
      const fpTop = anchorY + fp.offsetY - fp.height / 2;

      this.envGuidesGraphics.fillStyle(0x00ff88, 0.25);
      this.envGuidesGraphics.fillRect(fpLeft, fpTop, fp.width, fp.height);
      this.envGuidesGraphics.lineStyle(1, 0x00ff88, 0.95);
      this.envGuidesGraphics.strokeRect(fpLeft, fpTop, fp.width, fp.height);
    }

    // 5. Light Sockets (Blue circles)
    if (assetDef.lightSockets && assetDef.lightSockets.length > 0) {
      this.envGuidesGraphics.fillStyle(0x0099ff, 1.0);
      this.envGuidesGraphics.lineStyle(1, 0x0099ff, 0.85);
      for (const socket of assetDef.lightSockets) {
        const sx = spriteLeft + socket.localX;
        const sy = spriteTop + socket.localY;
        this.envGuidesGraphics.fillCircle(sx, sy, 3);
        this.envGuidesGraphics.strokeCircle(sx, sy, 7);
      }
    }

    const collisionStr = colProfile.id !== 'none'
      ? `${colProfile.name} (${colProfile.footprint.width}×${colProfile.footprint.height}px)`
      : 'NONE';

    const socketsCount = assetDef.lightSockets ? assetDef.lightSockets.length : 0;

    this.envInfoText.setText([
      `Pack:             ${packId.toUpperCase()} (${this.selectedPackIndex + 1}/${this.packIds.length})`,
      `Category:         ${cat.toUpperCase()} (${this.selectedCategoryIndex + 1}/${cats.length})`,
      `Asset ID:         ${assetDef.id} (${this.selectedAssetIndex + 1}/${assets.length})`,
      `Dimensions:       ${w} × ${h} px | Anchor: ${assetDef.anchorPreset}`,
      `Depth Tier:       ${assetDef.depthClass.toUpperCase()} | Physical: ${assetDef.physicalClass.toUpperCase()}`,
      `Collision:        ${collisionStr}`,
      `Light Sockets:    ${socketsCount} sockets | Filter: NEAREST (Crisp)`,
    ]);
  }
}
