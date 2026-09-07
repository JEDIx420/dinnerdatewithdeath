import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Generate crisp temporary procedural textures for engine validation
    this.createPlaceholderTextures();
  }

  public create(): void {
    this.scene.start('TitleScene');
  }

  private createPlaceholderTextures(): void {
    // 1. Floor tile (16x16 dark gothic wood plank)
    const floorGfx = this.make.graphics({ x: 0, y: 0 });
    floorGfx.fillStyle(0x1a1622, 1);
    floorGfx.fillRect(0, 0, 16, 16);
    floorGfx.fillStyle(0x221d2e, 1);
    floorGfx.fillRect(0, 0, 15, 1);
    floorGfx.fillRect(0, 8, 15, 1);
    floorGfx.fillStyle(0x120f18, 1);
    floorGfx.fillRect(0, 7, 16, 1);
    floorGfx.fillRect(0, 15, 16, 1);
    floorGfx.generateTexture('tile_floor', 16, 16);
    floorGfx.destroy();

    // 2. Wall tile (16x16 dark gothic stone)
    const wallGfx = this.make.graphics({ x: 0, y: 0 });
    wallGfx.fillStyle(0x282333, 1);
    wallGfx.fillRect(0, 0, 16, 16);
    wallGfx.fillStyle(0x383147, 1);
    wallGfx.fillRect(0, 0, 16, 2);
    wallGfx.fillStyle(0x15121c, 1);
    wallGfx.fillRect(0, 14, 16, 2);
    wallGfx.fillRect(7, 2, 2, 12);
    wallGfx.generateTexture('tile_wall', 16, 16);
    wallGfx.destroy();

    // 3. Dinner table obstacle (48x24 dark mahogany with crimson runner)
    const tableGfx = this.make.graphics({ x: 0, y: 0 });
    tableGfx.fillStyle(0x2e1a1c, 1);
    tableGfx.fillRect(0, 0, 48, 24);
    // Table legs / border shadow
    tableGfx.fillStyle(0x150b0c, 1);
    tableGfx.strokeRect(0, 0, 48, 24);
    // Crimson table runner
    tableGfx.fillStyle(0x6b1420, 1);
    tableGfx.fillRect(8, 2, 32, 20);
    // Placeholders for wine goblets
    tableGfx.fillStyle(0xdedede, 1);
    tableGfx.fillRect(16, 8, 3, 3);
    tableGfx.fillRect(29, 8, 3, 3);
    tableGfx.generateTexture('obstacle_table', 48, 24);
    tableGfx.destroy();

    // 4. Mirror obstacle (16x32 gothic silver mirror)
    const mirrorGfx = this.make.graphics({ x: 0, y: 0 });
    mirrorGfx.fillStyle(0x3c3845, 1);
    mirrorGfx.fillRect(0, 0, 16, 32);
    mirrorGfx.fillStyle(0x6f7d8c, 1);
    mirrorGfx.fillRect(2, 4, 12, 24);
    mirrorGfx.fillStyle(0xa9b7c6, 1);
    mirrorGfx.fillRect(3, 6, 3, 10); // reflection streak
    mirrorGfx.generateTexture('obstacle_mirror', 16, 32);
    mirrorGfx.destroy();

    // 5. Pillar / Candelabra obstacle (16x32)
    const pillarGfx = this.make.graphics({ x: 0, y: 0 });
    pillarGfx.fillStyle(0x252030, 1);
    pillarGfx.fillRect(2, 8, 12, 24);
    pillarGfx.fillStyle(0x916d2b, 1);
    pillarGfx.fillRect(4, 2, 8, 6);
    // Candle flame (amber pixel)
    pillarGfx.fillStyle(0xe5a337, 1);
    pillarGfx.fillRect(7, 0, 2, 2);
    pillarGfx.generateTexture('obstacle_pillar', 16, 32);
    pillarGfx.destroy();

    // 6. Temporary Player Placeholder (16x22 pale face, black formal coat, red tie)
    // Clearly identifiable and temporary until asset extraction milestone.
    const playerGfx = this.make.graphics({ x: 0, y: 0 });
    // Hair (black)
    playerGfx.fillStyle(0x111115, 1);
    playerGfx.fillRect(4, 1, 8, 5);
    // Pale face
    playerGfx.fillStyle(0xe2d7d5, 1);
    playerGfx.fillRect(5, 4, 6, 5);
    // Eyes
    playerGfx.fillStyle(0x111115, 1);
    playerGfx.fillRect(6, 6, 1, 1);
    playerGfx.fillRect(9, 6, 1, 1);
    // Red tie / cravat
    playerGfx.fillStyle(0x8f1922, 1);
    playerGfx.fillRect(7, 9, 2, 3);
    // Black coat & body
    playerGfx.fillStyle(0x18181f, 1);
    playerGfx.fillRect(3, 9, 10, 8);
    // Trousers / shoes
    playerGfx.fillStyle(0x0c0c10, 1);
    playerGfx.fillRect(4, 17, 3, 5);
    playerGfx.fillRect(9, 17, 3, 5);
    playerGfx.generateTexture('player_placeholder', 16, 22);
    playerGfx.destroy();
  }
}
